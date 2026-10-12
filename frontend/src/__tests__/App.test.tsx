import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import App from '../App';

let div: HTMLDivElement;
const originalFetch = global.fetch;
const fetchMock = jest.fn();
const mongoPlayer = { playerId: 'jadan-florida', name: 'Jadan Baugh', position: null, classYear: 'So', currentTeam: { name: 'Florida' } };
const response = (players: typeof mongoPlayer[]) => ({ ok: true, json: async () => ({ players }) } as Response);

beforeEach(() => {
  div = document.createElement('div');
  document.body.appendChild(div);
  fetchMock.mockReset();
  global.fetch = fetchMock;
  act(() => { ReactDOM.render(<App />, div); });
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(div); });
  div.remove();
  global.fetch = originalFetch;
});

async function search(query: string) {
  await act(async () => {
    const input = div.querySelector('input')!;
    input.value = query;
    Simulate.change(input);
  });
}

it('renders without fetching for an empty query', () => {
  expect(div.querySelector('input')).not.toBeNull();
  expect(fetchMock).not.toHaveBeenCalled();
});

it('shows MongoDB results and opens an imported player with missing profile fields', async () => {
  fetchMock.mockResolvedValue(response([mongoPlayer]));
  await search('jadan bauhg');
  expect(fetchMock).toHaveBeenCalledWith('/api/players?q=jadan%20bauhg&limit=4', expect.objectContaining({ signal: expect.anything() }));
  expect(div.querySelector('[role="listbox"]')!.textContent).toContain('Jadan Baugh');
  expect(div.querySelector('[role="listbox"]')!.textContent).toContain('Florida');
  act(() => { Simulate.click(div.querySelector<HTMLButtonElement>('[role="option"]')!); });
  expect(div.querySelector('[role="dialog"]')!.textContent).toContain('Jadan Baugh');
  expect(div.querySelector('[role="dialog"]')!.textContent).toContain('School history unavailable.');
  expect(div.querySelector('[role="listbox"]')).toBeNull();
});

it('uses MongoDB data even when the player has the same name as a demo profile', async () => {
  fetchMock.mockResolvedValue(response([{ ...mongoPlayer, name: 'Arch Manning' }]));
  await search('arch');
  act(() => { Simulate.click(div.querySelector<HTMLButtonElement>('[role="option"]')!); });
  expect(div.querySelector('[role="dialog"]')!.textContent).toContain('Florida');
  expect(div.querySelector('[role="dialog"]')!.textContent).not.toContain('Panini America');
});

it('shows an empty state without falling back to demo players', async () => {
  fetchMock.mockResolvedValue(response([]));
  await search('arch');
  expect(div.querySelector('[role="listbox"]')).toBeNull();
  expect(div.querySelector('[role="status"]')!.textContent).toBe('No players found.');
});

it('shows request failures without falling back to demo players', async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await search('arch');
  expect(div.querySelector('[role="listbox"]')).toBeNull();
  expect(div.querySelector('[role="status"]')!.textContent).toBe('Player search unavailable. Please try again.');
});

it('ignores older responses and keeps the latest search loading', async () => {
  let resolveOld!: (value: Response) => void;
  let resolveNew!: (value: Response) => void;
  fetchMock.mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveOld = resolve; }));
  fetchMock.mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveNew = resolve; }));
  await search('arch');
  await search('jadan');
  await act(async () => { resolveOld(response([{ ...mongoPlayer, name: 'Arch Manning' }])); });
  expect(div.querySelector('[role="listbox"]')).toBeNull();
  expect(div.querySelector('[role="status"]')!.textContent).toBe('Searching…');
  await act(async () => { resolveNew(response([mongoPlayer])); });
  expect(div.querySelector('[role="listbox"]')!.textContent).toContain('Jadan Baugh');
  expect(div.querySelector('[role="listbox"]')!.textContent).not.toContain('Arch Manning');
});
