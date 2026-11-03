/* Simulación astronómica autónoma: no usa módulos ni librerías externas.
   Funciona abriendo index.html directamente desde la carpeta (file://). */
(() => {
  const $ = id => document.getElementById(id);
  const host=$('scene3d'), loading=$('sceneLoading'), modeSelect=$('modeSelect'), speedRange=$('speedRange'), orbitRange=$('orbitRange');
  const speedOutput=$('speedOutput'), orbitOutput=$('orbitOutput'), pauseButton=$('pauseButton'), resetView=$('resetView');
  const modeLabel=$('sceneModeLabel'), phaseLabel=$('phaseLabel'), explanationTitle=$('explanationTitle'), explanationText=$('explanationText');
  const brightnessLabel=$('brightnessLabel'), curve=$('lightCurve'), ctx=curve.getContext('2d');
  const canvas=document.createElement('canvas'); canvas.className='offline-star-canvas'; canvas.setAttribute('aria-label','Animación ilustrativa de estrellas');
  canvas.style.cssText='display:block;width:100%;height:100%;min-height:340px;touch-action:pan-y;'; host.replaceChildren(canvas);
  const c=canvas.getContext('2d');
  let mode='eclipsing', paused=false, t=0, speed=1, separation=3.2, rotation=0, dragging=false, lastX=0;
  const descriptions={
    eclipsing:['Binaria eclipsante','¿Qué estás viendo?','Dos estrellas orbitan un centro común. Cuando una pasa delante de la otra desde nuestro punto de vista, el brillo total disminuye temporalmente.'],
    pulsating:['Variable pulsante','La estrella respira','Una estrella cambia periódicamente de tamaño y brillo. La expansión y contracción se exageran para que puedas observarlas con claridad.'],
    binary:['Binaria orbital','Movimiento gravitacional','Las dos estrellas se desplazan alrededor de su centro de masa. En esta orientación no se produce un eclipse importante, por lo que el brillo combinado cambia poco.']
  };
  const stars=Array.from({length:190},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.25,a:Math.random()*.65+.2,tw:Math.random()*6.28}));
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));c.setTransform(d,0,0,d,0,0);drawCurve();}
  function gradient(x,y,r,color){const g=c.createRadialGradient(x-r*.2,y-r*.2,r*.05,x,y,r*1.7);g.addColorStop(0,'#fff9e8');g.addColorStop(.18,color);g.addColorStop(.55,color+'cc');g.addColorStop(1,color+'00');return g;}
  function star(x,y,r,color){c.save();c.shadowColor=color;c.shadowBlur=r*1.2;c.fillStyle=gradient(x,y,r,color);c.beginPath();c.arc(x,y,r*1.7,0,Math.PI*2);c.fill();c.shadowBlur=0;c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.restore();}
  function render(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;c.clearRect(0,0,w,h);const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#080d2b');bg.addColorStop(1,'#160e31');c.fillStyle=bg;c.fillRect(0,0,w,h);
    stars.forEach(s=>{c.globalAlpha=s.a*(.75+.25*Math.sin(t*1.4+s.tw));c.fillStyle='#dce6ff';c.beginPath();c.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);c.fill();});c.globalAlpha=1;
    const cx=w/2,cy=h*.51,scale=Math.min(w/8,h/3.8),orb=separation/2*scale,angle=t+rotation;
    if(mode!=='pulsating'){c.strokeStyle='#7685d788';c.lineWidth=1.2;c.setLineDash([4,7]);c.beginPath();c.ellipse(cx,cy,orb,orb*.48,0,0,Math.PI*2);c.stroke();c.setLineDash([]);c.fillStyle='#e9f4ff';c.beginPath();c.arc(cx,cy,2.5,0,Math.PI*2);c.fill();}
    if(mode==='pulsating'){const r=scale*(.72+.17*Math.sin(t*1.7));star(cx,cy,r,'#a99bff');c.strokeStyle='#a99bff55';c.lineWidth=2;c.beginPath();c.arc(cx,cy,r*1.45,0,Math.PI*2);c.stroke();}
    else {const x1=cx+Math.cos(angle)*orb,y1=cy+Math.sin(angle)*orb*.48;const x2=cx-Math.cos(angle)*orb,y2=cy-Math.sin(angle)*orb*.48;const r1=scale*.48,r2=scale*.34;star(x1,y1,r1,'#a99bff');star(x2,y2,r2,'#ffbf72');if(mode==='eclipsing'&&Math.abs(Math.sin(angle))<.18){c.fillStyle='#ffbf72';c.globalAlpha=.92;c.beginPath();c.arc(x1,y1,r1*.78,0,Math.PI*2);c.fill();c.globalAlpha=1;}}
    if(mode==='pulsating')brightnessLabel.textContent='Brillo relativo: '+Math.round((72+24*(.5+.5*Math.sin(t*1.7)))*10)/10+'%';else if(mode==='eclipsing'&&Math.abs(Math.sin(angle))<.18)brightnessLabel.textContent='Brillo relativo: 58%';else brightnessLabel.textContent='Brillo relativo: '+(mode==='binary'?'93%':'98%');
    phaseLabel.textContent='Fase orbital: '+Math.round((((t%(Math.PI*2))+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*360)+'°';
  }
  function drawCurve(){if(!curve||!ctx)return;const r=curve.getBoundingClientRect();if(!r.width||!r.height)return;const d=Math.min(devicePixelRatio||1,2);curve.width=Math.round(r.width*d);curve.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);const w=r.width,h=r.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#ffffff18';ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,h*i/4);ctx.lineTo(w,h*i/4);ctx.stroke();}ctx.strokeStyle='#8d8aff';ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=w;i++){const p=i/w*Math.PI*4;let b=mode==='pulsating'?.72+.24*(.5+.5*Math.sin(p*1.4)):mode==='binary'?.91+.025*Math.sin(p*2):Math.max(.38,.98-.4*Math.exp(-Math.pow(Math.sin(p/2)/.19,2))-.2*Math.exp(-Math.pow(Math.sin((p-Math.PI)/2)/.16,2)));const y=h*(.08+(1-b)*.78);i?ctx.lineTo(i,y):ctx.moveTo(i,y);}ctx.stroke();}
  function setMode(v){mode=v;const d=descriptions[v]||descriptions.eclipsing;modeLabel.textContent=d[0];explanationTitle.textContent=d[1];explanationText.textContent=d[2];drawCurve();render();}
  modeSelect.addEventListener('change',()=>setMode(modeSelect.value));speedRange.addEventListener('input',()=>{speed=+speedRange.value;speedOutput.textContent=speed.toFixed(1)+'×';});orbitRange.addEventListener('input',()=>{separation=+orbitRange.value;orbitOutput.textContent=separation.toFixed(1);});
  pauseButton.addEventListener('click',()=>{paused=!paused;pauseButton.textContent=paused?'▶ Reanudar':'Ⅱ Pausar';});resetView.addEventListener('click',()=>{rotation=0;separation=3.2;orbitRange.value='3.2';orbitOutput.textContent='3.2';});
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(dragging){rotation+=(e.clientX-lastX)*.009;lastX=e.clientX;}});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
  const menu=$('menuToggle'),nav=$('navLinks');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});if(nav)nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  function animate(){if(!paused)t+=.016*speed;render();requestAnimationFrame(animate);}window.addEventListener('resize',resize);if(loading)loading.remove();resize();setMode(mode);animate();
})();
