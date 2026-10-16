/* Domus · estado de la cuenta (guardado en este navegador). Sin red. */
(function(){
'use strict';
var K='domus.v1',mem=null;
var PLANES={
 libre:{n:'Libre',p:'USD 0',d:'Una lección completa con su guía de preguntas. Un hijo o hija.'},
 familia:{n:'Familia',p:'USD 8 por mes',d:'Todas las lecciones publicadas, panel del adulto, listas de compras y carpeta de evidencias. Hasta 4 hijos.'},
 anual:{n:'Familia anual',p:'USD 80 por año',d:'Lo mismo que Familia, con pago anual. Hasta 4 hijos.'}
};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function hash(p){try{return btoa(unescape(encodeURIComponent('d1:'+p)))}catch(e){return p}}
function nuevoProg(){return{unidad:3,semana:1,chequeos:{},puerta:null,minHijo:0,minAdulto:0,gasto:0,mats:{}}}
function seed(){
 var p=nuevoProg();p.chequeos.pendulo={ok:4,fecha:'2026-10-12'};p.minHijo=52;p.minAdulto=60;p.mats={m1:1,m2:1,m3:1,m4:1,m5:1};
 return{sesion:'ricardo.arroyo@correo.com',cuentas:{'ricardo.arroyo@correo.com':{
  nombre:'Ricardo Arroyo',pw:hash('domus2026'),plan:'familia',alta:'2026-09-28',
  hijos:[{id:1,nombre:'Tomás',edad:11,prog:p},{id:2,nombre:'Lucía',edad:7,prog:nuevoProg()}],hijo:1}}};
}
function load(){
 try{var s=JSON.parse(localStorage.getItem(K));if(s&&s.cuentas)return s}catch(e){}
 return seed();
}
var S=load();
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
save();
var E={
 S:S,esc:esc,PLANES:PLANES,save:save,hash:hash,
 cuenta:function(){return S.sesion&&S.cuentas[S.sesion]||null},
 hijo:function(){var c=E.cuenta();if(!c||!c.hijos.length)return null;
  for(var i=0;i<c.hijos.length;i++)if(c.hijos[i].id===c.hijo)return c.hijos[i];return c.hijos[0]},
 elegir:function(id){var c=E.cuenta();if(c){c.hijo=id;save()}},
 progreso:function(){var h=E.hijo();return h?h.prog:null},
 cubierto:function(h){return !!h&&h.edad>=10&&h.edad<=13},
 chequeo:function(id,ok){var p=E.progreso();if(!p)return;p.chequeos[id]={ok:ok,fecha:hoy()};save()},
 puerta:function(i,ok,pt){var p=E.progreso();if(!p)return;p.puerta={intentos:i,ok:ok,pt:pt};save()},
 crear:function(d){
  var k=d.correo.toLowerCase();if(S.cuentas[k])return'Ya hay una cuenta con ese correo. Ingresá desde la pestaña “Ingresar”.';
  S.cuentas[k]={nombre:d.nombre,pw:hash(d.pw),plan:d.plan,alta:hoy(),hijos:[{id:1,nombre:d.hijo,edad:d.edad,prog:nuevoProg()}],hijo:1};
  S.sesion=k;save();return''},
 entrar:function(correo,pw){var c=S.cuentas[correo.toLowerCase()];
  if(!c)return'No encontramos una cuenta con ese correo. Podés crearla desde “Crear cuenta”.';
  if(c.pw!==hash(pw))return'La contraseña no coincide.';
  S.sesion=correo.toLowerCase();save();return''},
 salir:function(){S.sesion=null;save()},
 eliminar:function(){if(S.sesion){delete S.cuentas[S.sesion];S.sesion=null;save()}}
};
function hoy(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
window.Estado=E;
var q=document.getElementById('quien');
if(q){var c=E.cuenta();q.textContent=c?c.nombre.split(' ')[0]:'Ingresar';q.setAttribute('aria-label',c?'Cuenta de '+c.nombre:'Ingresar a tu cuenta')}
})();
