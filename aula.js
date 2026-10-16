(function(){
'use strict';
var E=Estado,esc=E.esc,host=document.getElementById('app');
var c=E.cuenta();
function gate(){host.innerHTML='<section><div class="shead"><span class="num">§ 1</span><h2>Ingresá a tu cuenta</h2></div><p>Mi aula reúne la semana de cada hijo o hija. Ingresá o creá una cuenta para verla.</p><div class="btns"><a class="btn p" href="cuenta.html">Ingresar</a><a class="btn" href="cuenta.html#alta">Crear cuenta</a></div></section>'}
if(!c){gate();return}
var h=E.hijo(),p=h.prog,h1='';
var sel=window.Selector?Selector(c,function(){location.reload()}):'';
if(!E.cubierto(h)){
 host.innerHTML=sel+'<section><div class="shead"><span class="num">§ 1</span><h2>Esta semana</h2></div><p><b>'+esc(h.nombre)+'</b>, '+h.edad+' años. Las lecciones para esa edad están en preparación: <b>Próximamente</b>. Mientras tanto, mirá <a href="materias.html">qué materias hay para cada franja</a>.</p></section>';
 Selector.bind(host,c,function(){location.reload()});return;
}
var ok=p.chequeos.pendulo,l1=ok?'hecha · chequeo '+ok.ok+' de 5':'siguiente · 45 a 60 min';
var mats=[['m1','Hilo o piolín, 1,5 m'],['m2','Una tuerca grande o un llavero (mejor dos iguales)'],['m3','Cinta de enmascarar'],['m4','Regla o cinta métrica'],['m5','Cronómetro del celular']];
var mh='';mats.forEach(function(m){mh+='<div class="check"><input type="checkbox" id="'+m[0]+'"'+(p.mats[m[0]]?' checked':'')+'><label for="'+m[0]+'">'+m[1]+'</label></div>'});
host.innerHTML=sel+'<section><div class="shead"><span class="num">§ 1</span><h2>Esta semana</h2><span class="sc">'+esc(h.nombre)+' · unidad 3, semana '+p.semana+' de 5</span></div>'+
'<div class="cards c3">'+
'<a class="card" href="leccion.html"><span class="sc">lunes</span><h3>El péndulo: de qué depende el vaivén</h3><p class="meta">'+l1+'</p>'+(ok?'':'<p><span class="btn p" style="margin-top:6px">Empezar</span></p>')+'</a>'+
'<div class="card"><span class="sc">miércoles</span><h3>Próximamente</h3><p class="meta">Se habilita cuando se publique.</p></div>'+
'<div class="card"><span class="sc">viernes</span><h3>Próximamente</h3><p class="meta">Se habilita cuando se publique.</p></div></div></section>'+
'<section><div class="shead"><span class="num">§ 2</span><h2>Antes de empezar el péndulo</h2></div><div class="cols2"><div><p class="small">Para el experimento del bloque 2. Cinco ítems. Lo que tildes queda guardado.</p></div><div>'+mh+'</div></div></section>'+
'<section><div class="shead"><span class="num">§ 3</span><h2>Más adelante</h2></div><ol class="toc"><li><a href="unidad.html">Unidad 3: Energía, con la puerta de unidad<span>semana 5</span></a></li><li><a href="materia.html">Programa de Física<span>unidades 2, 3, 5 y 6</span></a></li></ol></section>';
Selector.bind(host,c,function(){location.reload()});
host.addEventListener('change',function(e){var t=e.target;if(t.type==='checkbox'&&t.id){p.mats[t.id]=t.checked?1:0;E.save()}});
})();
