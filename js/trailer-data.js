/*
 * Trailer page content. Edit this file only — no need to touch trailer.js.
 *
 * video:        path/URL to the final trailer. Leave '' to run a simulated playhead.
 * flows:        workflow categories (legend + section color).
 * tools:        tool tags shown in the corner of each step. Add `logo: 'path/to/logo.svg'`
 *               to swap the colored square for the real software logo.
 * segments:     the timeline, in play order. `dur` is seconds; it sets block width
 *               Optional `clip: 'assets/trailer/x.mp4'` plays that section's own clip
 *               (for testing before the single final video exists; set dur to the clip length).
 *               and where clicking a block seeks to. Optional `thumb: 'path.jpg'`.
 *
 * Step kinds:
 *   grid      { cells: [...] }                     storyboard / image grid (6 boxes)
 *   capsule   { nodes: ['A','B','C'] }             node diagram with arrows
 *   pair      { left:{label,icon}, right:{label,icon} }   before → after
 *   timeline  {}                                    premiere-style tracks
 *             or { tracks: [{ id:'A1', clips:[['Music',10]] }, ...] } to label your own ('' = gap,
 *             accent:true colors a track like its section)
 *   prompt    { prompt: '...' }                     prompt box
 *   layers    { cells: [...] }                      AE-style layer list
 * Any step can take `image: 'path.jpg'` to show a real screenshot instead of the diagram.
 * Icons for pair: img, play, person, empty, character, vector, layers
 */
window.TRAILER_DATA = {
  video: '',

  flows: {
    live:   { name: 'Live action + AI composite', color: '#FF7A9A' },
    graph:  { name: 'Firefly Graph pipeline',     color: '#A88BFF' },
    assist: { name: 'AE + AI Assistant',          color: '#F2D35B' },
    mix:    { name: 'Elements + Graph + Boards',  color: '#6FA8FF' },
    aeref:  { name: 'AE reference rebuild',       color: '#FF9F5A' },
    remake: { name: 'Shot-by-shot remake',        color: '#55D296' },
    boards: { name: 'Firefly Boards',             color: '#4FC6D9' }
  },

  tools: {
    'Live footage':                 { color: '#B7B2C4', logo: null },
    'Firefly Graph':                { color: '#A88BFF', logo: null },
    'Firefly Graph / Boards':       { color: '#A88BFF', logo: null },
    'Firefly Boards':               { color: '#6FA8FF', logo: null },
    'Firefly Boards / Graph':       { color: '#6FA8FF', logo: null },
    'Boards Elements':              { color: '#6FA8FF', logo: null },
    'Firefly Video':                { color: '#E58BD8', logo: null },
    'Premiere':                     { color: '#9999FF', logo: null },
    'After Effects':                { color: '#CF96FD', logo: null },
    'After Effects + AI Assistant': { color: '#CF96FD', logo: null },
    'Reference video':              { color: '#B7B2C4', logo: null },
    'Reference preshow':            { color: '#B7B2C4', logo: null }
  },

  segments: [
    {
      id: 'ad', short: '[AD]', title: '[AD TITLE]', flow: 'live', dur: 12,
      steps: [
        { kind: 'pair', title: 'Shoot', tool: 'Live footage', left: { label: 'Public space', icon: 'person' }, right: { label: 'Raw clip', icon: 'play' } },
        { kind: 'pair', title: 'Remove people', tool: 'Premiere', left: { label: 'With people', icon: 'person' }, right: { label: 'Clean plate', icon: 'empty' } },
        { kind: 'pair', title: 'Generate character', tool: 'Firefly Graph / Boards', left: { label: 'Character', icon: 'character' }, right: { label: 'Animated clip', icon: 'play' } },
        { kind: 'timeline', title: 'Composite + edit', tool: 'Premiere' }
      ]
    },
    {
      id: 'movie', short: 'Movie trailer', title: 'Movie trailer · Violet Snow', flow: 'graph', dur: 31.4, clip: 'assets/trailer/movietrailer_violetsnow_v1.mp4',
      steps: [
        { kind: 'grid', title: 'Reference images', tool: 'Firefly Graph', cells: [
          { label: 'Hero character', img: 'assets/trailer/violet-snow/ref-hero.jpg', pos: 'top' },
          { label: 'Character lineup', img: 'assets/trailer/violet-snow/ref-group.jpg', pos: 'top' },
          { label: 'Characters in the circle', img: 'assets/trailer/violet-snow/ref-character.jpg' },
          { label: 'Snowy forest', img: 'assets/trailer/violet-snow/ref-forest.jpg' },
          { label: 'Frozen lake village', img: 'assets/trailer/violet-snow/ref-lake.jpg' },
          { label: 'Living room', img: 'assets/trailer/violet-snow/ref-room.jpg' }
        ] },
        { kind: 'grid', title: 'Storyboard from text + references', tool: 'Firefly Graph', cells: [
          { label: 'A5', img: 'assets/trailer/violet-snow/sb-A5.jpg' },
          { label: 'B8', img: 'assets/trailer/violet-snow/sb-B8.jpg' },
          { label: 'A1', img: 'assets/trailer/violet-snow/sb-A1.jpg' },
          { label: 'B3', img: 'assets/trailer/violet-snow/sb-B3.jpg' },
          { label: 'C3', img: 'assets/trailer/violet-snow/sb-C3.jpg' },
          { label: 'C2', img: 'assets/trailer/violet-snow/sb-C2.jpg' }
        ] },
        { kind: 'pair', title: 'Generate each shot', tool: 'Firefly Graph',
          left: { label: 'Storyboard still + prompt', img: 'assets/trailer/violet-snow/shot-still.jpg' },
          right: { label: 'Shot', video: 'assets/trailer/violet-snow/shot.mp4', poster: 'assets/trailer/violet-snow/shot-still.jpg' },
          more: [
            { left: { label: 'Storyboard still + prompt', img: 'assets/trailer/violet-snow/shot2-still.jpg' },
              right: { label: 'Shot', video: 'assets/trailer/violet-snow/shot2.mp4', poster: 'assets/trailer/violet-snow/shot2-still.jpg' } }
          ] },
        { kind: 'timeline', title: 'Edit, music + sound', tool: 'Premiere',
          tracks: [
            { id: 'V2', clips: [['', 7], ['Title card', 3, true]] },
            { id: 'V1', clips: [['Shot 1', 2], ['Shot 2', 2], ['Shot 3', 2], ['Shot 4', 1.5], ['', 2.5]] },
            { id: 'A1', clips: [['Music', 10]] },
            { id: 'A2', clips: [['', 1], ['Gen SFX', 2, true], ['', 2], ['Gen SFX', 2, true], ['', 3]] }
          ] }
      ]
    },
    {
      id: 'studio', short: 'Studio card', title: 'Studio presents', flow: 'assist', dur: 4,
      steps: [
        { kind: 'prompt', title: 'Prompt', tool: 'After Effects + AI Assistant', prompt: 'Daydream Cinema logo reveal, a few seconds' },
        { kind: 'layers', title: 'Build in layers', tool: 'After Effects + AI Assistant', cells: ['Logo', 'Light', 'Particles', 'Camera'] },
        { kind: 'pair', title: 'Render', tool: 'After Effects + AI Assistant', left: { label: 'Logo', icon: 'vector' }, right: { label: 'Logo motion', icon: 'play' } }
      ]
    },
    {
      id: 'series', short: 'Series trailer', title: 'Series trailer · [SERIES TITLE]', flow: 'mix', dur: 75.1, clip: 'assets/trailer/series-trailer.mp4',
      steps: [
        { kind: 'layers', title: 'Characters', tool: 'Boards Elements', cells: ['Character A', 'Character B', 'Character C'] },
        { kind: 'grid', title: 'Environments', tool: 'Firefly Graph', cells: ['', '', '', '', '', ''] },
        { kind: 'pair', title: 'Composite + video', tool: 'Firefly Boards', left: { label: 'Character + set', icon: 'layers' }, right: { label: 'Clip', icon: 'play' } },
        { kind: 'timeline', title: 'Edit', tool: 'Premiere' }
      ]
    },
    {
      id: 'psa', short: 'Policy PSA', title: 'Policy PSA', flow: 'aeref', dur: 7,
      steps: [
        { kind: 'pair', title: 'Reference', tool: 'Reference video', left: { label: 'Reference clip', icon: 'play' }, right: { label: 'Flow + style', icon: 'layers' } },
        { kind: 'layers', title: 'Rebuild in layers', tool: 'After Effects', cells: ['Phones off', 'No talking', 'Exits', 'Background'] },
        { kind: 'timeline', title: 'Edit', tool: 'Premiere' }
      ]
    },
    {
      id: 'promo', short: 'Daydream promo', title: 'Daydream Cinema promo', flow: 'remake', dur: 12,
      steps: [
        { kind: 'grid', title: 'Break down reference', tool: 'Reference preshow', cells: ['', '', '', '', '', ''] },
        { kind: 'pair', title: 'Replace shot by shot', tool: 'Firefly Boards / Graph', left: { label: 'Live shot', icon: 'person' }, right: { label: 'Our characters', icon: 'character' } },
        { kind: 'timeline', title: 'Match the edit', tool: 'Premiere' }
      ]
    },
    {
      id: 'seats', short: 'Echo + Mono', title: 'Echo, Mono + the blobs', flow: 'boards', dur: 15,
      steps: [
        { kind: 'grid', title: 'Keyframes', tool: 'Firefly Boards', cells: ['', '', '', '', '', ''] },
        { kind: 'pair', title: 'Pull back', tool: 'Firefly Video', left: { label: 'Screen', icon: 'play' }, right: { label: 'Full theater', icon: 'character' } },
        { kind: 'pair', title: 'Lights dim', tool: 'Firefly Video', left: { label: 'Dark seats', icon: 'empty' }, right: { label: 'Glow on faces', icon: 'character' } },
        { kind: 'pair', title: 'Theater transforms', tool: 'Firefly Video', left: { label: 'Theater', icon: 'layers' }, right: { label: 'Movie set', icon: 'img' } },
        { kind: 'timeline', title: 'Edit', tool: 'Premiere' }
      ]
    }
  ]
};
