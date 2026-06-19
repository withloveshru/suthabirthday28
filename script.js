(() => {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const gift = document.getElementById('gift');
  const lid = gift.querySelector('.lid');
  const box = gift.querySelector('.box');
  const polaroids = document.getElementById('polaroids');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const showLetter = document.getElementById('show-letter');
  const letterModal = document.getElementById('letterModal');
  const closeLetter = document.getElementById('close-letter');
  const replay = document.getElementById('replay');

  const photos = [
    {emoji:'📸', caption:'Beach day', msg:'Remember that sunny picnic?'},
    {emoji:'🎂', caption:'Cake time', msg:'Candles and wishes.'},
    {emoji:'🌸', caption:'Blossoms', msg:'A pretty walk together.'},
    {emoji:'🎶', caption:'Song', msg:'That silly song we sang.'}
  ];

  function showPage(n){
    page1.classList.toggle('active', n===1);
    page2.classList.toggle('active', n===2);
  }

  function openGift(){
    lid.classList.add('open');
    box.classList.add('pop');
    setTimeout(()=>{
      showConfetti();
      populatePolaroids();
      showPage(2);
    },600);
  }

  gift.addEventListener('click', openGift);
  gift.addEventListener('keyup', (e)=>{ if(e.key==='Enter') openGift(); });

  function populatePolaroids(){
    polaroids.innerHTML='';
    const w = polaroids.clientWidth;
    const h = polaroids.clientHeight;
    photos.forEach((p,i)=>{
      const el = document.createElement('div');
      el.className='polaroid floating';
      el.style.left = (10 + Math.random()*(w-160)) + 'px';
      el.style.top = (10 + Math.random()*(h-180)) + 'px';
      el.style.transform = `rotate(${Math.round(-12+Math.random()*24)}deg)`;
      el.style.animationDelay = (Math.random()*2)+'s';
      el.innerHTML = `<div class="photo">${p.emoji}</div><div class="caption">${p.caption}</div>`;
      el.dataset.msg = p.msg;
      el.addEventListener('click', ()=>{ alert(p.msg); });
      polaroids.appendChild(el);
    });
  }

  // confetti simple
  function showConfetti(){
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight;
    const pieces = [];
    const colors = ['#ffd6ea','#ffb6dc','#ffd89b','#a78bfa','#ff9ccf'];
    for(let i=0;i<120;i++){
      pieces.push({x:Math.random()*innerWidth,y:Math.random()*-innerHeight*2,r:Math.random()*6+4,dx:(Math.random()-.5)*2,dy:Math.random()*4+2,c:colors[Math.floor(Math.random()*colors.length)],rot:Math.random()*360,dr:(Math.random()-.5)*6});
    }
    let t=0;
    function frame(){
      t++; ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      pieces.forEach(p=>{
        p.x += p.dx; p.y += p.dy; p.rot += p.dr;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6);
        ctx.restore();
      });
      if(t<240) requestAnimationFrame(frame); else ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    }
    frame();
  }

  // sparkles following pointer
  let sparkleTimeout;
  function spawnSparkle(x,y){
    const s = document.createElement('div'); s.className='sparkle';
    s.style.left = (x-6)+'px'; s.style.top=(y-6)+'px';
    s.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(255,255,255,0) 60%), ${['#ffd6ea','#ffb6dc','#ffd89b'][Math.floor(Math.random()*3)]}`;
    s.style.opacity = '0.95'; s.style.transform = `scale(${(Math.random()*0.9)+0.6})`;
    document.body.appendChild(s);
    setTimeout(()=>{ s.style.transition='transform .7s ease,opacity .7s ease'; s.style.transform='scale(2)'; s.style.opacity='0'; },20);
    setTimeout(()=>s.remove(),900);
  }
  window.addEventListener('pointermove', (e)=>{ spawnSparkle(e.clientX,e.clientY); clearTimeout(sparkleTimeout); sparkleTimeout=setTimeout(()=>{},200); });

  showLetter.addEventListener('click', ()=>{ letterModal.classList.remove('hidden'); });
  closeLetter.addEventListener('click', ()=>{ letterModal.classList.add('hidden'); });

  replay.addEventListener('click', ()=>{
    // reset
    lid.classList.remove('open'); box.classList.remove('pop');
    showPage(1);
    polaroids.innerHTML='';
  });

  // on load, make a gentle intro
  window.addEventListener('load', ()=>{
    // nothing extra for now
  });

})();
