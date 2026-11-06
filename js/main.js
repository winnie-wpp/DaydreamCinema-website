/* ===== CONTENT CONFIG ===== */
const FILMS = [
  {title:"Admit Two", meta:"3D spectacle, 9 min", blurb:"Grab your red-and-blue glasses. Echo and Mono come right off the screen in glorious 3D, both on one ticket.", times:["4:00 pm", "7:15 pm", "9:30 pm"], img:"assets/posters/admit-two.webp"},
  {title:"Attack of the Low Poly!", meta:"Monster movie, 11 min", blurb:"A giant, unfinished Echo escapes the render queue and stomps toward the city, all sharp corners and missing faces. Mono is not ready for this.", times:["5:30 pm", "8:45 pm"], img:"assets/posters/attack-of-the-low-poly.webp"},
  {title:"It Came From the Fog!", meta:"Sci-fi B-movie, 8 min", blurb:"A flying saucer, a green tractor beam and a fog so thick it swallows Mono whole. All that’s left is a scarf and two feet.", times:["6:00 pm", "10:15 pm"], img:"assets/posters/it-came-from-the-fog.webp"},
  {title:"Light Always Bounces Twice", meta:"Noir, 12 min", blurb:"One streetlamp, one rainy alley and a ray of light that won’t stop bouncing. Detective Echo follows it straight to a glowing sketch of Mono.", times:["7:00 pm", "11:00 pm"], img:"assets/posters/light-always-bounces-twice.webp"},
  {title:"Fists of Blur", meta:"Kung fu, 7 min", blurb:"Echo kicks so fast the frames smear. Mono answers with ink-brush speed lines. A martial arts showdown fought entirely in motion blur.", times:["3:45 pm", "6:30 pm"], img:"assets/posters/fists-of-blur.webp"},
  {title:"Now You Don’t", meta:"Magic show, 9 min", blurb:"Mono’s big vanishing act works a little too well. Under the cloak, Echo is fading away one sparkle at a time.", times:["2:15 pm", "5:00 pm", "8:00 pm"], img:"assets/posters/now-you-dont.webp"},
  {title:"Tear the Sky", meta:"Space adventure, 10 min", blurb:"Echo peels back the starfield like the corner of a poster and finds Mono sketched on the other side, with nothing at all behind that.", times:["4:30 pm", "9:00 pm"], img:"assets/posters/tear-the-sky.webp"},
  {title:"Hall of Mirrors", meta:"Mystery, 8 min", blurb:"Echo meets one blurry reflection. Mono meets a hundred, and one of them is only a shadow.", times:["6:45 pm", "10:30 pm"], img:"assets/posters/hall-of-mirrors.webp"},
  {title:"Cast of Thousands!", meta:"Epic, 14 min", blurb:"One Echo becomes ten thousand in a sun-baked colosseum. Mono gives every copy a moustache, one paintbrush at a time.", times:["1:30 pm", "7:30 pm"], img:"assets/posters/cast-of-thousands.webp"},
  {title:"Iris Crisis", meta:"Silent comedy, 6 min", blurb:"The iris is closing on the scene and Echo is pushing back with everything. Mono peeks in from the edge, waiting for a cue.", times:["3:00 pm", "5:45 pm"], img:"assets/posters/iris-crisis.webp"},
  {title:"Deep Trouble", meta:"Adventure, 10 min", blurb:"Painted across stacked panes of glass, Echo and Mono get lost in a moonlit forest that’s much deeper than it looks.", times:["4:15 pm", "8:15 pm"], img:"assets/posters/deep-trouble.webp"},
  {title:"Look Out Below!", meta:"Western, 8 min", blurb:"A twister drops a whole house on Main Street. Echo’s collision box holds up. Mono ends up flat as a drawing.", times:["2:45 pm", "6:15 pm"], img:"assets/posters/look-out-below.webp"},
  {title:"Curse of the Map", meta:"Horror, 9 min", blurb:"Deep in a candlelit crypt, a cursed UV map wraps Echo in patchwork checkers. Mono has one lantern and a lot of questions.", times:["9:45 pm", "11:59 pm"], img:"assets/posters/curse-of-the-map.webp"},
  {title:"All Bump, No Bite", meta:"Horror comedy, 7 min", blurb:"A monstrous shadow looms on the wall, but it’s only Echo’s bump map acting up. Mono is busy chalking in the spikes.", times:["8:30 pm", "10:45 pm"], img:"assets/posters/all-bump-no-bite.webp"},
  {title:"Pixel Palace", meta:"Rooftop caper, 9 min", blurb:"High above the city, Echo lights up a giant marquee bulb by bulb while Mono checks the sketch it’s supposed to match.", times:["5:15 pm", "9:15 pm"], img:"assets/posters/pixel-palace.webp"},
  {title:"Down in Front!", meta:"Comedy, 6 min", blurb:"Mono finally gets top billing on the big screen, and Echo’s hair is blocking the whole view.", times:["3:30 pm", "7:45 pm"], img:"assets/posters/down-in-front.webp"}
];
/* Home wall: number of theater boxes. Videos come from SCENES below and are spread evenly across the boxes. */
const CELL_COUNT = 30;
const CELLS = Array.from({length:CELL_COUNT}, (_, i) => ({label:`Screen ${String(i+1).padStart(2,"0")}`}));
/* Shop items. Put product photos in assets/merch/ and add img:"assets/merch/file.webp" (optional desc:"one line").
   Items without img show their emoji icon. */
const ITEMS = [
  {name:"Echo plush keychain", price:"$16", img:"assets/merch/web/echo-plushies.jpg", desc:"Waving Echo with a velvet cape, tiny satchel and a Daydream Cinema tag."},
  {name:"Echo tee", price:"$20", img:"assets/merch/web/echo-tshirt.png", desc:"Cream cotton. Small cinema logo on the front, Echo’s big western-space adventure on the back."},
  {name:"Mono sketchbook", price:"$7", img:"assets/merch/web/mono-notebook.png", desc:"A black spiral sketchbook with Mono’s hand-drawn name. For your own clues."},
  {name:"Daydream stickers", price:"$3", img:"assets/merch/web/daydream-stickers.png", desc:"A pair of round vinyl stickers with the little Daydream blob."},
  {name:"Emotional blob pins", price:"$8", img:"assets/merch/web/blobs-pin.jpg", desc:"All six feelings in gold-edged enamel. Collect the whole audience."},
  {name:"Blob bandana", price:"$9", img:"assets/merch/web/blobs-badana.jpg", desc:"Hot-pink silky square with the six blobs swirling around the middle."},
  {name:"Popcorn & drink set", price:"$10", img:"assets/merch/web/daydream-popcorondrinks.jpg", desc:"A Daydream Cinema popcorn bucket and cup starring Echo, Mono and the blobs."},
  {name:"Marquee light box", price:"$24", img:"assets/merch/web/daydream-lightbox.jpg", desc:"A little red marquee with glowing bulbs. Spell out your own Now Showing."}
];
const BLOBS = [
  {name:"Spark", feel:"Joy", line:"Zooms around the room whenever a scene lands just right.", img:"assets/characters/blob-spark-joy.webp"},
  {name:"Lumen", feel:"Wonder", line:"Lights up at every plot twist and never stops asking how.", img:"assets/characters/blob-lumen-wonder.webp"},
  {name:"Cozy", feel:"Calm", line:"Warm, content and happiest when the credits roll on a good ending.", img:"assets/characters/blob-cozy-calm.webp"},
  {name:"Blaze", feel:"Anger", line:"Flares up whenever the villain wins or the film skips a frame.", img:"assets/characters/blob-blaze-anger.webp"},
  {name:"Drizzle", feel:"Sadness", line:"Keeps every ticket stub, and cries at every goodbye.", img:"assets/characters/blob-drizzle-sadness.webp"},
  {name:"Shiver", feel:"Fear", line:"First to scream, first to spill the popcorn.", img:"assets/characters/blob-shiver-fear.webp"}
];
const SCENES = [
  "assets/videos/scene-little-ronin.mp4",
  "assets/videos/scene-clockwork-city.mp4",
  "assets/videos/scene-crooked-room.mp4",
  "assets/videos/scene-voyage-to-the-moon.mp4",
  "assets/videos/scene-engine-driver.mp4",
  "assets/videos/scene-night-of-the-count.mp4",
  "assets/videos/012cd5a9-e87e-4385-b2c8-01d27dc5dd8d.mp4",
  "assets/videos/17386b89-46a1-4f1e-adbf-d3cb83bcb229.mp4",
  "assets/videos/74320127-fbde-4bd4-9990-2a39774bf97e.mp4",
  "assets/videos/f8ff7eda-7be3-4013-a47f-319dadddd7c8.mp4",
  "assets/videos/fea506d3-d900-448e-8d05-4c2c572e36f1.mp4",
  "assets/videos/6d266adc-d9af-4739-9e68-ac70ffcb4a62.mp4",
  "assets/videos/6e3aca53-ef1a-456d-8557-8c5b54070a19.mp4",
  "assets/videos/804e7dfb-5f68-4ab9-9da6-2d295d2883af.mp4",
  "assets/videos/9ae3cb25-f6c1-4fcf-83e6-6f92147a46e0.mp4",
  "assets/videos/d785b556-ec19-4f10-87e2-f2185300076c.mp4",
  "assets/videos/6a1ca986-8864-455d-a8df-b4644a3ec098.mp4",
  "assets/videos/7a50b2cd-2242-499e-9f6d-977452f4b4d7.mp4",
  "assets/videos/8c89b46c-0f95-437c-a01d-babc5542c9f8.mp4",
  "assets/videos/958ddaf9-360d-4a65-abff-076bcd531934.mp4",
  "assets/videos/e6c3b58b-a0ed-46af-b242-b46a3cda287d.mp4",
  "assets/videos/6894dbf7-0ac6-4af6-9489-2fd449c4a51e.mp4",
  "assets/videos/95fc99d2-2634-4a0b-b97e-835937ec21b7.mp4",
  "assets/videos/bfa0a6f7-a0b2-421f-99ac-fb2de1ad376f.mp4",
  "assets/videos/d8ea1913-ccb1-4f5f-938e-46911c320fb3.mp4",
  "assets/videos/fe205a08-219a-48d5-a5bd-5d5cf36dc234.mp4"
];
/* step through SCENES by a stride that shares no factor with its length, so every video is used and neighbors differ */
const gcd=(a,b)=>b?gcd(b,a%b):a;
const STRIDE=[5,7,3,2,1].find(k=>gcd(k,SCENES.length)===1);
CELLS.forEach((c,i)=>{ c.scene=(i*STRIDE)%SCENES.length; });

const SAMPLE = SCENES[0];
const hero = document.getElementById("heroVideo"); hero.src = SAMPLE;

const $ = id => document.getElementById(id);
const timesHTML = (film, ts) => `<div class="times" data-film="${film}">${ts.map(t=>`<button class="time" type="button" aria-pressed="false">${t}</button>`).join("")}</div>`;
$("films").innerHTML = FILMS.map(f=>`
  <article class="film"><div class="thumb">${f.img?`<img src="${f.img}" alt="${f.title} still">`:`<div class="ph">${f.title}</div>`}</div>
  <h3>${f.title}</h3><p class="meta">${f.meta}</p><p class="blurb">${f.blurb}</p>${timesHTML(f.title,f.times)}</article>`).join("");
$("blobs").innerHTML = BLOBS.map(b=>`<article class="blob"><div class="pic"><img src="${b.img}" alt="${b.name}"></div><p class="feel">${b.feel}</p><h3>${b.name}</h3><p>${b.line}</p></article>`).join("");
$("items").innerHTML = ITEMS.map(i=>`
  <div class="item"><div class="art${i.img?" photo":""}">${i.img?`<img src="${i.img}" alt="${i.name}" loading="lazy">`:i.icon}</div><h3>${i.name}</h3>${i.desc?`<p class="desc">${i.desc}</p>`:""}
  <div class="row"><span>${i.price}</span><button class="time add" type="button" data-name="${i.name}">Add to cart</button></div></div>`).join("");

/* ===== wall ===== */
const wall = $("wall");
wall.innerHTML = CELLS.map((c,i)=>`
  <div class="cell" tabindex="0" role="button" aria-label="${c.label}, raise curtain" data-i="${i}">
    <video muted playsinline preload="none"></video>
    <div class="curtain" aria-hidden="true"><span></span><span></span></div>
    <div class="spot"></div><div class="bulbs"></div>
  </div>`).join("");
const cells = [...wall.querySelectorAll(".cell")];
function syncWall(){ wall.classList.toggle("active", !!wall.querySelector(".cell.open")); }
function openCell(el){
  if(el.classList.contains("open")) return;
  el.classList.add("open"); syncWall();
  const v = el.querySelector("video"); if(!v) return;
  if(!v.src) v.src = SCENES[CELLS[el.dataset.i].scene];
  try{ v.currentTime = 0; }catch(_){}
  v.play().catch(()=>{});
}
function closeCell(el){
  el.classList.remove("open"); syncWall();
  const v = el.querySelector("video");
  if(v) setTimeout(()=>{ if(!el.classList.contains("open")) v.pause(); }, 900);
}
const finePointer = matchMedia("(hover: hover)").matches;
cells.forEach(el=>{
  el.querySelector("video").addEventListener("ended",()=>closeCell(el));   /* auto close when the clip finishes */
  if(finePointer) el.addEventListener("mouseenter",()=>openCell(el));
  el.addEventListener("click",()=>{ if(!finePointer) openCell(el); });
  el.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openCell(el);} });
});
/* lights flicker on and off across the wall */
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  setInterval(()=>{ const c = cells[Math.floor(Math.random()*cells.length)]; if(!c.classList.contains("open")) c.classList.toggle("lit"); }, 350);
}
cells.forEach(c=>{ if(Math.random()<.35) c.classList.add("lit"); });

/* ===== showtimes + bag ===== */
let bag=0,tt;
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),1800)}
document.addEventListener("click",e=>{
  const add=e.target.closest(".add");
  if(add){bag++;$("bagCount").textContent=bag;toast(`Added ${add.dataset.name} to cart`);return}
  const b=e.target.closest(".times .time");
  if(b){const g=b.parentElement;g.querySelectorAll(".time").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));toast(`Seat saved: ${g.dataset.film}, ${b.textContent}`)}
});

/* ===== routing ===== */
const VIEWS=["home","now-showing","characters","worlds","cinema","store","wardrobe"];
const NAV_PARENT={wardrobe:"characters"};   /* sub-pages highlight their parent tab */
function route(){
  const [base,sub]=location.hash.slice(1).split("/");   /* e.g. #worlds/neon-rain opens one set */
  const v=VIEWS.includes(base)?base:"home";
  VIEWS.forEach(n=>$("v-"+n).classList.toggle("on",n===v));
  $("foot").hidden = v==="home";   /* the home wall is full screen */
  const tab=NAV_PARENT[v]||v;
  document.querySelectorAll("nav a").forEach(a=>{if(a.getAttribute("href")==="#"+tab)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  if(v==="wardrobe") startWardrobe();
  if(window.worldsView){ setWorldsOffset(); worldsView(v==="worlds", sub); }
  v==="now-showing"?hero.play().catch(()=>{}):hero.pause();
  window.scrollTo(0,0);
}
/* worlds fills the screen below the header, whose height changes on phones */
function setWorldsOffset(){ document.documentElement.style.setProperty("--worlds-offset", document.querySelector("header").offsetHeight+"px"); }
addEventListener("resize",setWorldsOffset);
addEventListener("hashchange",route);route();
