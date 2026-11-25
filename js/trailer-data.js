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
    aeref:  { name: 'Reference + Python + AE',    color: '#FF9F5A' },
    remake: { name: 'Shot-by-shot remake',        color: '#55D296' },
    boardsEdit: { name: 'Boards + Premiere',      color: '#4FC6D9' }
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
    'Reference preshow':            { color: '#B7B2C4', logo: null },
    'Reference study':              { color: '#B7B2C4', logo: null },
    'Python':                       { color: '#4FA3E0', logo: null },
    'Python + SAM 3':               { color: '#4FA3E0', logo: null },
    'Firefly, Python, AE, ffmpeg': { color: '#B7B2C4', logo: null },
    'ffmpeg':                       { color: '#7BD88F', logo: null }
  },

  segments: [
    {
      id: 'ad', short: 'Preshow ad', title: 'Preshow ad', flow: 'live', dur: 19.64, clip: 'assets/trailer/ad/kitkat.mp4',
      thumbs: Array.from({ length: 5 }, (_, i) => 'assets/trailer/thumbs/ad-' + (i + 1) + '.jpg'),
      steps: [
        { title: 'Select a person', tool: 'Premiere', image: 'assets/trailer/ad/bts/remove-1.jpg',
          note: 'Click someone and Premiere outlines them.' },
        { title: 'Select the crowd + track', tool: 'Premiere', image: 'assets/trailer/ad/bts/remove-3.jpg',
          note: 'Select everyone, then Track follows them through the shot.' },
        { kind: 'grid', title: 'Generative Remove', tool: 'Premiere', cols: 2,
          note: 'Remove fills in what was behind them.', cells: [
          { label: 'Removing one person', img: 'assets/trailer/ad/bts/remove-2.jpg' },
          { label: 'Removing the crowd', img: 'assets/trailer/ad/bts/remove-4.jpg' }
        ] },
        { kind: 'pair', title: 'Before → after', tool: 'Premiere', note: 'Same shot, crowd gone.',
          left: { label: 'Before', img: 'assets/trailer/ad/bts/before.jpg' },
          right: { label: 'After', img: 'assets/trailer/ad/bts/after.jpg' } },
        { title: 'Color mode', tool: 'Premiere', image: 'assets/trailer/ad/bts/color-mode.jpg',
          note: 'Exposure, temperature, saturation and detail in one panel.' }
      ]
    },
    {
      id: 'movie', short: 'Movie trailer', title: 'Movie trailer: Violet Snow', flow: 'graph', dur: 31.4, clip: 'assets/trailer/movietrailer_violetsnow.mp4',
      thumbs: Array.from({ length: 8 }, (_, i) => 'assets/trailer/thumbs/movie-' + (i + 1) + '.jpg'),
      steps: [
        { kind: 'grid', title: 'Starter assets', tool: 'Firefly Graph',
          note: 'Characters and places, made first.', cells: [
          { label: 'Hero character', img: 'assets/trailer/violet-snow/ref-hero.jpg', pos: 'top' },
          { label: 'Character lineup', img: 'assets/trailer/violet-snow/ref-group.jpg', pos: 'top' },
          { label: 'Characters in the circle', img: 'assets/trailer/violet-snow/ref-character.jpg' },
          { label: 'Snowy forest', img: 'assets/trailer/violet-snow/ref-forest.jpg' },
          { label: 'Frozen lake village', img: 'assets/trailer/violet-snow/ref-lake.jpg' },
          { label: 'Living room', img: 'assets/trailer/violet-snow/ref-room.jpg' }
        ] },
        { title: 'The Graph', tool: 'Firefly Graph', image: 'assets/trailer/violet-snow/graph.jpg',
          note: 'Prompts in, frames and shots out.' },
        { kind: 'grid', title: 'Storyboard', tool: 'Firefly Graph', cols: 6,
          note: 'Drawn from the shot list and starter assets.',
          cells: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B10', 'B11', 'C1', 'C2', 'C3', 'C5', 'D1', 'D2', 'D3', 'D4', 'E1']
            .map((id) => ({ label: id, img: 'assets/trailer/violet-snow/sb/' + id + '.jpg' })) },
        { kind: 'pair', title: 'Animate each shot', tool: 'Firefly Graph', cols: 2, labels: false,
          note: 'Still + prompt → moving shot.',
          left: { label: 'A1 storyboard', img: 'assets/trailer/violet-snow/sb/A1.jpg' },
          right: { label: 'A1 shot', video: 'assets/trailer/violet-snow/shots/A1.mp4', poster: 'assets/trailer/violet-snow/sb/A1.jpg' },
          more: [
            { left: { label: 'A5 storyboard', img: 'assets/trailer/violet-snow/sb/A5.jpg' },
              right: { label: 'A5 shot', video: 'assets/trailer/violet-snow/shots/A5.mp4', poster: 'assets/trailer/violet-snow/sb/A5.jpg' } },
            { left: { label: 'C2 storyboard', img: 'assets/trailer/violet-snow/sb/C2.jpg' },
              right: { label: 'C2 shot', video: 'assets/trailer/violet-snow/shots/C2.mp4', poster: 'assets/trailer/violet-snow/sb/C2.jpg' } },
            { left: { label: 'B10 storyboard', img: 'assets/trailer/violet-snow/sb/B10.jpg' },
              right: { label: 'B10 shot', video: 'assets/trailer/violet-snow/shot2.mp4', poster: 'assets/trailer/violet-snow/sb/B10.jpg' } },
            { left: { label: 'C3 storyboard', img: 'assets/trailer/violet-snow/sb/C3.jpg' },
              right: { label: 'C3 shot', video: 'assets/trailer/violet-snow/shots/C3.mp4', poster: 'assets/trailer/violet-snow/sb/C3.jpg' } },
            { left: { label: 'D3 storyboard', img: 'assets/trailer/violet-snow/sb/D3.jpg' },
              right: { label: 'D3 shot', video: 'assets/trailer/violet-snow/shot.mp4', poster: 'assets/trailer/violet-snow/sb/D3.jpg' } }
          ] }
      ]
    },
    {
      id: 'studio', short: 'Studio presents', title: 'Studio presents', flow: 'assist', dur: 5.04, w: 17, clip: 'assets/trailer/studio/hex-present.mp4',
      thumbs: ['assets/trailer/thumbs/studio-1.jpg'],
      steps: [
        { kind: 'pair', title: 'Logo to light dots', tool: 'After Effects + AI Assistant', left: { label: 'Logo PNG', img: 'assets/trailer/studio/hex-logo.jpg' }, right: { label: 'Light dots', img: 'assets/trailer/studio/hex-dots.jpg' } },
        { title: 'AI Assistant builds it', tool: 'After Effects + AI Assistant', image: 'assets/trailer/studio/ae-light-dots.jpg',
          note: 'Camera, lights, dots, haze and title.' }
      ]
    },
    {
      id: 'series', short: 'Series trailer', title: 'Series trailer', flow: 'mix', dur: 72.43, clip: 'assets/trailer/series-trailer.mp4?v=2',
      thumbs: Array.from({ length: 18 }, (_, i) => 'assets/trailer/thumbs/series-' + (i + 1) + '.jpg?v=2'),
      steps: [
        { kind: 'grid', title: 'Environments', tool: 'Firefly',
          note: 'The worlds the series travels through.',
          cells: [1, 2, 3, 4, 5, 6].map((n) => ({ label: 'Environment ' + n, img: 'assets/trailer/series/bts/env/env-' + n + '.jpg' })) },
        { title: 'Generative Extend', tool: 'Premiere', image: 'assets/trailer/series/bts/gen-extend.jpg',
          note: 'Generate extra footage with Veo 3.1, right in the timeline.' },
        { title: 'Soundscape', tool: 'Premiere', image: 'assets/trailer/series/bts/soundscape.jpg',
          note: 'Describe the ambience; Premiere generates it.' },
        { title: 'Sound effects', tool: 'Premiere', image: 'assets/trailer/series/bts/sfx.jpg',
          note: 'Type “car crash explosion”, sync it to the cut.' },
        { title: 'Final mix', tool: 'Premiere', image: 'assets/trailer/series/bts/timeline.jpg',
          note: 'Clips, sound effects, ambience and music on their own tracks.' }
      ]
    },
    {
      id: 'psa', short: 'Policy PSA', title: 'Policy PSA: Five rules, one cinema', flow: 'aeref', dur: 23.375, clip: 'assets/trailer/psa/policy-psa.mp4',
      thumbs: Array.from({ length: 6 }, (_, i) => 'assets/trailer/thumbs/psa-' + (i + 1) + '.jpg'),
      // steps follow Week6-7/promo/policy_video_bts_screenshots (01 → 11), with the slides' own words
      steps: [
        { kind: 'grid', title: 'Storyboard the five rules', tool: 'Firefly Boards', captions: true,
          note: 'Five rules. One cinema. A thirty-second film about five simple cinema rules.', cells: [
          { label: 'No phones', img: 'assets/trailer/psa/bts/sb-1.jpg' },
          { label: 'No talking', img: 'assets/trailer/psa/bts/sb-2.jpg' },
          { label: 'No kicking seats', img: 'assets/trailer/psa/bts/sb-3.jpg' },
          { label: 'No rustling', img: 'assets/trailer/psa/bts/sb-4.jpg' },
          { label: 'No spoilers', img: 'assets/trailer/psa/bts/sb-5.jpg' }
        ] },
        { kind: 'stack', title: 'Reference vs ours', tool: 'Reference study', captions: true,
          note: 'Reference on the left, ours on the right: the same moment in each shot.', cells: [
          { label: 'No phones', img: 'assets/trailer/psa/bts/vs-phones.gif' },
          { label: 'No talking', img: 'assets/trailer/psa/bts/vs-talking.gif' },
          { label: 'No rustling', img: 'assets/trailer/psa/bts/vs-rustling.gif' }
        ] },
        { kind: 'grid', title: 'Two looks for one cinema', tool: 'Reference study', captions: true,
          note: 'Mono uses bold graphic shapes. Echo brings painted colour and texture.', cells: [
          { label: 'Mono / bold shapes', img: 'assets/trailer/psa/bts/ref-mono-1.jpg' },
          { label: 'Mono / strong contrast', img: 'assets/trailer/psa/bts/ref-mono-2.jpg' },
          { label: 'Mono / sharp impact', img: 'assets/trailer/psa/bts/ref-mono-3.jpg' },
          { label: 'Echo / painted colour', img: 'assets/trailer/psa/bts/ref-echo-1.jpg' },
          { label: 'Echo / expressive motion', img: 'assets/trailer/psa/bts/ref-echo-2.jpg' },
          { label: 'Echo / layered texture', img: 'assets/trailer/psa/bts/ref-echo-3.jpg' }
        ] },
        { title: 'How the film was made', tool: 'Firefly, Python, AE, ffmpeg', image: 'assets/trailer/psa/bts/pipeline.jpg',
          note: 'From reference and storyboard to moving layers, music and the finished film.' },
        { kind: 'grid', title: 'Separate the layers', tool: 'Python + SAM 3', captions: true,
          note: 'SAM 3 separates the artwork so each part can move on its own.', cells: [
          { label: 'Storyboard / original artwork', img: 'assets/trailer/psa/bts/layer-1.jpg' },
          { label: 'Character cut-out', img: 'assets/trailer/psa/bts/layer-2.jpg' },
          { label: 'Character cut-out', img: 'assets/trailer/psa/bts/layer-3.jpg' },
          { label: 'Character cut-out', img: 'assets/trailer/psa/bts/layer-4.jpg' },
          { label: 'Snack bag cut-out', img: 'assets/trailer/psa/bts/layer-5.jpg' }
        ] },
        { kind: 'slides', title: 'Layers, motion + finishing', tool: 'After Effects', cells: [
          { label: 'No phones / building the impact', sub: 'After Effects / layers, motion and finishing', img: 'assets/trailer/psa/bts/ae-phones.jpg',
            notes: ['The frame we are looking at', 'A bold black-and-white impact', 'Motion blur adds energy', 'Characters and props have separate layers', 'Each drawing has its own timing', 'Position and scale of the selected layer'] },
          { label: 'No rustling / adding colour and texture', sub: 'After Effects / layers, motion and finishing', img: 'assets/trailer/psa/bts/ae-rustling.jpg',
            notes: ['The frame we are looking at', 'Dots, ink and colour create the look', 'The snack bag keeps its red and white stripes', 'Each part carries its own texture', 'The look is baked into each frame', 'The characters and words stay clear'] },
          { label: 'No spoilers / creating the tunnel', sub: 'After Effects / layers, motion and finishing', img: 'assets/trailer/psa/bts/ae-spoilers.jpg',
            notes: ['The frame we are looking at', 'A bright centre draws us into the tunnel', 'The characters stay easy to see', 'The tunnel closes down to a dot', 'The ending opens from the same point', 'Film strips cut across the picture'] }
        ] },
        { title: 'Colour + texture', tool: 'Python', image: 'assets/trailer/psa/bts/texture-all.jpg',
          note: 'Reference, before, texture and finished: rustling and spoilers gain a textured look; the other rules keep their bold graphic shapes.' }
      ]
    },
    {
      id: 'promo', short: 'Daydream promo', title: "Daydream Cinema promo: That's Magic", flow: 'remake', dur: 30.03, clip: 'assets/trailer/promo/daydream-promo.mp4',
      thumbs: Array.from({ length: 8 }, (_, i) => 'assets/trailer/thumbs/promo-' + (i + 1) + '.jpg'),
      // steps follow Week6-7/promo/thats_magic_bts_screenshots (01 → 11), with the slides' own words
      steps: [
        { kind: 'stack', title: 'Reference vs ours', tool: 'Reference study', captions: true,
          note: 'A familiar ad. A paper star. A cinema ad recreated shot for shot with Mono and Echo.', cells: [
          { label: 'The empty auditorium', img: 'assets/trailer/promo/bts/vs-auditorium.gif' },
          { label: 'Echo at the projector', img: 'assets/trailer/promo/bts/vs-projector.gif' }
        ] },
        { kind: 'stack', title: 'The original ad and our recreation', tool: 'Reference study', captions: true, cols: 3,
          note: 'Reference on the left, ours on the right: the same moment in each shot.', cells: [
          'A step through a puddle', 'Mono removes his cap', 'Outside the cinema',
          'Across the lobby', 'The empty auditorium', 'Walking into the light',
          'The room dims', 'Echo at the projector', 'Light behind Mono',
          'Inside the theatre', 'A moment of wonder', 'Standing on a seat',
          'The film fills the screen', 'A knowing turn', 'Daydream Cinema'
        ].map((label, i) => ({ label, img: 'assets/trailer/promo/bts/shot-' + (i + 1) + '.jpg' })) },
        { kind: 'grid', title: 'From the reference to the finish', tool: 'Firefly Boards', captions: true,
          note: 'Reference / layout / storyboard / moving plate / drawing / layers / film look / finish', cells: [
          { label: 'Reference: study the original ad', img: 'assets/trailer/promo/bts/stage-1.jpg' },
          { label: 'Layout: draw the room', img: 'assets/trailer/promo/bts/stage-2.jpg' },
          { label: 'Firefly Boards: choose the room', img: 'assets/trailer/promo/bts/stage-3.jpg' },
          { label: 'Moving plate: give the room motion', img: 'assets/trailer/promo/bts/stage-4.jpg' },
          { label: 'Mono art: draw the performance', img: 'assets/trailer/promo/bts/stage-5.jpg' },
          { label: 'After Effects: build the scene in layers', img: 'assets/trailer/promo/bts/stage-6.jpg' },
          { label: 'Film look: add grain and soft edges', img: 'assets/trailer/promo/bts/stage-7.jpg' },
          { label: 'Finish: bring picture and sound together', img: 'assets/trailer/promo/bts/stage-8.jpg' }
        ] },
        { title: 'How we built the spot', tool: 'Firefly, Python, AE, ffmpeg', image: 'assets/trailer/promo/bts/pipeline.jpg',
          note: 'Recreate the room, draw the characters, then bring the scene together.' },
        { kind: 'slides', title: 'Build the scenes', tool: 'After Effects', cells: [
          { label: 'Mono in the auditorium', sub: 'The room, the drawing and the light remain separate layers.', img: 'assets/trailer/promo/bts/ae-auditorium.jpg',
            notes: ['Each scene has its own layers', 'The moment we are looking at', 'The wall stays in front of Mono', 'The scene in After Effects', 'A separate layer lights Mono', 'Soft blur spreads the light', 'Movement follows the drawing'] },
          { label: 'Lighting Mono', sub: 'Layers of light give the drawing depth.', img: 'assets/trailer/promo/bts/ae-lighting.jpg',
            notes: ['The moment we are looking at', 'Drawing, edge light and halo in separate layers', 'The light is built into each image', 'Projector light stays behind Mono', 'A slow move brings us closer'] },
          { label: 'A film inside the theatre', sub: 'Fit the film to the screen and let its light fill the room.', img: 'assets/trailer/promo/bts/ae-film.jpg',
            notes: ['The moment we are looking at', 'Fit the film to the screen', 'Soft blur spreads the screen light', 'A film plays inside the theatre', 'The screen light changes with the film'] }
        ] },
        { kind: 'pair', title: 'A light finish on the picture', tool: 'After Effects',
          note: 'Fine grain and darker edges keep the pencil drawing clear.',
          left: { label: 'Before: the scene from After Effects', img: 'assets/trailer/promo/bts/look-before.jpg' },
          right: { label: 'After: the finished film look', img: 'assets/trailer/promo/bts/look-after.jpg' } },
        { title: 'The finished spot', tool: 'ffmpeg', image: 'assets/trailer/promo/bts/finished.jpg',
          note: 'The finished recreation. Mono and Echo at Daydream Cinema.' }
      ]
    },
    {
      // the twist: the whole preshow was Echo and Mono's movie night; the theater turns into the jungle
      id: 'ending', short: 'Ending', title: 'Ending: the theater becomes the jungle', flow: 'boardsEdit', dur: 10.75, w: 17,
      clip: 'assets/trailer/ending/ending.mp4',
      thumbs: [1, 2, 3].map((n) => 'assets/trailer/thumbs/ending-' + n + '.jpg'),
      steps: [
        { kind: 'grid', title: 'Elements', tool: 'Firefly Boards', captions: true, cols: 3,
          note: 'The cast and the two sets.', cells: [
          { label: 'Mono', img: 'assets/characters/mono.webp', fit: 'contain' },
          { label: 'Echo', img: 'assets/trailer/ending/bts/el-echo.png', fit: 'contain' },
          { label: 'The blobs', img: 'assets/trailer/ending/bts/el-blobs.jpg', fit: 'contain' },
          { label: 'The theater', img: 'assets/trailer/ending/bts/el-theater.jpg' },
          { label: 'The jungle', img: 'assets/trailer/ending/bts/el-jungle.jpg' }
        ] },
        { kind: 'grid', title: 'Boards to video', tool: 'Firefly Boards', cols: 2,
          note: 'Storyboard stills, animated in Boards.', cells: [1, 2, 3, 4].map((n) => ({ label: 'Still ' + n, img: 'assets/trailer/ending/bts/sb-' + n + '.jpg' })) },
        { kind: 'timeline', title: 'Edit in Premiere', tool: 'Premiere', note: 'Cut, music and generative sound effects.',
          tracks: [
            { id: 'V1', clips: [['Theater', 3.5], ['Transform', 3], ['Jungle run', 4]] },
            { id: 'A1', clips: [['Music', 10.5]] },
            { id: 'A2', clips: [['', 3], ['Gen SFX', 2, true], ['', 2], ['Gen SFX', 2, true], ['', 1.5]] }
          ] }
      ]
    }
  ]
};
