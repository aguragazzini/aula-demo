/* Domus · maqueta. Utilidades compartidas. Sin dependencias ni red. */
(function(){
'use strict';
var dummy={addEventListener:function(){},querySelector:function(){return dummy},querySelectorAll:function(){return[]},appendChild:function(){},setAttribute:function(){},removeAttribute:function(){},style:{},classList:{toggle:function(){}},innerHTML:'',textContent:'',value:'',hidden:false,reset:function(){},focus:function(){}};
var $=function(s,r){return (r||document).querySelector(s)||dummy};
var $$=function(s,r){return Array.prototype.slice.call((r&&r.querySelectorAll?r:document).querySelectorAll(s))};
window.D={$:$,$$:$$,fmt:function(n,d){return n.toFixed(d).replace('.',',')}};

/* Ficha lateral: <a data-ficha="id"> abre dialog#ficha con window.FICHAS[id]() */
var dlg=document.getElementById('ficha');
if(dlg){
 var last=null;
 var open=function(id,btn){
  var f=window.FICHAS&&window.FICHAS[id];if(!f)return;
  last=btn;$('.in',dlg).innerHTML=f();
  if(dlg.showModal){dlg.showModal()}else{dlg.setAttribute('open','')}
  var c=$('[data-cierra]',dlg);if(c.focus)c.focus();
 };
 document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-ficha]');
  if(b){e.preventDefault();open(b.getAttribute('data-ficha'),b);return}
  var x=e.target.closest&&e.target.closest('[data-cierra]');
  if(x){dlg.close?dlg.close():dlg.removeAttribute('open')}
 });
 dlg.addEventListener('click',function(e){if(e.target===dlg&&dlg.close)dlg.close()});
 dlg.addEventListener('close',function(){if(last&&last.focus)last.focus()});
}

/* Péndulo decorativo de la portada (analítico, solo movimiento suave) */
var mini=document.getElementById('mini');
if(mini){
 var x=mini.getContext('2d'),W=0,H=0,reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,t0=performance.now();
 var L=1.2,g=9.797,A=20*Math.PI/180,T=2*Math.PI*Math.sqrt(L/g);
 function size(){var r=mini.getBoundingClientRect();if(!r.width)return;var d=window.devicePixelRatio||1;W=r.width;H=r.height;mini.width=Math.round(W*d);mini.height=Math.round(H*d);x.setTransform(d,0,0,d,0,0)}
 function frame(now){
  if(W>10){
   var t=reduce?0.4:(now-t0)/1000,th=A*Math.cos(2*Math.PI*t/T);
   x.clearRect(0,0,W,H);
   var ox=W/2,oy=34,len=Math.min(H-90,W*0.55);
   x.strokeStyle='#cfc8b8';x.lineWidth=1;for(var i=0;i<W;i+=40){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}
   x.strokeStyle='#1b1a17';x.lineWidth=1.4;x.beginPath();x.moveTo(ox-80,oy);x.lineTo(ox+80,oy);x.stroke();
   for(var k=-80;k<80;k+=10){x.beginPath();x.moveTo(ox+k,oy);x.lineTo(ox+k+8,oy-8);x.stroke()}
   x.setLineDash([3,4]);x.beginPath();x.moveTo(ox,oy);x.lineTo(ox,oy+len+24);x.stroke();
   x.beginPath();x.arc(ox,oy,len,Math.PI/2-A,Math.PI/2+A);x.stroke();x.setLineDash([]);
   var bx=ox+len*Math.sin(th),by=oy+len*Math.cos(th);
   x.beginPath();x.moveTo(ox,oy);x.lineTo(bx,by);x.stroke();
   x.fillStyle='#6e1e1e';x.beginPath();x.arc(bx,by,12,0,7);x.fill();
   x.fillStyle='#1b1a17';x.font='italic 17px EB Garamond,Georgia,serif';
   x.fillText('θ = '+(th*180/Math.PI).toFixed(1).replace('.',',')+'°',14,H-14);
  }
  if(!reduce)requestAnimationFrame(frame);else if(W>10&&!mini._once){mini._once=1}
 }
 size();window.addEventListener('resize',function(){size();if(reduce)requestAnimationFrame(frame)});requestAnimationFrame(frame);
}

/* Lista de espera: validación local, no se guarda ni se envía nada */
var wl=document.getElementById('wl');
if(wl){
 wl.addEventListener('submit',function(e){
  e.preventDefault();
  var em=$('#em'),v=em.value.trim(),err=$('#emerr'),ok=$('#wlok');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||v.length>254){err.textContent='Escribí un correo válido, con el formato nombre@dominio.com.';ok.hidden=true;em.setAttribute('aria-invalid','true');em.focus();return}
  err.textContent='';em.removeAttribute('aria-invalid');
  ok.hidden=false;ok.textContent='Listo. Anotamos tu pedido en esta pantalla. Esta maqueta no guardó ni envió el correo a ningún lado.';
  wl.reset();
 });
}
})();
