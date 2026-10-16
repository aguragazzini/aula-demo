(function(){
'use strict';
var $=D.$,$$=D.$$,fmt=D.fmt;
if(!document.getElementById('cv'))return;
/* Predicción */
var pA='',pB='';
function predUpdate(){
 var parts=[];if(pA)parts.push('A: “'+pA+'”');if(pB)parts.push('B: “'+pB+'”');
 var t=parts.length?'Tu predicción — '+parts.join(' · ')+'.':'Tu predicción: aún sin elegir.';
 $('#predmsg').textContent=parts.length?'Anotado. '+parts.join(' · ')+'. Lo retomamos en la simulación y en las preguntas.':'Todavía no elegiste. Cualquier respuesta sirve: es para comparar después.';
 $('#predecho').textContent=t;$('#predecho2').textContent=t;
}
function chipGroup(attr,set){$$('['+attr+']').forEach(function(b){b.addEventListener('click',function(){
 set(b.getAttribute(attr));
 $$('['+attr+']').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});predUpdate();
});});}
chipGroup('data-pa',function(v){pA=v});chipGroup('data-pb',function(v){pB=v});

/* Simulación del péndulo (modelo propio) */
var D2R=Math.PI/180,DT=1/240;
function accel(th,w,g,L,b){return -(g/L)*Math.sin(th)-b*w}
function rk4(th,w,g,L,b,dt){
 var k1t=w,k1w=accel(th,w,g,L,b);
 var k2t=w+dt/2*k1w,k2w=accel(th+dt/2*k1t,w+dt/2*k1w,g,L,b);
 var k3t=w+dt/2*k2w,k3w=accel(th+dt/2*k2t,w+dt/2*k2w,g,L,b);
 var k4t=w+dt*k3w,k4w=accel(th+dt*k3t,w+dt*k3w,g,L,b);
 return[th+dt/6*(k1t+2*k2t+2*k3t+k4t),w+dt/6*(k1w+2*k2w+2*k3w+k4w)];
}

var cv=$('#cv'),ctx=cv.getContext('2d');
var eL=$('#L'),eM=$('#M'),eA=$('#A'),eG=$('#G'),eGn=$('#gnum'),eB=$('#B'),ro=$('#ro');
var W=300,H=360,dpr=1;
var S={th:10*D2R,w:0,mode:'ready',t:0,last:null,Tm:null,chr:null,chrRes:null,drag:false,acc:0,sign:1};
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function gval(){
 if(eG.value==='manual'){var g=parseFloat(String(eGn.value).replace(',','.'));if(!isFinite(g))g=9.797;return Math.max(1,Math.min(25,g))}
 return parseFloat(eG.value)}
function par(){return{L:+eL.value,m:+eM.value,a:+eA.value,g:gval(),b:+eB.value}}
function fmt2(n,d){return n.toFixed(d).replace('.',',')}
function ppm(){return (H-24-34)/2.0}
function bobPos(){var p=par(),Lp=p.L*ppm();return{x:W/2+Lp*Math.sin(S.th),y:24+Lp*Math.cos(S.th),r:11+13*Math.sqrt(p.m)}}
function resize(){
 var r=cv.getBoundingClientRect();if(!r.width||!r.height)return;W=r.width;H=r.height;
 dpr=window.devicePixelRatio||1;
 cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}
function resetSim(){S.th=S.sign*par().a*D2R;S.w=0;S.mode='ready';S.t=0;S.last=null;S.Tm=null;S.chr=null;S.chrRes=null;$('#pause').textContent='Pausa';draw();readout()}
function release(){S.mode='run';S.w=0;S.last=null}
function step(){
 var p=par(),tp=S.th,r=rk4(S.th,S.w,p.g,p.L,p.b,DT);
 S.th=r[0];S.w=r[1];S.t+=DT;
 if(tp<0&&S.th>=0){
  var tc=S.t-DT+DT*(-tp)/(S.th-tp);
  if(S.last!==null)S.Tm=tc-S.last;S.last=tc;
  if(S.chr){
   if(S.chr.start===null){S.chr.start=tc;S.chr.n=0}
   else{S.chr.n++;if(S.chr.n>=10){S.chrRes=tc-S.chr.start;S.chr=null}}
  }
 }
}
function draw(){
 if(W<20||H<20)return;
 var p=par(),px=W/2,py=24,b=bobPos(),Lp=p.L*ppm();
 ctx.clearRect(0,0,W,H);ctx.fillStyle='#fbf9f3';ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#8a8372';ctx.lineWidth=1.5;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py+Lp+30);ctx.stroke();ctx.setLineDash([]);
 // arco del ángulo
 var ang=S.th,ar=Math.min(46,Lp*0.5);
 ctx.strokeStyle='#6e1e1e';ctx.lineWidth=2;ctx.beginPath();
 ctx.arc(px,py,ar,Math.PI/2,Math.PI/2-ang,ang>0);ctx.stroke();
 // hilo
 ctx.strokeStyle='#1b1a17';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(b.x,b.y);ctx.stroke();
 // soporte
 ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(px-W*0.3,py-4);ctx.lineTo(px+W*0.3,py-4);ctx.stroke();
 // pesa
 ctx.fillStyle='#f6f3ea';ctx.strokeStyle='#6e1e1e';ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.fill();ctx.stroke();
 if(S.mode==='ready'||S.drag){ctx.fillStyle='#1b1a17';ctx.font='15px system-ui,sans-serif';ctx.textAlign='center';
  ctx.fillText('arrastrame',b.x,Math.min(H-8,b.y+b.r+20))}
 ctx.fillStyle='#1b1a17';ctx.font='16px system-ui,sans-serif';ctx.textAlign='left';
 ctx.fillText('ángulo: '+Math.round(Math.abs(S.th)/D2R)+'°',10,H-10);
 ctx.textAlign='right';ctx.fillText('t = '+fmt2(S.t,1)+' s',W-10,H-10);
}
var ro_n=0;
function readout(){
 var p=par(),T0=2*Math.PI*Math.sqrt(p.L/p.g);
 var txt='Período de la regla: '+fmt2(T0,3)+' s · ';
 if(S.Tm!==null){var e=(S.Tm-T0)/T0*100;txt+='medido: '+fmt2(S.Tm,3)+' s · error de la regla: '+fmt2(e,2)+' %'}
 else txt+='medido: — (soltá el péndulo y esperá dos pasos por el centro)';
 if(S.chrRes!==null)txt+=' · 10 oscilaciones: '+fmt2(S.chrRes,2)+' s → '+fmt2(S.chrRes/10,3)+' s cada una';
 else if(S.chr)txt+=' · cronómetro en marcha…';
 ro.textContent=txt;
 $('#warn').hidden=!(p.a>20);
}
function energy(){
 var p=par(),Ec=0.5*p.m*p.L*p.L*S.w*S.w,Ep=p.m*p.g*p.L*(1-Math.cos(S.th)),sc=p.m*p.g*p.L*(1-Math.cos(60*D2R));
 function pc(x){return Math.max(0,Math.min(100,x/sc*100))+'%'}
 $('#bec').style.width=pc(Ec);$('#bep').style.width=pc(Ep);$('#bet').style.width=pc(Ec+Ep);
 $('#ec').textContent=fmt2(Ec,3)+' J';$('#ep').textContent=fmt2(Ep,3)+' J';$('#et').textContent=fmt2(Ec+Ep,3)+' J';
}
function frame(ts){
 if(S.prevTs==null)S.prevTs=ts;
 var dt=Math.min(0.05,(ts-S.prevTs)/1000);S.prevTs=ts;
 if(S.mode==='run'){
  if(reduce){for(var i=0;i<4;i++)step()}
  else{S.acc+=dt;var n=0;while(S.acc>=DT&&n<24){step();S.acc-=DT;n++}if(n>=24)S.acc=0}
 }
 draw();energy();
 if((++ro_n%6)===0)readout();
 requestAnimationFrame(frame);
}
/* arrastre táctil / mouse */
function pos(e){var r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
cv.addEventListener('pointerdown',function(e){
 var b=bobPos(),p=pos(e),hit=Math.max(b.r+26,34);
 if(Math.hypot(p.x-b.x,p.y-b.y)<=hit){
  S.drag=true;S.mode='ready';S.w=0;S.Tm=null;S.last=null;S.chr=null;S.chrRes=null;S.t=0;
  try{cv.setPointerCapture(e.pointerId)}catch(_){}
  e.preventDefault();
 }
});
cv.addEventListener('pointermove',function(e){
 if(!S.drag)return;
 var p=pos(e),dx=p.x-W/2,dy=Math.max(4,p.y-24),th=Math.atan2(dx,dy);
 var a=Math.abs(th)/D2R;a=Math.max(5,Math.min(60,a));
 S.sign=th<0?-1:1;S.th=S.sign*a*D2R;eA.value=Math.round(a);readout();
});
function endDrag(){if(!S.drag)return;S.drag=false;release()}
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
$('#go').addEventListener('click',function(){if(S.mode==='ready')release();else if(S.mode==='paused')S.mode='run'});
$('#pause').addEventListener('click',function(){
 if(S.mode==='run'){S.mode='paused';this.textContent='Seguir'}
 else if(S.mode==='paused'){S.mode='run';this.textContent='Pausa'}
});
$('#rst').addEventListener('click',resetSim);
$('#chrono').addEventListener('click',function(){
 S.chrRes=null;S.chr={start:null,n:0};if(S.mode==='ready')release();if(S.mode==='paused'){S.mode='run';$('#pause').textContent='Pausa'}readout();
});
eA.addEventListener('input',resetSim);
[eL,eM,eB].forEach(function(el){el.addEventListener('input',function(){S.Tm=null;S.last=null;S.chrRes=null;S.chr=null;if(S.mode==='ready'){draw()}readout()})});
eG.addEventListener('change',function(){$('#gman').hidden=eG.value!=='manual';S.Tm=null;S.last=null;readout()});
eGn.addEventListener('input',function(){S.Tm=null;S.last=null;readout()});
$$('[data-st]').forEach(function(b){b.addEventListener('click',function(){
 var s=b.getAttribute('data-st').split(':'),el=$('#'+s[0]);
 var v=Math.max(+el.min,Math.min(+el.max,Math.round((+el.value+ +s[1])*100)/100));
 el.value=v;el.dispatchEvent(new Event('input'));
});});
window.addEventListener('resize',resize);
resize();resetSim();requestAnimationFrame(frame);

})();
