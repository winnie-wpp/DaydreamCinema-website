/* Trailer tab: full-screen trailer, a timeline of its sections, and how each section was made.
   Content lives in trailer-data.js. With no video set yet, play runs a pretend playhead.
   Click the player to play / pause, double-click for full screen, space bar works too. */
(function () {
  const root = document.getElementById('trailer-page');
  const D = window.TRAILER_DATA;
  if (!root || !D) return;

  const ICONS = {
    img: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6',
    play: 'M8 5v14l11-7z',
    person: 'M12 4a3.5 3.5 0 1 1 0 7a3.5 3.5 0 1 1 0-7M5 20c0-4 3.5-6 7-6s7 2 7 6',
    empty: 'M3 5h18v14H3zM3 15h18',
    character: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
    vector: 'M4 18C8 6 16 6 20 18M2 16h4v4H2zM18 16h4v4h-4z',
    layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5'
  };

  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => root.querySelectorAll(sel);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const icon = (name, size) => '<svg width="' + (size || 28) + '" height="' + (size || 28) + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[name] || ICONS.img) + '" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>';
  const arrowRight = '<svg class="ts-arrow-r" width="24" height="12" viewBox="0 0 30 14" aria-hidden="true"><path d="M0 7h26M21 1l7 6-7 6" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>';

  // section timing
  let acc = 0;
  const segs = D.segments.map((s) => { const o = { ...s, start: acc, end: acc + s.dur }; acc += s.dur; return o; });
  const simTotal = acc;

  // player
  const stage = $('.ts-stage');
  const video = $('.ts-video');
  const holder = $('.ts-placeholder');
  // Two ways to feed the player:
  //   video: 'one-file.mp4'           the finished trailer, one continuous file
  //   clip: 'section.mp4' per section  for testing while editing; clips play back to back
  const hasVideo = !!D.video;
  let t = 0, playing = false, timer = null, activeId = null, cur = null;
  video.muted = false;  // try with sound; if the browser blocks that (no click on the page yet) playWithSound() falls back to muted
  const playWithSound = () => video.play().catch(() => { if (video.muted) return Promise.reject(); video.muted = true; return video.play(); });
  if (hasVideo) { video.src = D.video; video.hidden = false; holder.hidden = true; }
  const total = () => (hasVideo && isFinite(video.duration) && video.duration > 0 ? video.duration : simTotal);
  const segTime = () => (t / total()) * simTotal;   // scales section times if the real video is a different length
  const segAt = (x) => segs.find((s) => x >= s.start && x < s.end) || segs[segs.length - 1];

  // timeline strip
  segs.forEach((s) => {
    const f = D.flows[s.flow] || { color: '#888' };
    const b = el('button', 'ts-seg');
    b.type = 'button';
    b.style.flex = s.dur + ' 1 0';
    b.setAttribute('aria-label', 'Jump to ' + s.short);
    b.dataset.id = s.id;
    const tiles = el('span', 'ts-tiles');
    // thumbs: [...] = filmstrip frames, thumb: 'x.jpg' = one image
    const frames = s.thumbs || (s.thumb ? [s.thumb] : null);
    if (frames) tiles.innerHTML = frames.map((f) => '<span class="ts-tile"><img src="' + esc(f) + '" alt=""></span>').join('');
    else for (let i = 0; i < Math.max(1, Math.round(s.dur / 4)); i++) tiles.appendChild(el('span', 'ts-tile'));
    b.appendChild(tiles);
    const bar = el('span', 'ts-seg-bar'); bar.style.background = f.color; b.appendChild(bar);
    b.appendChild(el('span', 'ts-seg-name', esc(s.short)));
    b.appendChild(el('span', 'ts-seg-time', fmt(s.start)));
    // clip mode jumps straight to this section; scaling s.start can round a hair into the previous one
    // a click counts as permission for sound, so it unmutes too
    b.addEventListener('click', () => { video.muted = false; hasVideo ? seek((s.start / simTotal) * total()) : seek(s.start, s); });
    $('.ts-segments').appendChild(b);
  });

  // legend: only the workflows that are used
  $('.ts-legend').innerHTML = [...new Set(segs.map((s) => s.flow))].map((k) =>
    '<span class="ts-legend-item"><span class="ts-dot" style="background:' + D.flows[k].color + '"></span>' + esc(D.flows[k].name) + '</span>').join('');

  // the little diagram for each step
  // note: one line from the BTS slide, shown above the step's images
  function visual(step, color) {
    return (step.note ? '<p class="ts-note">' + esc(step.note) + '</p>' : '') + body(step, color);
  }
  // captions: true puts each image's label underneath it (Violet Snow keeps them hidden)
  const fig = (inner, c, captions) => captions && c && c.label ? '<figure class="ts-fig">' + inner + '<figcaption>' + esc(c.label) + '</figcaption></figure>' : inner;
  function body(step, color) {
    if (step.image) return '<img class="ts-full" src="' + esc(step.image) + '" alt="' + esc(step.title) + '">';
    switch (step.kind) {
      case 'stack':
      {
        // wide 32:9 images (reference | ours) at their own shape, no cropping; 3 or more go two to a row
        const n = (step.cells || []).length || 1, cols = step.cols || (n >= 3 ? 2 : 1), rows = Math.ceil(n / cols);
        return '<div class="ts-stack" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr));--r:' + ((cols * 32) / (rows * 9)).toFixed(3) + '">' +
          (step.cells || []).map((c) => fig('<img src="' + esc(c.img) + '" alt="' + esc(c.label || '') + '">', c, step.captions)).join('') + '</div>';
      }
      case 'slides':
        // After Effects screenshots with their numbered notes; changes every 7s, dots to pick one
        return '<div class="ts-slides">' + (step.cells || []).map((c, i) =>
          '<div class="ts-slide' + (i === 0 ? ' on' : '') + '"><img src="' + esc(c.img) + '" alt="' + esc(c.label || '') + '">' +
            '<div class="ts-slide-text"><h4>' + esc(c.label || '') + '</h4>' + (c.sub ? '<p>' + esc(c.sub) + '</p>' : '') + (c.notes ? '<ol>' + c.notes.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ol>' : '') + '</div></div>').join('') +
          '<div class="ts-dots">' + (step.cells || []).map((c, i) => '<button type="button" class="' + (i === 0 ? 'on' : '') + '" aria-label="' + esc(c.label || 'Slide ' + (i + 1)) + '"></button>').join('') + '</div></div>';
      case 'grid': {
        // 4 or 8 boxes sit 4 to a row; anything else wraps 3 to a row (or step.cols)
        const n = (step.cells || []).length || 1, cols = step.cols || ([4, 8].includes(n) ? 4 : 3), rows = Math.ceil(n / cols);
        return '<div class="ts-grid' + (step.captions ? ' has-captions' : '') + '" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr));--r:' + ((cols * 16) / (rows * 9)).toFixed(3) + '">' +
          (step.cells || []).map((c) => fig('<div class="ts-cell">' + cell(c) + '</div>', c, step.captions)).join('') + '</div>';
      }
      case 'capsule':
        return '<div class="ts-nodes">' + (step.nodes || []).map((n, i, a) => '<div class="ts-node">' + esc(n) + '</div>' + (i < a.length - 1 ? arrowRight : '')).join('') + '</div>';
      case 'pair': {
        // one before → after row, or several stacked with more: [{ left, right }, ...]
        const row = (l, r, labels) => '<div class="ts-pair">' +
          '<div class="ts-pair-side"><div class="ts-frame">' + media(l) + '</div>' + (labels ? '<span>' + esc(l.label) + '</span>' : '') + '</div>' + arrowRight +
          '<div class="ts-pair-side"><div class="ts-frame">' + media(r) + '</div>' + (labels ? '<span>' + esc(r.label) + '</span>' : '') + '</div></div>';
        // --r = width/height of all rows together (two 16:9 frames + arrow + labels), used to fill the card
        const rows = [{ left: step.left, right: step.right }, ...(step.more || [])];
        // cols: 2 lays the pairs out two to a row, each with its own labels
        if (step.cols) {
          // labels: false drops the captions under each frame (so more rows fit without scrolling)
          const lines = Math.ceil(rows.length / step.cols), labels = step.labels !== false;
          return '<div class="ts-pairs ts-pairs-grid' + (labels ? '' : ' no-labels') + '" style="grid-template-columns:repeat(' + step.cols + ',minmax(0,1fr));--r:' + (((labels ? 3.3 : 3.7) * step.cols) / lines).toFixed(3) + '">' +
            rows.map((p) => row(p.left, p.right, labels)).join('') + '</div>';
        }
        return '<div class="ts-pairs" style="--r:' + (3.3 / rows.length).toFixed(3) + '">' + rows.map((p, i) => row(p.left, p.right, i === rows.length - 1)).join('') + '</div>';
      }
      case 'timeline': {
        const clip = (w, c, label, hi) => '<span' + (hi ? ' class="ts-hi"' : '') + ' style="flex:' + w + ' 1 0;background:' + c + '">' + (label ? esc(label) : '') + '</span>';
        // custom tracks: tracks: [{ id: 'A1', clips: [['Music', 10]] }, ...]  ('' = empty gap)
        // a third value of true highlights a clip in the step's tool color, with step.callout explaining it
        if (step.tracks) {
          const fill = { V: ['#2e2e2e', '#3a3a3a'], A: ['#222', '#2a2a2a'] };
          const hiColor = (D.tools[step.tool] || {}).color || color;
          return '<div class="ts-tracks">' + step.tracks.map((tr) =>
            '<div class="ts-track"><span>' + esc(tr.id) + '</span><div>' + tr.clips.map(([label, w, hi], n) =>
              clip(w, !label ? 'transparent' : hi ? hiColor : tr.accent ? color : (fill[tr.id[0]] || fill.V)[n % 2], label, hi)).join('') + '</div></div>').join('') +
            (step.callout ? '<p class="ts-callout"><span class="ts-callout-dot" style="background:' + hiColor + '"></span>' + esc(step.callout) + '</p>' : '') + '</div>';
        }
        return '<div class="ts-tracks">' +
          '<div class="ts-track"><span>V2</span><div>' + clip(2, 'transparent') + clip(3, color) + clip(4, 'transparent') + '</div></div>' +
          '<div class="ts-track"><span>V1</span><div>' + clip(3, '#2e2e2e') + clip(2, '#3a3a3a') + clip(3, '#2e2e2e') + clip(2, '#3a3a3a') + '</div></div>' +
          '<div class="ts-track"><span>A1</span><div>' + clip(10, '#222') + '</div></div></div>';
      }
      case 'prompt':
        return '<div class="ts-prompt"><p>' + esc(step.prompt || '') + '</p><span class="ts-send">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.4" fill="none"/></svg></span></div>';
      case 'layers':
        return '<div class="ts-layers">' + (step.cells || []).map((c) => '<div class="ts-layer"><span class="ts-layer-dot" style="background:' + color + '"></span>' + esc(c) + '</div>').join('') + '</div>';
      default:
        return '';
    }
  }
  // real media for a box: { img: 'x.jpg' } or { video: 'x.mp4' }, else the placeholder icon
  function media(o, size) {
    if (o && o.video) return '<video src="' + esc(o.video) + '"' + (o.poster ? ' poster="' + esc(o.poster) + '"' : '') + ' muted loop playsinline preload="metadata"></video>';
    // pos: 'top' keeps the top of a tall image (faces) when it's cropped to the box
    if (o && o.img) return '<img src="' + esc(o.img) + '" alt="' + esc(o.label || '') + '" loading="lazy"' + (o.pos ? ' style="object-position:center ' + esc(o.pos) + '"' : '') + '>';
    return icon((o && o.icon) || 'img', size);
  }
  // grid box: 'Label', or { label, img } / { label, video }
  function cell(c) {
    if (c && typeof c === 'object') return media(c, 20);   // the label stays as the image's alt text, no overlay
    return c ? esc(c) : icon('img', 20);
  }
  function toolTag(name) {
    const tool = D.tools[name] || {};
    return '<span class="ts-tool">' + (tool.logo ? '<img class="ts-tool-logo" src="' + esc(tool.logo) + '" alt="">' : '') + esc(name) + '</span>';
  }

  function renderPanel(s) {
    const f = D.flows[s.flow] || { name: '', color: '#888' };
    $$('[data-now-title]').forEach((n) => (n.textContent = s.title));
    $('[data-now-meta]').textContent = f.name + ' · ' + fmt(s.start) + '–' + fmt(s.end) + (s.credit ? ' · ' + s.credit : '');
    // steps sit side by side like folder tabs; the open one widens to show its diagram
    // step names stack in the left column; the open step's visuals fill the fixed panel on the right
    $('.ts-steps').style.setProperty('--n', s.steps.length);
    const card = (step, i) =>
      '<div class="ts-step' + (i === 0 ? ' open' : '') + '">' +
        '<button class="ts-step-head" type="button" aria-expanded="' + (i === 0) + '">' +
          '<span class="ts-num">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(step.title) + '</h3>' + toolTag(step.tool) +
          '<span class="ts-plus" aria-hidden="true">+</span></button>' +
        '<div class="ts-visual">' + visual(step, f.color) + '</div>' +
      '</div>';
    $('.ts-steps').innerHTML = s.steps.map(card).join('');
    playOpenClips();
    fitPanel();
  }
  // No scrolling inside the right panel: it is as tall as the section's tallest step (never shorter
  // than the default), so it stays one fixed size while you click through that section's steps.
  function fitPanel() {
    const box = $('.ts-steps');
    box.style.removeProperty('--fit');
    if (matchMedia('(max-width:760px)').matches) return;   // phones stack everything, no fixed panel
    const vis = [...box.querySelectorAll('.ts-visual')];
    const open = box.querySelector('.ts-step.open .ts-visual');
    let tallest = open ? open.offsetHeight : 0;   // the default fixed height
    vis.forEach((v) => {
      v.style.display = 'flex'; v.style.visibility = 'hidden'; v.style.height = 'auto';
      tallest = Math.max(tallest, v.offsetHeight);
      v.style.display = v.style.visibility = v.style.height = '';
    });
    box.style.setProperty('--fit', Math.ceil(tallest) + 'px');
  }
  // images change size as they load, and the window can be resized: measure again
  $('.ts-steps').addEventListener('load', () => { clearTimeout(fitPanel.t); fitPanel.t = setTimeout(fitPanel, 60); }, true);
  addEventListener('resize', () => { clearTimeout(fitPanel.t); fitPanel.t = setTimeout(fitPanel, 120); });
  $('.ts-steps').addEventListener('click', (e) => {
    const card = e.target.closest('.ts-step');
    if (!card || card.classList.contains('open')) return;
    $$('.ts-step').forEach((c) => { const on = c === card; c.classList.toggle('open', on); c.querySelector('.ts-step-head').setAttribute('aria-expanded', on); });
    playOpenClips();
  });
  // slides: step to the next screenshot every 3.5s in the open card
  const showSlide = (box, k) => {
    box.querySelectorAll('.ts-slide').forEach((m, n) => m.classList.toggle('on', n === k));
    box.querySelectorAll('.ts-dots button').forEach((m, n) => m.classList.toggle('on', n === k));
  };
  setInterval(() => {
    const box = root.querySelector('.ts-step.open .ts-slides');
    if (!box || box.matches(':hover')) return;   // hold still while someone is reading
    const all = [...box.querySelectorAll('.ts-slide')], i = all.findIndex((m) => m.classList.contains('on'));
    showSlide(box, (i + 1) % all.length);
  }, 7000);
  root.addEventListener('click', (e) => {
    const dot = e.target.closest('.ts-dots button');
    if (dot) showSlide(dot.closest('.ts-slides'), [...dot.parentNode.children].indexOf(dot));
  });
  // clips inside the step cards loop silently, only in the card that's open
  function playOpenClips() {
    $$('.ts-step video').forEach((v) => {
      v.muted = true;
      if (v.closest('.ts-step').classList.contains('open')) v.play().catch(() => {}); else v.pause();
    });
  }

  function update() {
    $('.ts-playhead').style.left = Math.min(100, (t / total()) * 100) + '%';
    root.classList.toggle('is-playing', playing);
    stage.setAttribute('aria-label', playing ? 'Pause trailer' : 'Play trailer');
    const st = segTime();
    const active = (!hasVideo && cur) || segs.find((s) => st >= s.start && st < s.end) || segs[segs.length - 1];
    $$('.ts-seg').forEach((b) => b.classList.toggle('is-active', b.dataset.id === active.id));
    if (active.id !== activeId) { activeId = active.id; renderPanel(active); }
  }

  /* clip mode: show the section's clip (or black if it has none yet) at time t */
  function enter(seg) {
    cur = seg;
    clearInterval(timer);
    if (seg.clip) {
      video.hidden = false; holder.hidden = true;
      const at = Math.max(0, t - seg.start);
      const go = () => { try { video.currentTime = at; } catch (_) {} if (playing) playWithSound().catch(() => {}); };
      if (video.dataset.src !== seg.clip) { video.dataset.src = seg.clip; video.src = seg.clip; video.addEventListener('loadedmetadata', go, { once: true }); }
      else go();
    } else {
      video.pause(); video.hidden = true; holder.hidden = false;
      if (playing) timer = setInterval(() => { t += 0.25; if (t >= seg.end) next(); else update(); }, 250);
    }
    update();
  }
  function next() {
    t = cur.end;
    if (t >= simTotal - 0.01) { t = 0; pause(); enter(segs[0]); return; }   // back to the start, paused
    enter(segAt(t));
  }

  function seek(sec, seg) {
    t = Math.max(0, Math.min(sec, total() - 0.01));
    if (hasVideo) { video.currentTime = t; update(); }
    else enter(seg || segAt(t));
  }
  function play() {
    playing = true;
    if (hasVideo) { if (t >= total() - 0.05) t = 0; video.currentTime = t; playWithSound().catch(() => { playing = false; update(); }); update(); }
    else enter(segAt(t));
  }
  function pause() {
    playing = false;
    clearInterval(timer);
    video.pause();
    update();
  }
  const toggle = () => (playing ? pause() : play());

  // click to play / pause, double-click for full screen (a short delay tells the two apart)
  let clickT = null;
  // the video starts muted (browsers only allow silent autoplay), so the first click turns the sound on
  const click = () => { if (!video.hidden && video.muted && playing) { video.muted = false; return; } toggle(); };
  stage.addEventListener('click', () => { clearTimeout(clickT); clickT = setTimeout(click, 220); });
  stage.addEventListener('dblclick', () => {
    clearTimeout(clickT);
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen?.().catch(() => {});
  });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter') toggle(); });
  addEventListener('keydown', (e) => {
    if (e.key !== ' ' || root.offsetParent === null || /INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) return;
    e.preventDefault(); toggle();
  });

  if (hasVideo) {
    video.addEventListener('timeupdate', () => { t = video.currentTime; update(); });
    video.addEventListener('loadedmetadata', update);
    video.addEventListener('ended', () => { playing = false; update(); });
    video.addEventListener('pause', () => { playing = false; update(); });
    video.addEventListener('play', () => { playing = true; update(); });
  } else {
    video.addEventListener('timeupdate', () => { if (cur && cur.clip && !video.hidden) { t = Math.min(cur.end - 0.01, cur.start + video.currentTime); update(); } });
    video.addEventListener('ended', () => { if (playing) next(); });
  }

  // main.js calls these when you open or leave the tab: it plays by itself on arrival
  window.trailerPause = () => { if (playing) pause(); };
  window.trailerPlay = () => { if (!playing) play(); };
  // while testing with clips, start at the first section that has one instead of on black
  const first = hasVideo ? segs[0] : (segs.find((s) => s.clip) || segs[0]);
  t = first.start; enter(first);
})();
