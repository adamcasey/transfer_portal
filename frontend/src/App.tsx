import React from 'react';
import './App.css';

type NewsItem = { source: string; date: string; title: string; url: string };
type Player = {
  name: string;
  position: string;
  classYear: string;
  playerId?: string;
  number?: string;
  school: string;
  initials: string;
  image?: string;
  schools?: { name: string; years: string; colors: string; accent: string }[];
  nil?: { partner: string; amount: string; detail: string }[];
  draft?: { round: string; pick: string; note: string };
  news?: NewsItem[];
  bio?: { displayHeight?: string; displayWeight?: string; birthPlace?: { city?: string; state?: string } };
};

const players: Player[] = [
  { name: 'Arch Manning', position: 'Quarterback', classYear: 'Sophomore', number: '16', school: 'Texas Longhorns', initials: 'AM', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Texas', years: '2023 — Present', colors: '#bf5700', accent: '#fff' }, { name: 'Newman', years: '2019 — 2023', colors: '#19355f', accent: '#f5c242' }], nil: [{ partner: 'Panini America', amount: '$1.2M', detail: 'Trading cards & collectibles' }, { partner: 'Athletic Brewing', amount: '$450K', detail: 'National campaign' }], draft: { round: 'Round 1', pick: 'Top 10 projection', note: 'Elite arm talent and pedigree with a high ceiling.' }, news: [{ source: 'ESPN', date: 'Sep 12, 2026', title: 'Arch Manning flashes command in Texas win', url: '#' }, { source: 'The Athletic', date: 'Sep 4, 2026', title: 'Why Manning is taking the long view in Austin', url: '#' }] },
  { name: 'Carson Beck', position: 'Quarterback', classYear: 'Senior', number: '6', school: 'Georgia Bulldogs', initials: 'CB', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Georgia', years: '2020 — Present', colors: '#ba0c2f', accent: '#fff' }, { name: 'Mandarin', years: '2017 — 2020', colors: '#082b57', accent: '#d6a84f' }], nil: [{ partner: 'Amazon', amount: '$800K', detail: 'Student athlete creator' }, { partner: 'Dicks Sporting Goods', amount: '$250K', detail: 'Football campaign' }], draft: { round: 'Round 2', pick: 'Pick 38 — 68 range', note: 'Pro-ready frame with steady pocket movement.' }, news: [{ source: 'CBS Sports', date: 'Sep 10, 2026', title: 'Beck and Georgia offense find another gear', url: '#' }, { source: 'Atlanta Journal-Constitution', date: 'Aug 28, 2026', title: 'Inside the leadership style of Carson Beck', url: '#' }] },
  { name: 'Nico Iamaleava', position: 'Quarterback', classYear: 'Junior', number: '8', school: 'Tennessee Volunteers', initials: 'NI', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Tennessee', years: '2024 — Present', colors: '#ff8200', accent: '#fff' }, { name: 'Long Beach Poly', years: '2020 — 2024', colors: '#006747', accent: '#fbc02d' }], nil: [{ partner: 'Nike', amount: '$900K', detail: 'Football footwear & apparel' }, { partner: 'Celsius', amount: '$300K', detail: 'Performance partner' }], draft: { round: 'Round 1', pick: 'Top 20 projection', note: 'Dynamic runner with rare off-platform accuracy.' }, news: [{ source: 'The Knoxville News-Sentinel', date: 'Sep 8, 2026', title: 'Iamaleava gives Vols a new dimension', url: '#' }, { source: 'On3', date: 'Aug 31, 2026', title: 'The next step in Nico Iamaleava’s development', url: '#' }] },
  { name: 'Jeremiah Smith', position: 'Wide Receiver', classYear: 'Sophomore', number: '4', school: 'Ohio State Buckeyes', initials: 'JS', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=700&q=85', schools: [{ name: 'Ohio State', years: '2024 — Present', colors: '#bb0000', accent: '#fff' }, { name: 'Chaminade-Madonna', years: '2020 — 2024', colors: '#002d62', accent: '#f4c542' }], nil: [{ partner: 'New Balance', amount: '$1.5M', detail: 'Signature athlete partnership' }, { partner: 'Beats', amount: '$500K', detail: 'Culture & audio campaign' }], draft: { round: 'Round 1', pick: 'Top 5 projection', note: 'Complete receiver with star-level ball skills.' }, news: [{ source: 'Columbus Dispatch', date: 'Sep 13, 2026', title: 'Smith keeps rewriting the Ohio State record book', url: '#' }, { source: 'FOX Sports', date: 'Sep 2, 2026', title: 'Three traits separating Jeremiah Smith', url: '#' }] },
];

const fbsPrograms = [
  ['Air Force', '#003087', '#fff'], ['Akron', '#041e42', '#fff'], ['Alabama', '#9e1b32', '#fff'], ['Appalachian State', '#222', '#f2b134'], ['Arizona', '#003366', '#cc0033'], ['Arizona State', '#8c1d40', '#ffc627'], ['Arkansas', '#9d2235', '#fff'], ['Arkansas State', '#cc092f', '#222'], ['Army', '#000', '#d4af37'], ['Auburn', '#0c2340', '#f26522'], ['Ball State', '#ba0c2f', '#fff'], ['Baylor', '#154734', '#ffb81c'], ['Boise State', '#0033a0', '#d64309'], ['Boston College', '#8a1538', '#c4ced4'], ['Bowling Green', '#4f2c1d', '#f58220'], ['Buffalo', '#005bbb', '#fff'], ['BYU', '#002e5d', '#fff'], ['California', '#003262', '#fdb515'], ['Central Michigan', '#6a0032', '#f5aa1c'], ['Charlotte', '#00703c', '#f2c75c'], ['Cincinnati', '#e00122', '#fff'], ['Clemson', '#f56600', '#522d80'], ['Coastal Carolina', '#006f71', '#c7c8ca'], ['Colorado', '#000', '#cfb87c'], ['Colorado State', '#1e4d2b', '#c8c372'], ['Connecticut', '#000e2f', '#fff'], ['Duke', '#003087', '#fff'], ['East Carolina', '#592a8a', '#fdb927'], ['Eastern Michigan', '#006633', '#fff'], ['FIU', '#081e3f', '#b6862c'], ['Florida', '#0021a5', '#fa4616'], ['Florida Atlantic', '#003366', '#cc0000'], ['Florida State', '#782f40', '#ceb888'], ['Fresno State', '#db0032', '#002e6d'], ['Georgia', '#ba0c2f', '#fff'], ['Georgia Southern', '#041e42', '#fff'], ['Georgia State', '#0039a6', '#cc0000'], ['Georgia Tech', '#b3a369', '#003057'], ['Hawaii', '#024731', '#fff'], ['Houston', '#c8102e', '#fff'], ['Illinois', '#13294b', '#e84a27'], ['Indiana', '#990000', '#fff'], ['Iowa', '#000', '#fcd116'], ['Iowa State', '#c8102e', '#f1be48'], ['James Madison', '#450084', '#cbb677'], ['Kansas', '#0051ba', '#e8000d'], ['Kansas State', '#512888', '#d1d1d1'], ['Kennesaw State', '#042b60', '#d3a52c'], ['Kent State', '#002664', '#fdbb30'], ['Kentucky', '#0033a0', '#fff'], ['Liberty', '#002d62', '#c41230'], ['Louisiana', '#ce181e', '#fff'], ['Louisiana Tech', '#002d62', '#c8102e'], ['Louisville', '#ad0000', '#000'], ['LSU', '#461d7c', '#fdd023'], ['Marshall', '#00a651', '#fff'], ['Maryland', '#e03a3e', '#ffd520'], ['Memphis', '#003087', '#8caeae'], ['Miami', '#f47321', '#005030'], ['Miami (OH)', '#b61e2e', '#fff'], ['Michigan', '#00274c', '#ffcb05'], ['Michigan State', '#18453b', '#fff'], ['Middle Tennessee', '#0066cc', '#fff'], ['Minnesota', '#7a0019', '#ffcc33'], ['Mississippi State', '#660000', '#fff'], ['Missouri', '#f1b82d', '#000'], ['Navy', '#00205b', '#c5b783'], ['NC State', '#cc0000', '#fff'], ['Nebraska', '#e41c38', '#fff'], ['Nevada', '#003366', '#807f84'], ['New Mexico', '#ba0c2f', '#silver'], ['New Mexico State', '#8b0e04', '#fff'], ['North Carolina', '#7bafd4', '#fff'], ['North Texas', '#00853f', '#fff'], ['Northwestern', '#4e2a84', '#fff'], ['Notre Dame', '#0c2340', '#c99700'], ['Ohio', '#00694e', '#fff'], ['Ohio State', '#bb0000', '#fff'], ['Oklahoma', '#841617', '#fff'], ['Oklahoma State', '#ff7300', '#000'], ['Old Dominion', '#003057', '#a2aaad'], ['Ole Miss', '#ce1126', '#14213d'], ['Oregon', '#154733', '#fdbb30'], ['Oregon State', '#dc4405', '#000'], ['Penn State', '#041e42', '#fff'], ['Pittsburgh', '#003594', '#ffb81c'], ['Purdue', '#000', '#cfb991'], ['Rice', '#00205b', '#c1c6c8'], ['Rutgers', '#cc0033', '#fff'], ['Sam Houston', '#f76902', '#fff'], ['San Diego State', '#a6192e', '#fff'], ['San Jose State', '#0055a2', '#fff'], ['SMU', '#0033a0', '#cc0033'], ['South Alabama', '#003b5c', '#f0b323'], ['South Carolina', '#73000a', '#000'], ['South Florida', '#006747', '#cfc493'], ['Southern Miss', '#ffb81c', '#000'], ['Stanford', '#8c1515', '#fff'], ['Syracuse', '#d44500', '#fff'], ['TCU', '#4d1979', '#a3a9ac'], ['Temple', '#a80532', '#fff'], ['Tennessee', '#ff8200', '#fff'], ['Texas', '#bf5700', '#fff'], ['Texas A&M', '#500000', '#fff'], ['Texas State', '#501214', '#b3b5b8'], ['Texas Tech', '#cc0000', '#fff'], ['Toledo', '#003e7e', '#ffde00'], ['Troy', '#8b2332', '#fff'], ['Tulane', '#006747', '#powderblue'], ['Tulsa', '#002d62', '#c8102e'], ['UAB', '#1e6b52', '#fdbb30'], ['UCF', '#000', '#ffc904'], ['UCLA', '#2d68c4', '#f2a900'], ['UNLV', '#cf0a2c', '#000'], ['USC', '#990000', '#ffc72c'], ['Utah', '#cc0000', '#fff'], ['UTEP', '#041e42', '#ff8200'], ['UTSA', '#0c2340', '#f15a22'], ['Vanderbilt', '#866d4b', '#000'], ['Virginia', '#232d4b', '#e57200'], ['Virginia Tech', '#630031', '#cf4420'], ['Wake Forest', '#9e7e38', '#000'], ['Washington', '#4b2e83', '#b7a57a'], ['Washington State', '#981e32', '#5e6a71'], ['West Virginia', '#002855', '#eaaa00'], ['Western Kentucky', '#b32025', '#fff'], ['Western Michigan', '#6c4023', '#fdbb30'], ['Wisconsin', '#c5050c', '#fff'], ['Wyoming', '#492f24', '#ffc425']
].map(([name, colors, accent]) => ({ name, colors, accent, years: '2026 — Present' }));

function HelmetRail({ school, colors, accent, years }: { school: string; colors: string; accent: string; years: string }) {
  return <article className="helmet-card" style={{ background: colors, color: accent }}><div className="helmet-mark" aria-hidden="true">{school.split(/\s+/).map((word) => word[0]).join('').slice(0, 2)}</div><div><strong>{school}</strong><span>{years}</span></div><img className="helmet-image" src="/helmet-reference.jpeg" alt="" aria-hidden="true" /></article>;
}

type PlayerSearchResult = {
  playerId: string;
  name: string;
  position?: string | null;
  classYear?: string | null;
  initials?: string;
  image?: string;
  jersey?: string;
  currentTeam?: { name?: string };
  schools?: Player['schools'];
  draft?: Player['draft'];
  nil?: Player['nil'];
  news?: Player['news'];
  bio?: Player['bio'];
};

const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Player | null>(null);
  const [dark, setDark] = React.useState(false);
  const [remoteSuggestions, setRemoteSuggestions] = React.useState<PlayerSearchResult[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState('');
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileError, setProfileError] = React.useState(false);
  React.useEffect(() => {
    const normalized = query.trim();
    setRemoteSuggestions([]);
    setSearchError('');
    if (!normalized) { setSearching(false); return; }
    const controller = new AbortController();
    let active = true;
    setSearching(true);
    fetch(`/api/players?q=${encodeURIComponent(normalized)}&limit=4`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Player search unavailable')))
      .then((payload) => { if (active) setRemoteSuggestions(payload.players); })
      .catch(() => { if (active) setSearchError('Player search unavailable. Please try again.'); })
      .finally(() => { if (active) setSearching(false); });
    return () => { active = false; controller.abort(); };
  }, [query]);
  React.useEffect(() => {
    if (!selected?.playerId) return;
    const controller = new AbortController();
    let active = true;
    setProfileError(false);
    setProfileLoading(true);
    fetch(`/api/players/${encodeURIComponent(selected.playerId)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((details) => {
        if (active) setSelected((current) => {
          if (!current || current.playerId !== details.playerId) return current;
          return {
            ...current,
            ...details,
            school: details.currentTeam?.name || current.school,
            classYear: details.classYear || current.classYear,
            position: details.position || current.position,
            schools: details.schools?.length ? details.schools : current.schools,
            news: details.news?.length ? details.news : current.news,
          };
        });
      })
      .catch(() => { if (active) setProfileError(true); })
      .finally(() => { if (active) setProfileLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [selected?.playerId]);
  const suggestions: Player[] = query.trim() ? remoteSuggestions.map((result) => ({
    ...result,
    position: result.position || 'Position unavailable',
    classYear: result.classYear || 'Class unavailable',
    number: result.jersey || undefined,
    school: result.currentTeam?.name || 'School unavailable',
    schools: result.schools?.length ? result.schools : result.currentTeam?.name ? [{ name: result.currentTeam.name, years: 'Current', colors: '#2d6a4f', accent: '#fff' }] : [],
    initials: result.initials || result.name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2),
  })) : [];
  const rails = [...fbsPrograms, ...fbsPrograms, ...fbsPrograms];

  return <div className={dark ? 'app dark' : 'app'}>
    <header className="topbar"><a className="wordmark" href="#top" aria-label="The Roster home"><span className="wordmark-dot" />THE ROSTER</a><nav><a href="#players">Players</a><a href="#about">About</a></nav><button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}><span>{dark ? '☼' : '◐'}</span><span>{dark ? 'Light' : 'Dark'}</span></button></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="eyebrow">College sports intelligence</p><h1>Know the player<br /><em>behind the play.</em></h1><p className="hero-lede">One clear view of college football’s rising stars — their game, their journey, and what comes next.</p><div className="search-wrap"><label htmlFor="player-search">Search for a player</label><div className="search-field"><span aria-hidden="true">⌕</span><input id="player-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by player or school" autoComplete="off" maxLength={100} />{query && <button className="clear-button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}</div>{query.trim() && <p role="status">{searching ? 'Searching…' : searchError || (suggestions.length === 0 ? 'No players found.' : '')}</p>}{suggestions.length > 0 && <div className="suggestions" role="listbox" aria-label="Player search results">{suggestions.map((player) => <button key={player.playerId} onClick={() => { setSelected(player); setQuery(''); }} role="option"><span className="suggestion-avatar">{player.initials}</span><span><strong>{player.name}</strong><small>{player.position} · {player.school}</small></span><span className="suggestion-arrow">↗</span></button>)}</div>}</div><div className="popular"><span>Popular right now</span>{players.slice(0, 3).map((player) => <button key={player.name} onClick={() => setSelected(player)}>{player.name}</button>)}</div></div><div className="hero-art" aria-label="Football helmet display"><div className="art-stamp">Issue 04<br /><span>Fall 2026</span></div><div className="hero-helmet"><span className="helmet-face">T</span><span className="helmet-bar" /></div><p>Every story<br />has a roster.</p></div></section>
      <section className="programs" id="players"><div className="section-heading"><div><p className="eyebrow">The landscape</p><h2>Follow the <em>programs.</em></h2></div><p>Every player is shaped by the places<br />that gave them a start.</p></div><div className="rails">{[0, 1, 2].map((row) => <div className={`rail rail-${row % 2 === 0 ? 'left' : 'right'}`} key={row}><div className="rail-track">{rails.slice(row, row + 18).map((program, index) => <button key={`${row}-${index}`} onClick={() => setSelected(players[index % players.length])}><HelmetRail school={program.name} colors={program.colors} accent={program.accent} years={program.years} /></button>)}</div></div>)}</div></section>
      <section className="quiet-cta" id="about"><p className="eyebrow">Built for the curious</p><h2>The game is bigger<br />than the <em>box score.</em></h2><p>Profiles built from the details that make a player worth watching.</p></section>
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-name"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close player profile">×</button><div className="profile-head"><div className="profile-photo">{selected.image && <img src={selected.image} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}<span>{selected.initials}</span></div><div><p className="eyebrow">{selected.position}{selected.number && ` · #${selected.number}`}</p><h2 id="profile-name">{selected.name}</h2><p>{selected.school} · {selected.classYear}</p>{selected.bio && <p className="profile-facts">{[selected.bio.displayHeight, selected.bio.displayWeight, [selected.bio.birthPlace?.city, selected.bio.birthPlace?.state].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}</p>}</div></div><div className="profile-grid"><div><h3>School journey</h3><div className="school-timeline">{selected.schools?.map((school) => <div className="timeline-item" key={school.name}><span className="timeline-dot" style={{ background: school.colors }} /><strong>{school.name}</strong><small>{school.years}</small></div>)}{!selected.schools?.length && <p className="profile-empty">We don’t have a verified school record yet.</p>}</div></div><div><h3>Draft outlook</h3>{selected.draft ? <div className="draft-card"><strong>{selected.draft.round}</strong><b>{selected.draft.pick}</b><span>{selected.draft.note}</span></div> : <p className="profile-empty">No published draft projection is connected yet. We’ll show one when a source reports it.</p>}</div></div><div className="profile-grid lower"><div><h3>NIL activity</h3><div className="nil-list">{selected.nil?.map((item) => <div key={item.partner}><strong>{item.partner}</strong><b>{item.amount}</b><span>{item.detail}</span></div>)}{!selected.nil?.length && <p className="profile-empty">Verified NIL reports appear here when a public source confirms them.</p>}</div></div><div><h3>Recent headlines</h3><div className="news-list">{selected.news?.map((item) => <a href={item.url} key={item.title} target="_blank" rel="noreferrer"><span>{item.source} · {item.date}</span><strong>{item.title}</strong><b>↗</b></a>)}{!selected.news?.length && <p className="profile-empty">{profileLoading ? 'Checking recent coverage…' : profileError ? 'Headlines are temporarily unavailable. Close and reopen this profile to try again.' : 'No recent headlines found. Coverage can change as teams and reporters share updates.'}</p>}</div></div></div></section></div>}
  </div>;
};

export default App;
