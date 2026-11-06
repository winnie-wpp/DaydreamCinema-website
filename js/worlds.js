/* Daydream Cinema: Worlds (spotlight paint reveal). From the daydream-worlds handoff.
   main.js starts and stops it with window.worldsView(true/false) when the tab opens and closes. */

/* ===== worlds: spotlight reveal =====
   To add a world: put the color render in assets/worlds/ and add an entry here.
   outline = optional path to your own pencil version (same size/framing as img). Leave "" to auto-generate.
   fx/fy = where the color first blooms in (0 to 1 across the image). */
const WORLDS = [
  {title:"The Glowing Wilds", inspired:"Avatar", line:"A glowing alien rainforest at night. Giant mushrooms light the way, lanterns of flowers hang from the canopy and every drop of water glows.", img:"assets/worlds/glowing-wilds.webp", outline:"", fx:.42, fy:.62},
  {title:"The Lost Valley", inspired:"Jurassic Park", line:"An open grassland valley in the late afternoon light, with a calm lagoon, tall sparse trees and a great wooden gate where something enormous waits behind the fence.", img:"assets/worlds/lost-valley.webp", outline:"", fx:.3, fy:.5}
];
(function(){
  const $ = id => document.getElementById(id);
  const box=$("worlds"), outA=$("wOutA"), outB=$("wOutB"), col=$("wColor"), dctx=col.getContext("2d");
  const mask=document.createElement("canvas"), mctx=mask.getContext("2d");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let idx=0, front=outA, back=outB, busy=false, running=false, moved=false, dirty=true, last=null, bloom=null, W=0, H=0, dpr=1;
  const imgs=WORLDS.map(w=>{ const im=new Image(); im.onload=()=>{dirty=true}; im.src=w.img; return im; });
  const outlineCache={};

  function boxBlur(src,W,H,rad){
    const tmp=new Float32Array(src.length), out=new Float32Array(src.length), k=2*rad+1;
    for(let y=0;y<H;y++){let s=0,o=y*W;for(let x=-rad;x<=rad;x++)s+=src[o+Math.min(W-1,Math.max(0,x))];
      for(let x=0;x<W;x++){tmp[o+x]=s/k;s+=src[o+Math.min(W-1,x+rad+1)]-src[o+Math.max(0,x-rad)];}}
    for(let x=0;x<W;x++){let s=0;for(let y=-rad;y<=rad;y++)s+=tmp[Math.min(H-1,Math.max(0,y))*W+x];
      for(let y=0;y<H;y++){out[y*W+x]=s/k;s+=tmp[Math.min(H-1,y+rad+1)*W+x]-tmp[Math.max(0,y-rad)*W+x];}}
    return out;
  }
  function makeOutline(src){
    if(outlineCache[src]) return Promise.resolve(outlineCache[src]);
    return new Promise(res=>{
      const im=new Image();
      im.onload=()=>{ try{
        const W=Math.min(1400,im.naturalWidth), H=Math.round(im.naturalHeight*W/im.naturalWidth);
        const c=document.createElement("canvas"); c.width=W; c.height=H; const x=c.getContext("2d");
        x.drawImage(im,0,0,W,H); const d=x.getImageData(0,0,W,H), p=d.data, n=W*H;
        const g=new Float32Array(n), inv=new Float32Array(n);
        for(let i=0;i<n;i++){ g[i]=.299*p[i*4]+.587*p[i*4+1]+.114*p[i*4+2]; inv[i]=255-g[i]; }
        const b=boxBlur(boxBlur(inv,W,H,2),W,H,2);   /* smaller radius = thinner lines */
        for(let i=0;i<n;i++){ let v=Math.min(255, g[i]*255/Math.max(1,255-b[i])); v=255-Math.min(200,Math.max(0,(255-v)-14)*2.2); v=v*.96+10;   /* drop faint shading, keep fine lines */
          p[i*4]=v-2; p[i*4+1]=v; p[i*4+2]=v+3; }
        x.putImageData(d,0,0); outlineCache[src]=c.toDataURL("image/jpeg",.85); res(outlineCache[src]);
      }catch(e){ res(null); } };   /* null = canvas blocked (e.g. file://), use CSS fallback */
      im.onerror=()=>res(null); im.src=src;
    });
  }
  async function setOutline(layer,w){
    if(w.outline){ layer.style.backgroundImage=`url("${w.outline}")`; layer.classList.remove("fallback"); return; }   /* your own pencil art */
    layer.style.backgroundImage=`url("${w.img}")`; layer.classList.add("fallback");
    const o=await makeOutline(w.img);
    if(o){ layer.style.backgroundImage=`url("${o}")`; layer.classList.remove("fallback"); }
  }
  function show(i){
    const w=WORLDS[i];
    $("wTitle").replaceChildren(...w.title.split(" ").map((word,n)=>{ const s=document.createElement("span"); s.textContent=word; s.style.setProperty("--i",n); return s; }));
    $("wTitle").setAttribute("aria-label",w.title);
    $("wLine").textContent=w.line;
    $("wCount").textContent=w.inspired?`Inspired by ${w.inspired}`:"";
    $("wDots").querySelectorAll("button").forEach((b,n)=>b.setAttribute("aria-current",n===i?"true":"false"));
  }
  /* canvas sizing: keeps what you've already revealed when the window resizes */
  function size(){
    const R=box.getBoundingClientRect(); dpr=Math.min(1.5,devicePixelRatio||1);
    const nw=Math.round(R.width*dpr), nh=Math.round(R.height*dpr); if(nw===W&&nh===H) return;
    const old=document.createElement("canvas"); old.width=W||1; old.height=H||1; if(W) old.getContext("2d").drawImage(mask,0,0);
    W=nw; H=nh; col.width=mask.width=W; col.height=mask.height=H;
    if(old.width>1) mctx.drawImage(old,0,0,W,H);
    dirty=true;
  }
  const brushR=()=>Math.max(W,H)*.11;
  function stamp(x,y,r,a=1){
    const g=mctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(0,0,0,${a})`); g.addColorStop(.45,`rgba(0,0,0,${a*.85})`); g.addColorStop(1,"rgba(0,0,0,0)");
    mctx.fillStyle=g; mctx.beginPath(); mctx.arc(x,y,r,0,Math.PI*2); mctx.fill(); dirty=true;
  }
  function paintTo(x,y){
    const r=brushR();
    if(last){ const dx=x-last.x, dy=y-last.y, d=Math.hypot(dx,dy), step=r*.2, n=Math.max(1,Math.ceil(d/step));
      for(let i=1;i<=n;i++) stamp(last.x+dx*i/n,last.y+dy*i/n,r,.35); }
    else stamp(x,y,r,.35);
    last={x,y};
  }
  function drawCover(im){
    if(!im.complete||!im.naturalWidth) return;
    const s=Math.max(W/im.naturalWidth,H/im.naturalHeight), w=im.naturalWidth*s, h=im.naturalHeight*s;
    dctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);
  }
  function startBloom(){ const w=WORLDS[idx]; bloom={x:w.fx*W,y:w.fy*H,t:performance.now()}; }
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  async function go(i){
    if(busy||i===idx) return; busy=true;
    const info=document.querySelector(".winfo");
    col.classList.add("drain"); info.classList.add("hide");
    await wait(reduce?0:600);                       /* color drains back to pencil */
    await setOutline(back,WORLDS[i]);
    if(reduce){ back.style.opacity=1; front.style.opacity=0; }
    else{
      /* zoom: old sketch flies past the camera while the new one grows in from behind it */
      const snap=(el,fn)=>{ el.style.transition="none"; fn(); void el.offsetWidth; el.style.transition=""; };   /* switch layers without a fade flash */
      snap(back,()=>{ back.className="wlayer wout wenter"; back.style.opacity=1; });
      front.classList.add("wleave");
      await wait(1300);
      snap(front,()=>{ front.className="wlayer wout"; front.style.opacity=0; });
      snap(back,()=>{ back.className="wlayer wout"; });
    }
    [front,back]=[back,front];
    idx=i; mctx.clearRect(0,0,W,H); last=null; dirty=true; show(i);
    col.classList.remove("drain"); info.classList.remove("hide");
    startBloom(); busy=false;                       /* color blooms into the new world */
  }
  function frame(now){
    if(!running) return;
    size();
    if(bloom){ const k=Math.min(1,(now-bloom.t)/(reduce?1:1100)); stamp(bloom.x,bloom.y,Math.max(W,H)*.34*(.15+.85*k),.12); if(k>=1) bloom=null; }
    if(dirty){
      dctx.globalCompositeOperation="source-over"; dctx.clearRect(0,0,W,H); dctx.drawImage(mask,0,0);
      dctx.globalCompositeOperation="source-in"; drawCover(imgs[idx]); dirty=false;
    }
    requestAnimationFrame(frame);
  }
  function point(e){
    const R=box.getBoundingClientRect(); paintTo((e.clientX-R.left)*dpr,(e.clientY-R.top)*dpr);
    if(!moved){ moved=true; $("wHint").classList.add("gone"); }
  }
  box.addEventListener("pointermove",point);
  box.addEventListener("pointerdown",point);
  box.addEventListener("pointerleave",()=>{ last=null; });
  const next=()=>go((idx+1)%WORLDS.length), prev=()=>go((idx-1+WORLDS.length)%WORLDS.length);
  $("wNext").addEventListener("click",next);
  $("wPrev").addEventListener("click",prev);
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
  $("wDots").innerHTML=WORLDS.map((w,i)=>`<button type="button" aria-label="${w.title}"></button>`).join("");
  $("wDots").querySelectorAll("button").forEach((b,i)=>b.addEventListener("click",()=>go(i)));
  addEventListener("keydown",e=>{ if(!running) return; if(e.key==="ArrowRight") next(); if(e.key==="ArrowLeft") prev(); });
  setOutline(front,WORLDS[0]); front.style.opacity=1; back.style.opacity=0; show(0);
  WORLDS.slice(1).forEach(w=>{ if(!w.outline) makeOutline(w.img); });   /* pre-build outlines */
  let entered=false;
  window.worldsView=(on)=>{
    if(on && !running){ running=true; size(); if(!entered){ entered=true; startBloom(); } dirty=true; requestAnimationFrame(frame); }
    if(!on) running=false;
  };
})();
