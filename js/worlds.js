/* Daydream Cinema: Sets tab, a full-screen slideshow.
   Each set fills the screen with its video playing. Its three renders sit as thumbnails to swap in a still.
   When a video ends it zooms on to the next set by itself. Next set / arrow keys / swipe do the same. #worlds/<slug> links straight to one set.
   main.js calls window.worldsView(on, slug) whenever the route changes.

   To add a set: make assets/sets/<slug>/ with shot-1.jpg, shot-2.jpg, shot-3.jpg (renders),
   thumb-1.jpg ... thumb-3.jpg (small copies, about 640px wide) and video.mp4, then add an entry below. */
const SETS = [
  {slug:"glowing-wilds", title:"The Glowing Wilds", inspired:"Avatar", line:"A glowing rainforest at night. Giant mushrooms light the way, lanterns of flowers hang from the canopy and every drop of water glows."},
  {slug:"neon-rain", title:"Neon Rain", inspired:"Blade Runner", line:"A rain-soaked street after midnight, stacked with glowing signs, noodle stalls and skyways that disappear into the smog."},
  {slug:"candy-river", title:"The Candy River", inspired:"Charlie and the Chocolate Factory", line:"A meadow you can eat: a slow chocolate river, candy-cane trees and lollipop stepping stones leading to a little bridge."},
  {slug:"pink-hotel", title:"The Pink Hotel", inspired:"The Grand Budapest Hotel", line:"A rose-pink grand hotel perched on a snowy mountainside, with a tiny funicular and a sleepy town tucked below."},
  {slug:"lost-valley", title:"The Lost Valley", inspired:"Jurassic Park", line:"An open valley in the late afternoon light, with a calm lagoon, tall trees and a great wooden gate where something enormous waits behind the fence."},
  {slug:"dust-highway", title:"The Dust Highway", inspired:"Mad Max", line:"An endless desert road where a convoy of rusted war rigs and spiked buggies roars toward a white-hot sun."},
  {slug:"long-hallway", title:"The Long Hallway", inspired:"The Shining", line:"An old hotel corridor of patterned carpet, brass lamps and numbered doors that goes on just a little too long."},
  {slug:"circuit-city", title:"Circuit City", inspired:"Tron", line:"A black glass city laced with glowing cyan lines, floating platforms and a low fog that hums."},
  {slug:"junk-skyline", title:"The Junk Skyline", inspired:"WALL·E", line:"A sunset city built from towers of compacted rubbish, where one little street lamp still keeps watch."}
];
const SHOTS = 3;

(function(){
  const $ = id => document.getElementById(id);
  const box=$("worlds"), info=document.querySelector(".winfo");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const file=(i,f)=>`assets/sets/${SETS[i].slug}/${f}`;
  let si=0, view="video", front=$("wSlideA"), back=$("wSlideB"), busy=false, active=false, ready=false;

  /* put set i into a layer, showing either its video or still n (0-2) */
  async function fill(layer,i,v){
    const im=layer.querySelector("img"), vd=layer.querySelector("video");
    im.src=file(i, v==="video" ? "shot-1.jpg" : `shot-${v+1}.jpg`);   /* shot 1 doubles as the video's poster */
    await Promise.race([im.decode().catch(()=>{}), new Promise(r=>setTimeout(r,1500))]);   /* never let a slow image freeze the slideshow */
    if(v==="video"){
      const src=file(i,"video.mp4");
      if(vd.dataset.src!==src){ vd.dataset.src=src; vd.src=src; }
      layer.removeAttribute("data-still");
      try{ vd.currentTime=0; }catch(_){}
      if(active) vd.play().catch(()=>{});
    } else { vd.pause(); layer.setAttribute("data-still",""); }
  }
  function show(){
    const s=SETS[si];
    $("wTitle").replaceChildren(...s.title.split(" ").map((word,n)=>{ const e=document.createElement("span"); e.textContent=word; e.style.setProperty("--i",n); return e; }));
    $("wTitle").setAttribute("aria-label",s.title);
    $("wLine").textContent=s.line;
    $("wCount").textContent=`Inspired by ${s.inspired}`;
    const views=["video",...Array.from({length:SHOTS},(_,n)=>n)];
    $("wShots").replaceChildren(...views.map(v=>{
      const b=document.createElement("button"); b.type="button"; b.className="wshot"+(v==="video"?" wshot-video":"");
      b.setAttribute("aria-label", v==="video" ? "Play the scene" : `Still ${v+1}`);
      b.setAttribute("aria-pressed", v===view);
      b.innerHTML=`<img src="${file(si, v==="video" ? "thumb-1.jpg" : `thumb-${v+1}.jpg`)}" alt="">`+(v==="video"?"<span>▶</span>":"");
      b.addEventListener("click",()=>go(si,v)); return b;
    }));
    $("wDots").querySelectorAll("button").forEach((b,n)=>b.setAttribute("aria-current",n===si?"true":"false"));
    new Image().src=file((si+1)%SETS.length,"shot-1.jpg");   /* have the next set ready */
  }

  /* new set: old slide zooms past the camera while the new one grows in. Same set: quick crossfade. */
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const snap=(el,fn)=>{ el.style.transition="none"; fn(); void el.offsetWidth; el.style.transition=""; };
  async function go(i,v="video"){
    if(busy||(i===si&&v===view)) return; busy=true;
    const newSet=i!==si;
    if(newSet) info.classList.add("hide");
    await fill(back,i,v);
    if(reduce){ back.style.opacity=1; front.style.opacity=0; }
    else{
      snap(back,()=>{ back.className="wslide "+(newSet?"wenter":"wfadein"); back.style.opacity=1; });
      if(newSet) front.classList.add("wleave");
      await wait(newSet?1300:700);
    }
    snap(front,()=>{ front.className="wslide"; front.style.opacity=0; });
    snap(back,()=>{ back.className="wslide"; });
    front.querySelector("video").pause();
    [front,back]=[back,front];
    si=i; view=v; show(); info.classList.remove("hide");
    if(newSet && active) history.replaceState(null,"",`#worlds/${SETS[si].slug}`);
    busy=false;
  }
  const next=()=>go((si+1)%SETS.length), prev=()=>go((si-1+SETS.length)%SETS.length);
  $("wNext").addEventListener("click",next);
  $("wPrev").addEventListener("click",prev);
  $("wDots").innerHTML=SETS.map(s=>`<button type="button" aria-label="${s.title}"></button>`).join("");
  $("wDots").querySelectorAll("button").forEach((b,i)=>b.addEventListener("click",()=>go(i)));

  /* swipe on touch screens */
  let down=null;
  box.addEventListener("pointerdown",e=>{ if(e.pointerType!=="mouse") down={x:e.clientX,y:e.clientY,t:performance.now()}; });
  box.addEventListener("pointerup",e=>{
    if(!down) return; const dx=e.clientX-down.x, dy=e.clientY-down.y, quick=performance.now()-down.t<800; down=null;
    if(quick && Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.5) (dx<0?next:prev)();
  });
  /* two-finger sideways swipe on a trackpad */
  let wheel=0, wheelT=0;
  box.addEventListener("wheel",e=>{
    if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)) return;
    e.preventDefault(); const now=performance.now(); if(now-wheelT>300) wheel=0; wheelT=now;
    wheel+=e.deltaX; if(Math.abs(wheel)>120){ (wheel>0?next:prev)(); wheel=-1e9*Math.sign(wheel); }
  },{passive:false});
  addEventListener("keydown",e=>{ if(!active) return; if(e.key==="ArrowRight") next(); if(e.key==="ArrowLeft") prev(); });
  /* when a set's video finishes, move on to the next set (not while someone is looking at a still) */
  [$("wSlideA"),$("wSlideB")].forEach(layer=>layer.querySelector("video").addEventListener("ended",()=>{
    if(active && layer===front && view==="video") next();
  }));

  /* ===== below the slideshow: one box per set, scroll sideways through its stills ===== */
  $("setList").innerHTML=SETS.map((s,i)=>`
    <article class="set-box">
      <div class="set-strip" tabindex="0" aria-label="${s.title} stills">
        ${Array.from({length:SHOTS},(_,n)=>`<img src="${file(i,`shot-${n+1}.jpg`)}" alt="${s.title}, still ${n+1}" loading="lazy">`).join("")}
      </div>
      <button class="set-arrow prev" type="button" aria-label="Previous still">‹</button>
      <button class="set-arrow next" type="button" aria-label="Next still">›</button>
      <div class="set-meta"><a href="#worlds/${s.slug}"><h3>${s.title}</h3></a><span class="set-count">1 / ${SHOTS}</span></div>
      <p>Inspired by ${s.inspired}</p>
    </article>`).join("");
  $("setList").querySelectorAll(".set-box").forEach(b=>{
    const strip=b.querySelector(".set-strip"), count=b.querySelector(".set-count");
    const at=()=>Math.round(strip.scrollLeft/strip.clientWidth);
    strip.addEventListener("scroll",()=>{ count.textContent=`${at()+1} / ${SHOTS}`; },{passive:true});
    let target=null, clear;   /* remember where a click is heading, so quick clicks add up */
    const step=d=>{
      target=Math.max(0,Math.min(SHOTS-1,(target??at())+d));
      strip.scrollTo({left:target*strip.clientWidth,behavior:reduce?"auto":"smooth"});
      count.textContent=`${target+1} / ${SHOTS}`;
      clearTimeout(clear); clear=setTimeout(()=>{ target=null; },700);
    };
    b.querySelector(".prev").addEventListener("click",()=>step(-1));
    b.querySelector(".next").addEventListener("click",()=>step(1));
  });

  /* called by main.js on every route change */
  window.worldsView=(on,slug)=>{
    if(!on){ active=false; box.querySelectorAll("video").forEach(v=>v.pause()); return; }
    active=true;
    const i=SETS.findIndex(s=>s.slug===slug);
    if(!ready){ ready=true; si=i<0?0:i; view="video"; front.style.opacity=1; back.style.opacity=0; fill(front,si,"video"); show(); return; }
    if(i>=0 && i!==si) go(i);
    else if(view==="video") front.querySelector("video").play().catch(()=>{});
  };
})();
