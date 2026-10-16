(function(){
'use strict';
var E=Estado,esc=E.esc,host=document.getElementById('app'),c=E.cuenta();
if(!c){host.innerHTML='<section><div class="shead"><span class="num">§ 1</span><h2>Ingresá a tu cuenta</h2></div><p>El panel de la familia reúne el avance de cada hijo o hija. Ingresá o creá una cuenta para verlo.</p><div class="btns"><a class="btn p" href="cuenta.html">Ingresar</a><a class="btn" href="cuenta.html#alta">Crear cuenta</a></div></section>';return}
var h=E.hijo(),p=h.prog;
function draw(){
 var sel=Selector(c);
 if(!E.cubierto(h)){
  host.innerHTML=sel+'<section><div class="shead"><span class="num">§ 1</span><h2>'+esc(h.nombre)+'</h2></div><p>'+h.edad+' años. Las lecciones para esa edad están en preparación: <b>Próximamente</b>. Cuando se publiquen, acá vas a ver el avance, el tiempo y las compras de la semana.</p><div class="btns"><a class="btn" href="materias.html">Ver las materias por edad</a></div></section>';
  Selector.bind(host,c,function(){location.reload()});return}
 var ck=p.chequeos.pendulo,sem='<span class="sema" style="border:0">sin chequeo</span>';
 if(ck)sem=ck.ok>=4?'<span class="sema g"><span class="d">✓</span>'+ck.ok+' de 5</span>':ck.ok===3?'<span class="sema y"><span class="d"></span>3 de 5</span>':'<span class="sema r"><span class="d">!</span>'+ck.ok+' de 5</span>';
 var dom=!ck?'Todavía no hay chequeos registrados.':(ck.ok>=4?'Dominó 1 de 1 lección.':'Hay 1 lección para repasar.');
 var pu=p.puerta?(p.puerta.ok?'superada con '+p.puerta.pt+' de 10':'sin superar, '+p.puerta.intentos+' de 2 intentos usados'):'sin intentar';
 var planH=165,planA=180,rH=p.minHijo,rA=p.minAdulto;
 function pc(v,t){return Math.min(100,Math.round(v/t*100))}
 var mats=[['m1','Hilo o piolín, 1,5 m'],['m2','Tuerca grande o llavero'],['m3','Cinta de enmascarar'],['m4','Regla o cinta métrica'],['m5','Cronómetro del celular']],mh='';
 mats.forEach(function(m){mh+='<div class="check"><input type="checkbox" id="c-'+m[0]+'"'+(p.mats[m[0]]?' checked':'')+'><label for="c-'+m[0]+'">'+m[1]+'</label></div>'});
 var av='';
 if(ck&&ck.ok<4)av+='<div class="alert"><b>El chequeo de El péndulo quedó en '+ck.ok+' de 5.</b> Se propone un repaso de 15 minutos y volver a intentar.<div class="btns" style="margin-top:8px"><a class="btn" href="leccion.html#b6">Ir al chequeo</a><a class="btn" href="leccion.html#b5">Ver la guía</a></div></div>';
 if(p.puerta&&!p.puerta.ok&&p.puerta.intentos>=2)av+='<div class="alert"><b>La puerta de la unidad 3 no se superó en dos intentos.</b> Se ofrece una sesión de apoyo; no se avanza por tiempo.<div class="btns" style="margin-top:8px"><a class="btn" href="unidad.html#puerta">Ver la puerta</a></div></div>';
 if(rA>240)av+='<div class="alert"><b>Esta semana le dedicaste más de 4 horas.</b> Si se repite, conviene achicar el ritmo a 2 lecciones por semana.</div>';
 if(!av)av='<p>No hay avisos esta semana.</p>';
 var gt=+p.gasto||0;
 host.innerHTML=sel+
 '<section><div class="shead"><span class="num">§ 1</span><h2>Esta semana</h2><span class="sc">'+esc(h.nombre)+' · unidad 3, semana '+p.semana+' de 5</span></div><div class="pc"><div><h3>Qué toca</h3>'+
 '<table class="tbl" style="margin-top:8px"><tr><th>Día</th><th>Lección</th><th>Chequeo</th></tr><tr><td>Lun</td><td><a href="leccion.html">El péndulo</a></td><td>'+sem+'</td></tr><tr><td>Mié</td><td>Próximamente</td><td>—</td></tr><tr><td>Vie</td><td>Próximamente</td><td>—</td></tr></table>'+
 '<p class="small" style="margin-top:8px">Domingo: mirar este panel, 2 minutos.</p></div>'+
 '<div><h3>Dominio</h3><p style="margin-top:8px">'+dom+'</p>'+
 '<p class="small" style="margin-bottom:6px"><span class="sema g"><span class="d">✓</span>4 o 5 de 5</span> se avanza.</p>'+
 '<p class="small" style="margin-bottom:6px"><span class="sema y"><span class="d"></span>3 de 5</span> repaso corto de 15 min.</p>'+
 '<p class="small" style="margin-bottom:6px"><span class="sema r"><span class="d">!</span>2 o menos</span> repasar y reintentar.</p>'+
 '<p class="small">Puerta de unidad: '+pu+'. 8 de 10 y hasta 2 intentos. <a href="unidad.html#puerta">Ver la puerta</a>.</p></div></div></section>'+
 '<section><div class="shead"><span class="num">§ 2</span><h2>Unidades</h2></div><div class="scroll" tabindex="0"><table class="tbl" style="min-width:420px"><thead><tr><th>Unidad</th><th>Estado</th></tr></thead><tbody>'+
 '<tr><td>U1 Materia y medición</td><td>Próximamente</td></tr><tr><td>U2 Fuerzas y movimiento</td><td>Próximamente</td></tr><tr><td><a href="unidad.html">U3 Energía</a></td><td><b>en curso</b>, semana '+p.semana+' de 5</td></tr><tr><td>U4 Mezclas y cambios</td><td>Próximamente</td></tr><tr><td>U5 Electricidad, baja tensión</td><td>Próximamente</td></tr><tr><td>U6 Luz y óptica</td><td>Próximamente</td></tr></tbody></table></div></section>'+
 '<section><div class="shead"><span class="num">§ 3</span><h2>Tiempo y compras</h2></div><div class="pc"><div><h3>Tiempo de la semana</h3>'+
 '<p style="margin:10px 0 0">'+esc(h.nombre)+': '+planH+' min planificados, '+rH+' reales</p><div class="meter" role="img" aria-label="Real '+rH+' de '+planH+' minutos planificados"><i style="width:'+pc(rH,planH)+'%"></i><b style="left:100%"></b></div>'+
 '<p style="margin:0">Adulto: '+planA+' min planificados, '+rA+' reales</p><div class="meter" role="img" aria-label="Real '+rA+' de '+planA+' minutos planificados"><i style="width:'+pc(rA,planA)+'%"></i><b style="left:100%"></b></div>'+
 '<form id="fmin" novalidate style="margin-top:12px"><label for="minA">Minutos que le dedicaste esta semana</label><div class="btns"><input id="minA" type="number" inputmode="numeric" min="0" max="3000" value="'+rA+'" style="max-width:140px"><button class="btn" type="submit">Guardar</button></div></form>'+
 '<p class="small">La marca bordó es lo planificado. Si el adulto pasa de 4 horas dos semanas seguidas, el panel lo avisa.</p></div>'+
 '<div><h3>Compras del viernes</h3><p class="small" style="margin:6px 0 0">Péndulo con hilo y tuerca, 5 ítems.</p>'+mh+
 '<p style="margin:10px 0 2px">Tope por experimento: USD 5. Tope del curso: USD 100.</p><p style="margin:0">Gastado hasta hoy: USD <span id="gt">'+gt+'</span></p>'+
 '<div class="meter" role="img" aria-label="'+gt+' de 100 dólares"><i style="width:'+pc(gt,100)+'%"></i></div>'+
 '<form id="fg" novalidate><label for="gm">Registrar una compra, en USD</label><div class="btns"><input id="gm" type="number" inputmode="decimal" min="0" max="100" step="0.5" style="max-width:140px"><button class="btn" type="submit">Sumar</button></div></form></div></div></section>'+
 '<section><div class="shead"><span class="num">§ 4</span><h2>Avisos</h2></div>'+av+'<p class="small">Los avisos informan y proponen algo concreto. No comparan a un chico con otros.</p></section>'+
 '<section><div class="shead"><span class="num">§ 5</span><h2>Guía y “Si se traba”</h2></div><p>Cada lección trae cinco preguntas con respuesta modelo y una lista de pasos para cuando el chico se traba. El adulto marca ✔, ◐ o ✘ en cada pregunta; no se convierte en nota.</p><div class="btns"><a class="btn" href="leccion.html#b5">Ver la guía del péndulo</a></div></section>';
 Selector.bind(host,c,function(){h=E.hijo();p=h.prog;draw()});
}
draw();
host.addEventListener('change',function(e){var t=e.target;if(t.type==='checkbox'&&t.id.indexOf('c-')===0){p.mats[t.id.slice(2)]=t.checked?1:0;E.save()}});
host.addEventListener('submit',function(e){
 e.preventDefault();
 if(e.target.id==='fmin'){var v=parseInt(document.getElementById('minA').value,10);if(isFinite(v)&&v>=0&&v<=3000){p.minAdulto=v;E.save();draw()}}
 if(e.target.id==='fg'){var g=parseFloat(String(document.getElementById('gm').value).replace(',','.'));if(isFinite(g)&&g>0){p.gasto=Math.min(100,Math.round((+p.gasto+g)*100)/100);E.save();draw()}}
});
})();
