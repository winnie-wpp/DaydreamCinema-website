/* Wardrobe v3: shared state and sampling engine for the standalone page and Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Wardrobe = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const slots = Object.freeze(['shoe', 'bot', 'top', 'outer', 'hat']);
  const looks = ['ush', 'wst', 'spc'];
  const rank = s => slots.indexOf(s);
  const blank = () => Object.fromEntries(slots.map(s => [s, null]));
  const copy = x => JSON.parse(JSON.stringify(x));
  function need(ok, message) { if (!ok) throw new Error(message); }
  function finite(n, message) { need(typeof n === 'number' && Number.isFinite(n), message); return n; }
  function routeKey(route) {
    const names = {'Firefly 5': 'f', 'Prompt to edit': 'e', 'Nano Banana Pro': 'e', 'Nano Banana Pro (OpenRouter)': 'g'};
    return names[route] || route;
  }
  function itemValid(p) {
    need(p && typeof p.id === 'string' && p.id.length > 0, 'item needs stable ID');
    need(Array.isArray(p.occupies) && p.occupies.length > 0 && new Set(p.occupies).size === p.occupies.length && p.occupies.every(s => slots.includes(s)), 'invalid occupied slots');
    need(looks.includes(p.look), 'unknown look');
    need(['f', 'e', 'g'].includes(routeKey(p.route)), 'unknown route');
    finite(p.rank, 'invalid rank'); finite(p.weight, 'invalid weight');
    need(p.weight > 0, 'item weight must be positive');
    return p;
  }
  function catalog(items) {
    const c = Object.create(null);
    items.forEach(p => { itemValid(p); need(!c[p.id], 'duplicate item ID'); c[p.id] = Object.freeze({...copy(p), occupies: Object.freeze(p.occupies.slice())}); });
    return Object.freeze(c);
  }
  function initial() { return {worn: blank(), last: blank(), notices: {}, route: 'all'}; }
  function validate(state, c) {
    slots.forEach(s => {
      const id = state.worn[s];
      need(id === null || (c[id] && c[id].occupies.includes(s)), 'invalid worn slot');
      if (id !== null) c[id].occupies.forEach(t => need(state.worn[t] === id, 'partial item occupancy'));
    });
    return state;
  }
  function rowSlot(p) { return p.occupies.reduce((a, b) => rank(a) > rank(b) ? a : b); }
  function wornList(state, c) {
    validate(state, c);
    return [...new Set(slots.map(s => state.worn[s]).filter(Boolean))].map(id => c[id])
      .sort((a, b) => a.rank - b.rank || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }
  function snapshot(state, c) { return copy(wornList(state, c)); }
  function restore(state, freed, c) {
    slots.filter(s => freed.has(s)).forEach(s => {
      if (state.worn[s] !== null || state.last[s] === null) return;
      const p = c[state.last[s]];
      if (p && p.occupies.length === 1 && p.occupies[0] === s) state.worn[s] = p.id;
      else state.notices[s] = 'Remembered item is missing or incompatible';
    });
  }
  function removeWhole(state, ids, c) {
    const freed = new Set();
    ids.forEach(id => { if (id) c[id].occupies.forEach(s => { state.worn[s] = null; freed.add(s); }); });
    return freed;
  }
  function transaction(state, c, action) {
    validate(state, c);
    const n = copy(state); n.notices = {};
    if (action.type === 'route') {
      need(['all', 'f', 'e'].includes(action.route), 'invalid route filter');
      n.route = action.route;
      n.notices = copy(state.notices);
    } else if (action.type === 'clear') { n.worn = blank(); n.last = blank(); }
    else if (action.type === 'replace') {
      need(Array.isArray(action.ids) && new Set(action.ids).size === action.ids.length, 'duplicate outfit ID');
      n.worn = blank();
      action.ids.forEach(id => {
        need(c[id], 'missing outfit item: ' + id);
        c[id].occupies.forEach(s => { need(n.worn[s] === null, 'outfit slot conflict'); n.worn[s] = id; });
      });
      slots.forEach(s => { const p = c[n.worn[s]]; if (!p) n.last[s] = null; else if (p.occupies.length === 1) n.last[s] = p.id; });
    } else if (action.type === 'equip') {
      const p = c[action.id]; need(p, 'missing equipped item');
      if (p.occupies.every(s => n.worn[s] === p.id)) return state;
      const freed = removeWhole(n, new Set(p.occupies.map(s => n.worn[s])), c);
      p.occupies.forEach(s => { n.worn[s] = p.id; });
      if (p.occupies.length === 1) n.last[p.occupies[0]] = p.id;
      restore(n, freed, c);
    } else if (action.type === 'bare' || action.type === 'remove') {
      let s = action.slot;
      if (action.type === 'remove') {
        const p = c[action.id]; need(p, 'missing removed item');
        if (!p.occupies.some(t => n.worn[t] === p.id)) return state;
        if (p.occupies.length > 1) {
          restore(n, removeWhole(n, new Set([p.id]), c), c);
          return validate(n, c);
        }
        s = p.occupies[0];
      }
      need(slots.includes(s), 'invalid bare slot');
      n.last[s] = null;
      const freed = removeWhole(n, new Set([n.worn[s]]), c); freed.delete(s);
      restore(n, freed, c);
    } else throw new Error('unknown transaction');
    return validate(n, c);
  }
  const presets = {
    f: {
      ush: ['probe_fhatush_r1','probe_ftopush_r1','probe_fbotush_r1','probe_fshoeush_r2'],
      wst: ['probe_fhatwst_r1','probe_ftopwst_r1','probe_fbotwst_r1','probe_fshoewst_r2'],
      spc: ['probe_fhatspc_r1','probe_ftopspc_r1','probe_fbotspc_r1','probe_fshoespc_r2'],
      jumpsuit: ['probe_fhatspc_r1','probe_ftbspcjs_r1','probe_fshoespc_r2'],
      robe: ['probe_fhatspc_r1','probe_ftbspcrb_r1','probe_fshoespc_r2']
    },
    e: {
      ush: ['probe_ehatush_r1','probe_etopush_r1','probe_ebotush_r1','probe_eshoeush_r2'],
      wst: ['probe_ehatwst_r1','probe_etopwst_r1','probe_ebotwst_r1','probe_eshoewst_r2'],
      spc: ['probe_ehatspc_r1','probe_etopspc_r1','probe_ebotspc_r1','probe_eshoespc_r2'],
      jumpsuit: ['probe_ehatspc_r1','probe_etbspcjs_r1','probe_eshoespc_r2'],
      robe: ['probe_ehatspc_r1','probe_etbspcrb_r1','probe_eshoespc_r2']
    }
  };
  function preset(c, route, name) {
    if (route === 'all') return {reason: 'Choose a route for presets'};
    const ids = presets[route] && presets[route][name];
    if (!ids) return {reason: 'Unknown preset'};
    try {
      ids.forEach(id => { need(c[id], 'Missing preset item: ' + id); need(routeKey(c[id].route) === route, 'Preset route mismatch'); });
      transaction(initial(), c, {type: 'replace', ids});
      return {ids: ids.slice()};
    } catch (e) { return {reason: "This outfit isn't available on this route", diagnostic: e.message}; }
  }
  function enumerate(c, config = {}) {
    const route = config.route || 'all'; need(['all','f','e'].includes(route), 'invalid route filter');
    const q = config.q === undefined ? 0.5 : config.q;
    finite(q, 'invalid q'); need(q >= 0 && q <= 1, 'invalid q');
    const bare = Object.fromEntries(slots.map(s => [s, 1]));
    Object.entries(config.bare || {}).forEach(([s, w]) => { need(slots.includes(s), 'unknown bare slot'); finite(w, 'invalid bare weight'); need(w >= 0, 'negative bare weight'); bare[s] = w; });
    const pairs = new Map();
    const key = (a, b) => JSON.stringify([a, b].sort());
    (config.pairs || []).forEach(p => {
      need(Array.isArray(p) && p.length === 3 && c[p[0]] && c[p[1]] && p[0] !== p[1], 'invalid pair');
      finite(p[2], 'invalid pair weight'); need(p[2] >= 0, 'negative pair weight');
      const k = key(p[0], p[1]); need(!pairs.has(k), 'duplicate unordered pair'); pairs.set(k, p[2]);
    });
    const entries = slots.map(() => []);
    Object.values(c).forEach(p => {
      itemValid(p);
      if (route === 'all' || routeKey(p.route) === route) entries[Math.min(...p.occupies.map(rank))].push(p);
    });
    entries.forEach(a => a.sort((a, b) => a.id < b.id ? -1 : 1));
    const outfits = [], classes = {C: [], M: []}, totals = {C: 0, M: 0};
    const product = (a, b) => finite(a * b, 'outfit weight overflow');
    function visit(at, covered, picked, bareSlots) {
      if (at === slots.length) {
        let weight = 1;
        picked.forEach(p => { weight = product(weight, p.weight); });
        bareSlots.forEach(s => { weight = product(weight, bare[s]); });
        for (let i = 0; i < picked.length; i++) for (let j = i + 1; j < picked.length; j++) {
          const k = key(picked[i].id, picked[j].id);
          weight = product(weight, pairs.has(k) ? pairs.get(k) : 1);
        }
        const diversity = new Set(picked.map(p => p.look)).size;
        const group = diversity === 0 ? null : diversity === 1 ? 'C' : 'M';
        const outfit = {ids: picked.map(p => p.id).sort(), weight, group}; outfits.push(outfit);
        if (group && weight > 0) { classes[group].push(outfit); totals[group] = finite(totals[group] + weight, 'class total overflow'); }
        return;
      }
      const s = slots[at];
      if (covered.has(s)) return visit(at + 1, covered, picked, bareSlots);
      // Bare is committed just like an item: later entries cannot reach back into it.
      visit(at + 1, new Set([...covered, s]), picked, [...bareSlots, s]);
      entries[at].forEach(p => {
        if (p.occupies.every(s => !covered.has(s))) visit(at + 1, new Set([...covered, ...p.occupies]), [...picked, p], bareSlots);
      });
    }
    visit(0, new Set(), [], []);
    const total = finite(totals.C + totals.M, 'total weight overflow');
    return {outfits, classes, totals, total, q, route, traversal: slots.slice()};
  }
  function sample(table, rng = Math.random) {
    if (!(table.total > 0)) return {reason: 'Shuffle unavailable: no positive nonempty outfit weight'};
    function random() { const u = rng(); finite(u, 'invalid random draw'); need(u >= 0 && u < 1, 'random draw outside [0,1)'); return u; }
    let group, reason = '';
    if (table.totals.C > 0 && table.totals.M > 0) group = random() < table.q ? 'M' : 'C';
    else { group = table.totals.C > 0 ? 'C' : 'M'; reason = 'Only ' + (group === 'C' ? 'coherent' : 'mixed') + ' outfits have positive weight; using that class'; }
    const target = random() * table.totals[group]; let sum = 0, lastPositive = null;
    for (const outfit of table.classes[group]) {
      sum += outfit.weight;
      if (outfit.weight > 0) lastPositive = outfit;
      if (sum > target) return {ids: outfit.ids.slice(), group, reason};
    }
    // Tiny/subnormal products can round u*Z up to Z although u < 1.
    // Do not conceal an inconsistent table: the final cumulative sum must agree.
    if (target === table.totals[group] && sum === table.totals[group] && lastPositive)
      return {ids: lastPositive.ids.slice(), group, reason};
    throw new Error('invalid cumulative weight');
  }
  async function exportSnapshot(list, load, ctx, base = 'base.png') {
    // Capture records synchronously, before even the base image starts loading.
    const saved = copy(list);
    ctx.drawImage(await load(base), 0, 0);
    for (const p of saved) ctx.drawImage(await load(p.src), p.x, p.y, p.w, p.h);
    return saved;
  }
  return {slots, catalog, initial, validate, transaction, wornList, snapshot, rowSlot, routeKey, preset, presets, enumerate, sample, exportSnapshot};
});
