import React from 'react';
import './App.css';

type NewsItem = { source: string; date: string; title: string; url: string };
type Player = {
  name: string;
  position: string;
  classYear: string;
  number: string;
  school: string;
  initials: string;
  image: string;
  schools: { name: string; years: string; colors: string; accent: string }[];
  nil: { partner: string; amount: string; detail: string }[];
  draft: { round: string; pick: string; note: string };
  news: NewsItem[];
};

const players: Player[] = [
  { name: 'Arch Manning', position: 'Quarterback', classYear: 'Sophomore', number: '16', school: 'Texas Longhorns', initials: 'AM', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Texas', years: '2023 — Present', colors: '#bf5700', accent: '#fff' }, { name: 'Newman', years: '2019 — 2023', colors: '#19355f', accent: '#f5c242' }], nil: [{ partner: 'Panini America', amount: '$1.2M', detail: 'Trading cards & collectibles' }, { partner: 'Athletic Brewing', amount: '$450K', detail: 'National campaign' }], draft: { round: 'Round 1', pick: 'Top 10 projection', note: 'Elite arm talent and pedigree with a high ceiling.' }, news: [{ source: 'ESPN', date: 'Sep 12, 2026', title: 'Arch Manning flashes command in Texas win', url: '#' }, { source: 'The Athletic', date: 'Sep 4, 2026', title: 'Why Manning is taking the long view in Austin', url: '#' }] },
  { name: 'Carson Beck', position: 'Quarterback', classYear: 'Senior', number: '6', school: 'Georgia Bulldogs', initials: 'CB', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Georgia', years: '2020 — Present', colors: '#ba0c2f', accent: '#fff' }, { name: 'Mandarin', years: '2017 — 2020', colors: '#082b57', accent: '#d6a84f' }], nil: [{ partner: 'Amazon', amount: '$800K', detail: 'Student athlete creator' }, { partner: 'Dicks Sporting Goods', amount: '$250K', detail: 'Football campaign' }], draft: { round: 'Round 2', pick: 'Pick 38 — 68 range', note: 'Pro-ready frame with steady pocket movement.' }, news: [{ source: 'CBS Sports', date: 'Sep 10, 2026', title: 'Beck and Georgia offense find another gear', url: '#' }, { source: 'Atlanta Journal-Constitution', date: 'Aug 28, 2026', title: 'Inside the leadership style of Carson Beck', url: '#' }] },
  { name: 'Nico Iamaleava', position: 'Quarterback', classYear: 'Junior', number: '8', school: 'Tennessee Volunteers', initials: 'NI', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Tennessee', years: '2024 — Present', colors: '#ff8200', accent: '#fff' }, { name: 'Long Beach Poly', years: '2020 — 2024', colors: '#006747', accent: '#fbc02d' }], nil: [{ partner: 'Nike', amount: '$900K', detail: 'Football footwear & apparel' }, { partner: 'Celsius', amount: '$300K', detail: 'Performance partner' }], draft: { round: 'Round 1', pick: 'Top 20 projection', note: 'Dynamic runner with rare off-platform accuracy.' }, news: [{ source: 'The Knoxville News-Sentinel', date: 'Sep 8, 2026', title: 'Iamaleava gives Vols a new dimension', url: '#' }, { source: 'On3', date: 'Aug 31, 2026', title: 'The next step in Nico Iamaleava’s development', url: '#' }] },
  { name: 'Jeremiah Smith', position: 'Wide Receiver', classYear: 'Sophomore', number: '4', school: 'Ohio State Buckeyes', initials: 'JS', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Ohio State', years: '2024 — Present', colors: '#bb0000', accent: '#fff' }, { name: 'Chaminade-Madonna', years: '2020 — 2024', colors: '#002d62', accent: '#f4c542' }], nil: [{ partner: 'New Balance', amount: '$1.5M', detail: 'Signature athlete partnership' }, { partner: 'Beats', amount: '$500K', detail: 'Culture & audio campaign' }], draft: { round: 'Round 1', pick: 'Top 5 projection', note: 'Complete receiver with star-level ball skills.' }, news: [{ source: 'Columbus Dispatch', date: 'Sep 13, 2026', title: 'Smith keeps rewriting the Ohio State record book', url: '#' }, { source: 'FOX Sports', date: 'Sep 2, 2026', title: 'Three traits separating Jeremiah Smith', url: '#' }] },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const rankPlayer = (player: Player, query: string) => {
  const name = normalize(player.name); const search = normalize(query);
  if (!search) return 0;
  if (name === search) return 100;
  if (name.startsWith(search)) return 80;
  if (name.includes(search)) return 60;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.every((token) => player.name.toLowerCase().includes(token)) ? 40 : 0;
};

function HelmetRail({ school, colors, accent, years, index }: { school: string; colors: string; accent: string; years: string; index: number }) {
  return <article className="helmet-card" style={{ background: colors, color: accent }}><div className="helmet-mark" aria-hidden="true">{school.slice(0, 2).toUpperCase()}</div><div><strong>{school}</strong><span>{years}</span></div><span className="helmet-shape" aria-hidden="true"><span /></span></article>;
}

const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Player | null>(null);
  const [dark, setDark] = React.useState(false);
  const suggestions = React.useMemo(() => players.map((player) => ({ player, score: rankPlayer(player, query) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map(({ player }) => player), [query]);
  const rails = [...players, ...players];

  return <div className={dark ? 'app dark' : 'app'}>
    <header className="topbar"><a className="wordmark" href="#top" aria-label="The Roster home"><span className="wordmark-dot" />THE ROSTER</a><nav><a href="#players">Players</a><a href="#about">About</a></nav><button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}><span>{dark ? '☼' : '◐'}</span><span>{dark ? 'Light' : 'Dark'}</span></button></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="eyebrow">College sports intelligence</p><h1>Know the player<br /><em>behind the play.</em></h1><p className="hero-lede">One clear view of college football’s rising stars — their game, their journey, and what comes next.</p><div className="search-wrap"><label htmlFor="player-search">Search for a player</label><div className="search-field"><span aria-hidden="true">⌕</span><input id="player-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “Arch Manning”" autoComplete="off" />{query && <button className="clear-button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}</div>{suggestions.length > 0 && <div className="suggestions" role="listbox">{suggestions.map((player) => <button key={player.name} onClick={() => { setSelected(player); setQuery(''); }} role="option"><span className="suggestion-avatar">{player.initials}</span><span><strong>{player.name}</strong><small>{player.position} · {player.school}</small></span><span className="suggestion-arrow">↗</span></button>)}</div>}</div><div className="popular"><span>Popular right now</span>{players.slice(0, 3).map((player) => <button key={player.name} onClick={() => setSelected(player)}>{player.name}</button>)}</div></div><div className="hero-art" aria-label="Football helmet display"><div className="art-stamp">Issue 04<br /><span>Fall 2026</span></div><div className="hero-helmet"><span className="helmet-face">T</span><span className="helmet-bar" /></div><p>Every story<br />has a roster.</p></div></section>
      <section className="programs" id="players"><div className="section-heading"><div><p className="eyebrow">The landscape</p><h2>Follow the <em>programs.</em></h2></div><p>Every player is shaped by the places<br />that gave them a start.</p></div><div className="rails">{[0, 1, 2].map((row) => <div className={`rail rail-${row % 2 === 0 ? 'left' : 'right'}`} key={row}><div className="rail-track">{rails.slice(row, row + 6).map((player, index) => <button key={`${row}-${index}`} onClick={() => setSelected(player)}><HelmetRail school={player.schools[0].name} colors={player.schools[0].colors} accent={player.schools[0].accent} years={player.schools[0].years} index={index} /></button>)}</div></div>)}</div></section>
      <section className="quiet-cta" id="about"><p className="eyebrow">Built for the curious</p><h2>The game is bigger<br />than the <em>box score.</em></h2><p>Profiles built from the details that make a player worth watching.</p></section>
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-name"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close player profile">×</button><div className="profile-head"><div className="profile-photo"><img src={selected.image} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><span>{selected.initials}</span></div><div><p className="eyebrow">{selected.position} · #{selected.number}</p><h2 id="profile-name">{selected.name}</h2><p>{selected.school} · {selected.classYear}</p></div></div><div className="profile-grid"><div><h3>School journey</h3><div className="school-timeline">{selected.schools.map((school) => <div className="timeline-item" key={school.name}><span className="timeline-dot" style={{ background: school.colors }} /><strong>{school.name}</strong><small>{school.years}</small></div>)}</div></div><div><h3>Draft outlook</h3><div className="draft-card"><strong>{selected.draft.round}</strong><b>{selected.draft.pick}</b><span>{selected.draft.note}</span></div></div></div><div className="profile-grid lower"><div><h3>NIL activity</h3><div className="nil-list">{selected.nil.map((item) => <div key={item.partner}><strong>{item.partner}</strong><b>{item.amount}</b><span>{item.detail}</span></div>)}</div></div><div><h3>Recent headlines</h3><div className="news-list">{selected.news.map((item) => <a href={item.url} key={item.title}><span>{item.source} · {item.date}</span><strong>{item.title}</strong><b>↗</b></a>)}</div></div></div></section></div>}
  </div>;
};

export default App;
