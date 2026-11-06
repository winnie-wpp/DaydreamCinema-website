/* ===== Echo's wardrobe =====
   Runs the wardrobe right in the page, styled like the rest of the site.
   The dressing rules (equip, remove, Bare, presets, Shuffle, Save PNG) come
   unchanged from the handoff's own engine and manifest in WARDROBE_DIR.
   The UI below is a port of the handoff's index.html script with ids prefixed "wd-".
   To update to a new release, point WARDROBE_DIR at the new versioned folder. */
const WARDROBE_DIR = "assets/echo-wardrobe/1.0.0/";
let wardrobeStarted = false;

function startWardrobe(){
  if(wardrobeStarted) return;
  wardrobeStarted = true;
  const status = document.getElementById("wd-status");
  status.textContent = "Opening the wardrobe…";
  const engine = document.createElement("script");
  engine.src = WARDROBE_DIR + "runtime/wardrobe_state.js";
  engine.onload = () => fetch(WARDROBE_DIR + "manifest.json")
    .then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(M => { status.textContent = ""; runWardrobe(window.Wardrobe, M); })
    .catch(failed);
  engine.onerror = failed;
  document.head.appendChild(engine);
  function failed(e){
    console.error("Wardrobe failed to load", e);
    wardrobeStarted = false;
    status.textContent = location.protocol === "file:"
      ? "The wardrobe needs the site to run on a local server (Live Server or python3 -m http.server)."
      : "The wardrobe couldn’t load. Please refresh the page.";
  }
}

function runWardrobe(A, M){
  'use strict';
  const C = A.catalog(M.parts), W = M.size[0], H = M.size[1];
  const url = src => WARDROBE_DIR + src;
  let state = A.initial(), table;
  const el = id => document.getElementById("wd-" + id);
  const label = {hat:'Hat', outer:'Outer', top:'Top', bot:'Bottoms', shoe:'Shoes'};
  const presetNames = {ush:'Usher', wst:'Western', spc:'Space: separates', jumpsuit:'Space: jumpsuit', robe:'Space: robe'};

  const base = document.createElement('img');
  base.className = 'wd-base'; base.src = url('base.png'); base.alt = 'Echo, bare';
  el('stage').replaceChildren(base);

  function button(text, fn, parent, cls){ const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.onclick = fn; if(cls) b.className = cls; parent.appendChild(b); return b; }
  function act(action){
    try { state = A.transaction(state, C, action); render(); }
    catch (e) { console.error('Wardrobe action failed', e); el('status').textContent = "Couldn't change this outfit. Please choose another item."; }
  }
  function rebuildSampler(){
    try { table = A.enumerate(C, {route:state.route, q:Number(el('q').value)}); el('shuffle').disabled = table.total <= 0;
      el('status').textContent = table.total > 0 ? '' : A.sample(table).reason;
    } catch (e) { console.error('Wardrobe sampler failed', e); table = null; el('shuffle').disabled = true; el('status').textContent = "Shuffle isn't available. Please adjust the controls."; }
  }
  function render(){
    // One unique rank-sorted list also supplies the save snapshot.
    const list = A.snapshot(state, C);
    el('stage').querySelectorAll('.part').forEach(im => im.remove());
    list.forEach((p, i) => {
      const im = document.createElement('img'); im.className = 'part'; im.src = url(p.src); im.alt = p.name;
      Object.assign(im.style, {left:100*p.x/W+'%', top:100*p.y/H+'%', width:100*p.w/W+'%', height:100*p.h/H+'%', zIndex:10+i});
      el('stage').appendChild(im);
    });
    el('zones').replaceChildren();
    A.slots.slice().reverse().forEach(s => {
      const box = document.createElement('section'); box.className = 'wd-zone';
      const head = document.createElement('div'); head.className = 'wd-zone-head';
      const heading = document.createElement('h2'); heading.textContent = label[s]; head.appendChild(heading);
      const current = C[state.worn[s]];
      if (current && A.rowSlot(current) !== s) {
        const occupied = button('Occupied by ' + current.name, () => act({type:'remove', id:current.id}), head, 'wd-link');
        occupied.title = 'Remove item and restore remembered choices';
      }
      if (current) button('Remove item', () => act({type:'remove', id:current.id}), head, 'wd-link');
      box.appendChild(head);
      if (state.notices[s]) { const n = document.createElement('p'); n.className = 'wd-status'; n.textContent = state.notices[s]; box.appendChild(n); }
      const row = document.createElement('div'); row.className = 'wd-row';
      const bare = button('', () => act({type:'bare', slot:s}), row, 'wd-opt wd-bare' + (!current ? ' on' : ''));
      bare.setAttribute('aria-pressed', !current); bare.innerHTML = '<span class="wd-none">Bare</span>';
      M.parts.filter(p => A.rowSlot(p) === s).forEach(p => {
        const on = state.worn[s] === p.id;
        const b = button('', () => act({type:'equip', id:p.id}), row, 'wd-opt' + (on ? ' on' : ''));
        b.setAttribute('aria-pressed', on);
        const im = document.createElement('img'); im.src = url(p.src); im.alt = ''; im.loading = 'lazy'; b.appendChild(im);
        const text = document.createElement('span'); text.className = 'wd-name'; text.textContent = p.name + p.occupies.filter(t => t !== s).map(t => ' +' + label[t].toLowerCase()).join(''); b.appendChild(text);
        const route = document.createElement('small'); route.textContent = A.routeKey(p.route) === 'e' ? 'Prompt to edit' : p.route; b.appendChild(route);
      });
      if (s === 'outer' && row.children.length === 1) { const n = document.createElement('p'); n.className = 'wd-hint'; n.textContent = 'No outer pieces yet.'; row.appendChild(n); }
      box.appendChild(row); el('zones').appendChild(box);
    });
    el('presets').replaceChildren();
    el('presetHint').textContent = state.route === 'all' ? 'Choose a route to unlock whole outfits' : '';
    Object.entries(presetNames).forEach(([key, name]) => {
      const resolved = A.preset(C, state.route, key);
      const b = button(name, () => act({type:'replace', ids:resolved.ids}), el('presets'), 'time');
      const unavailable = state.route === 'all' ? resolved.reason : name + " isn't available on this route";
      b.disabled = !resolved.ids; b.title = resolved.reason ? unavailable : name;
      if (resolved.reason && state.route !== 'all') { const reason = document.createElement('small'); reason.className = 'wd-hint'; reason.textContent = unavailable; el('presets').appendChild(reason); }
    });
  }
  el('route').onchange = () => { act({type:'route', route:el('route').value}); rebuildSampler(); };
  el('q').oninput = () => { el('qvalue').textContent = Math.round(Number(el('q').value)*100)+'%'; rebuildSampler(); };
  el('clear').onclick = () => act({type:'clear'});
  el('shuffle').onclick = () => {
    if (!table) return;
    try {
      const chosen = A.sample(table);
      if (chosen.ids) act({type:'replace', ids:chosen.ids});
      el('status').textContent = chosen.reason || '';
    } catch (e) { console.error('Wardrobe shuffle failed', e); el('status').textContent = "Shuffle isn't available. Please adjust the controls."; }
  };
  el('save').onclick = async () => {
    try {
      const saved = A.snapshot(state, C); // before any asynchronous image loading
      const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
      const load = src => new Promise((ok, bad) => { const im = new Image(); im.onload = () => ok(im); im.onerror = bad; im.src = url(src); });
      await A.exportSnapshot(saved, load, canvas.getContext('2d'));
      const names = saved.map(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'garment');
      const a = document.createElement('a'); a.download = 'echo_' + (names.join('_') || 'bare') + '.png'; a.href = canvas.toDataURL('image/png'); a.click();
    } catch (e) { console.error('Wardrobe export failed', e); el('status').textContent = 'Save failed: image could not load or export.'; }
  };
  render(); rebuildSampler();
}
