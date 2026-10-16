(function(){
'use strict';
var $=D.$,$$=D.$$,fmt=D.fmt;
/* Preguntas */
var QS=[
 ['Predicción vs. resultado','¿Qué pensabas que iba a pasar con la tuerca más pesada y qué pasó?','La tuerca pesada no fue ni más rápida ni más lenta: en la regla T = 2π√(L/g) la masa no aparece. Con más masa la gravedad tira más fuerte, pero también cuesta más moverla, y se compensan (para 10–13 alcanza con “se compensan”).','Entendió: dice que lo probó y no cambió.','Repasar: sigue creyendo que cambia → repetir el extra del experimento con dos tuercas.'],
 ['Explicación propia','Explicámelo como si yo tuviera 6 años: ¿de qué depende cuánto tarda el vaivén?','Cuanto más largo el hilo, más despacio va y viene. El peso no cambia nada.','Entendió: nombra el largo y dice que la masa no influye.','Repasar: dice “del peso” o no distingue largo de ángulo.'],
 ['Variación','Si el hilo mide 25 cm y lo cambiás por uno de 1 m, ¿cuánto tarda ahora una oscilación?','El largo se multiplicó por 4, así que el período se multiplica por √4 = 2: de ~1,0 s a ~2,0 s.','Entendió: dice “el doble” y lo relaciona con cuadruplicar.','◐ si dice “cuatro veces”. Repasar la tabla de referencia del experimento.'],
 ['Límite','¿Cuándo deja de servir la regla del período?','Cuando el ángulo es grande: a 60° el período real es un 7 % mayor que el de la regla; hasta unos 20° el error es menor al 1 %.','Entendió: nombra el ángulo grande como límite.','Repasar: cree que la regla siempre es exacta; probar 10° y 60° en la simulación, en el próximo rato de pantalla.'],
 ['Conexión','Se quiere un péndulo que tarde exactamente 2 s en ir y volver. ¿Cuánto debe medir el hilo?','L = g·T²/(4π²) = 9,8 × 4 / 39,48 ≈ 0,99 m, casi 1 metro. Se puede comprobar con el hilo (y después, con la simulación).','Entendió: llega a ≈1 m probando con la sim aunque no use la fórmula.','◐ usa la fórmula con ayuda. Repasar: volver a la pregunta 3.']
];
var qd=$('#qs');
QS.forEach(function(q,i){
 var d=document.createElement('div');d.className='q';
 d.innerHTML='<p style="margin:0"><b>'+(i+1)+'. '+q[0]+'</b></p><p style="margin:4px 0">“'+q[1]+'”</p>'+
 '<details><summary>Respuesta modelo y señales</summary><p style="padding-top:6px">'+q[2]+'</p><p class="small" style="color:var(--ink)">✔ '+q[3]+'<br>↻ '+q[4]+'</p></details>'+
 '<div class="mark" role="group" aria-label="Marcar pregunta '+(i+1)+'"><button class="chip" aria-pressed="false">✔ Claro</button><button class="chip" aria-pressed="false">◐ A medias</button><button class="chip" aria-pressed="false">✘ Volver</button></div>';
 qd.appendChild(d);
});
qd.addEventListener('click',function(e){
 var b=e.target.closest('.chip');if(!b)return;
 $$('.chip',b.parentNode).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
});

/* Chequeo */
var QZ=[
 {q:'El período de un péndulo con ángulo chico depende…',o:['de la masa','del largo del hilo','de la masa y del largo por igual'],a:1,e:'En T = 2π√(L/g) aparece el largo, no la masa. Si dudás, probalo en la simulación cambiando una sola cosa por vez.'},
 {q:'Si el largo del hilo se cuadruplica, el período…',o:['se duplica','se cuadruplica','queda igual'],a:0,e:'El largo está dentro de una raíz: √4 = 2. Para duplicar el período hay que cuadruplicar el largo.'},
 {q:'Con un hilo de 50 cm, 10 oscilaciones tardan aproximadamente…',o:['7 s','14 s','20 s'],a:1,e:'Con L = 0,50 m el período es ≈ 1,42 s; 10 oscilaciones son ≈ 14,2 s.'},
 {q:'¿Por qué se cronometran 10 oscilaciones y no una sola?',o:['Porque el error de apretar el cronómetro se reparte entre las 10','Porque así el péndulo va más lento','Porque una oscilación no se puede medir'],a:0,e:'Apretar el botón siempre tiene un pequeño retraso. Repartido entre 10 oscilaciones, pesa 10 veces menos en cada una.'},
 {q:'Dos péndulos con el mismo hilo y ángulo chico: uno con una tuerca de 50 g y otro con una de 200 g. ¿Cuál tarda menos en una oscilación?',o:['El de 50 g','El de 200 g','Tardan igual'],a:2,e:'La masa no aparece en la regla del período. Se puede comprobar con la simulación o con una y dos tuercas atadas.'}
];
var REV=[
 {q:'¿Qué mide la densidad?',o:['Cuánta masa hay por cada unidad de volumen','Cuánto pesa un objeto','El tamaño de un objeto'],a:0,e:'Es masa dividida por volumen. Por eso un objeto grande puede ser poco denso.'},
 {q:'¿Qué instrumento sirve para medir el volumen de un líquido?',o:['Balanza','Probeta o vaso medidor','Regla'],a:1,e:'La probeta tiene marcas de volumen. La balanza mide masa.'},
 {q:'Un objeto tiene una densidad de 0,5 g/cm³. En agua (1 g/cm³)…',o:['flota','se hunde','queda en el fondo'],a:0,e:'Es menos denso que el agua, así que flota.'}
];
function build(list,host){
 host.innerHTML='';
 list.forEach(function(it,i){
  var d=document.createElement('div');d.className='q';d.setAttribute('data-i',i);
  var h='<p style="margin:0 0 6px"><b>'+(i+1)+'.</b> '+it.q+'</p><div role="radiogroup" aria-label="Ítem '+(i+1)+'">';
  it.o.forEach(function(o,j){h+='<button type="button" class="chip opt" role="radio" aria-checked="false" data-j="'+j+'">'+o+'</button>'});
  h+='</div><div class="fb-host"></div>';d.innerHTML=h;host.appendChild(d);
 });
}
function pick(host){host.addEventListener('click',function(e){
 var b=e.target.closest('.opt');if(!b)return;
 $$('.opt',b.parentNode).forEach(function(x){x.setAttribute('aria-checked',x===b?'true':'false');x.setAttribute('aria-pressed',x===b?'true':'false')});
});}
build(QZ,$('#quiz'));build(REV,$('#rev'));pick($('#quiz'));pick($('#rev'));
function grade(list,host){
 var ok=0,none=0;
 $$('.q',host).forEach(function(d,i){
  var sel=$$('.opt',d).filter(function(x){return x.getAttribute('aria-checked')==='true'})[0];
  var fb=$('.fb-host',d);
  if(!sel){none++;fb.innerHTML='<div class="fb bad">Falta responder esta pregunta.</div>';return}
  var good=+sel.getAttribute('data-j')===list[i].a;
  if(good)ok++;
  fb.innerHTML='<div class="fb'+(good?'':' bad')+'"><b>'+(good?'✔ Bien. ':'✘ Pensemos juntos. ')+'</b>'+list[i].e+'</div>';
 });
 return{ok:ok,none:none};
}
$('#grade').addEventListener('click',function(){
 var r=grade(QZ,$('#quiz')),res=$('#res');
 if(r.none){res.innerHTML='<div class="notice">Respondé los '+QZ.length+' ítems para corregir. Faltan '+r.none+'.</div>';return}
 if(window.Estado)Estado.chequeo('pendulo',r.ok);
 if(r.ok>=4)res.innerHTML='<div class="notice"><span class="sema g"><span class="d">✓</span> '+r.ok+' de 5: lección dominada.</span><br>Podés pasar a la siguiente. Si hubo un error, mirá la explicación de ese ítem.</div>';
 else if(r.ok===3)res.innerHTML='<div class="notice"><span class="sema y"><span class="d"></span> 3 de 5: casi.</span><br>Hacé un repaso corto de 15 min con otro caso (repetir una medición con una sola cosa distinta) y reintentá.</div>';
 else res.innerHTML='<div class="notice" style="border-color:var(--acc)"><span class="sema r"><span class="d">!</span> '+r.ok+' de 5: conviene volver a la lección.</span><br>Es normal y no es un fracaso. Releé el texto, repetí el experimento cambiando una sola cosa y mirá “Si se traba”. Después reintentá. Si después de 2 intentos no avanza, se pide apoyo desde el panel.</div>';
});
$('#resetq').addEventListener('click',function(){build(QZ,$('#quiz'));$('#res').innerHTML=''});
$('#rev').addEventListener('click',function(e){if(e.target.closest('.opt'))grade(REV,$('#rev'))});

/* Puerta de unidad (10 ítems, 8/10, máx. 2 intentos) */
var GT=QZ.concat([
 {q:'Se quiere un péndulo que tarde 2 s por oscilación (g = 9,8 m/s²). El hilo debe medir aproximadamente…',o:['0,5 m','1 m','2 m'],a:1,e:'L = g·T²/(4π²) ≈ 0,99 m, casi 1 metro.'},
 {q:'Se suelta el péndulo desde 60° en vez de 10°. El período real es…',o:['igual al de la regla','un poco mayor que el de la regla (≈ 7 %)','mucho menor'],a:1,e:'A ángulos grandes la regla deja de ser exacta; a 60° el período real es ≈ 7 % mayor.'},
 {q:'El mismo péndulo, en la Luna (gravedad menor) que en la Tierra, oscila…',o:['más rápido','igual','más lento'],a:2,e:'En T = 2π√(L/g), una g menor da un T mayor.'},
 {q:'Sin rozamiento, la energía total del péndulo…',o:['se mantiene constante','crece con el tiempo','se pierde de a poco'],a:0,e:'Sin rozamiento, la energía solo pasa de altura a movimiento y viceversa; el total no cambia.'},
 {q:'¿En qué punto la energía de movimiento es la mayor?',o:['En los extremos','En el punto más bajo','Es igual en todos'],a:1,e:'En el punto más bajo la pesa va más rápido: ahí casi toda la energía es de movimiento.'}
]);
var P0=window.Estado&&Estado.progreso(),gAtt=P0&&P0.puerta?P0.puerta.intentos:0,gDone=P0&&P0.puerta?(P0.puerta.ok||P0.puerta.intentos>=2):false;
function gStat(){$('#gstat').textContent='Intentos usados: '+gAtt+' de 2. Umbral: 8 de 10.'}
function gBuild(){build(GT,$('#gate'));gStat()}
gBuild();pick($('#gate'));
$('#gradeG').addEventListener('click',function(){
 var res=$('#resG');
 if(gDone){res.innerHTML='<div class="notice">Esta puerta ya está cerrada para este hijo o hija. Si necesitás una sesión de apoyo, se pide desde el panel de la familia.</div>';return}
 var r=grade(GT,$('#gate'));
 if(r.none){res.innerHTML='<div class="notice">Respondé los 10 ítems. Faltan '+r.none+'.</div>';return}
 gAtt++;gStat();if(window.Estado)Estado.puerta(gAtt,r.ok>=8,r.ok);
 if(r.ok>=8){gDone=true;res.innerHTML='<div class="notice"><span class="sema g"><span class="d">✓</span> '+r.ok+' de 10: puerta superada.</span><br>La unidad se cierra. Seguí con la siguiente cuando quieras.</div>'}
 else if(gAtt<2){res.innerHTML='<div class="notice"><span class="sema '+(r.ok>=6?'y':'r')+'"><span class="d">'+(r.ok>=6?'':'!')+'</span> '+r.ok+' de 10: todavía no. Te queda 1 intento.</span><br>Repasá las lecciones con semáforo amarillo o rojo antes de reintentar. Nada se pierde por intentar.</div>'}
 else{gDone=true;res.innerHTML='<div class="notice" style="border-color:var(--acc)"><span class="sema r"><span class="d">!</span> '+r.ok+' de 10: usaste los 2 intentos.</span><br>Se le avisa al adulto y se ofrece una sesión de apoyo. No se avanza por tiempo.</div>'}
});
if(gDone&&P0&&P0.puerta){$('#resG').innerHTML=P0.puerta.ok?'<div class="notice"><span class="sema g"><span class="d">✓</span> '+P0.puerta.pt+' de 10: puerta superada.</span></div>':'<div class="notice" style="border-color:var(--acc)"><span class="sema r"><span class="d">!</span> '+P0.puerta.pt+' de 10: usaste los 2 intentos.</span><br>Se ofrece una sesión de apoyo.</div>'}

})();
