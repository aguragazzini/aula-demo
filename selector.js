/* Selector de hijo o hija, compartido por Mi aula y Familia */
(function(){
'use strict';
var E=Estado,esc=E.esc;
window.Selector=function(c){
 if(c.hijos.length<2)return'';
 var cur=E.hijo(),h='<div class="filters" role="group" aria-label="Hijo o hija" id="selhijo"><span class="sc" style="margin-right:6px">hijo o hija</span>';
 c.hijos.forEach(function(x){h+='<button type="button" data-h="'+x.id+'" aria-pressed="'+(x.id===cur.id)+'">'+esc(x.nombre)+', '+x.edad+'</button>'});
 return h+'</div>';
};
Selector.bind=function(host,c,fn){
 var s=host.querySelector('#selhijo');if(!s)return;
 s.addEventListener('click',function(e){var b=e.target.closest('[data-h]');if(!b)return;E.elegir(+b.getAttribute('data-h'));fn()});
};
})();
