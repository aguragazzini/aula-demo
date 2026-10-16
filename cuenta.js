(function(){
'use strict';
var E=Estado,esc=E.esc,host=document.getElementById('app');
var MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function planCards(sel){var h='<div class="cards c3">';Object.keys(E.PLANES).forEach(function(k){var p=E.PLANES[k];h+='<div class="card"><h3>'+p.n+'</h3><p style="font-family:var(--serif);font-size:24px;color:var(--ink)">'+p.p+'</p><p>'+p.d+'</p>'+(sel===k?'<p><span class="tag">Tu plan</span></p>':'')+'</div>'});return h+'</div>'}
function edades(sel){var o='';for(var i=4;i<=16;i++)o+='<option value="'+i+'"'+(sel===i?' selected':'')+'>'+i+' años</option>';return o}
function planOpts(sel){var o='';Object.keys(E.PLANES).forEach(function(k){o+='<option value="'+k+'"'+(sel===k?' selected':'')+'>'+E.PLANES[k].n+' · '+E.PLANES[k].p+'</option>'});return o}
var TERM='<section id="terminos"><div class="shead"><span class="num">§ 4</span><h2>Términos</h2></div><p>Domus es un complemento de estudio en casa. <b>Domus no otorga títulos con validez oficial.</b> Las familias siguen siendo responsables de la inscripción y la acreditación de sus hijos ante la autoridad educativa que corresponda.</p></section>';
function anon(modo){
 host.innerHTML='<section id="alta"><div class="shead"><span class="num">§ 1</span><h2>Tu cuenta</h2></div>'+
 '<div class="filters" role="group" aria-label="Acceso"><button type="button" data-m="alta" aria-pressed="'+(modo==='alta')+'">Crear cuenta</button><button type="button" data-m="login" aria-pressed="'+(modo==='login')+'">Ingresar</button></div>'+
 (modo==='alta'?
 '<div class="cols2"><div><p>Con la cuenta se guardan el avance, el plan y los datos de cada hijo o hija. Elegís el plan ahora y lo podés cambiar cuando quieras.</p></div>'+
 '<form id="fa" novalidate style="max-width:460px"><label for="n">Tu nombre</label><input id="n" type="text" autocomplete="name">'+
 '<label for="em" style="margin-top:12px">Correo electrónico</label><input id="em" type="email" inputmode="email" autocomplete="email">'+
 '<label for="pw" style="margin-top:12px">Contraseña (6 caracteres o más)</label><input id="pw" type="password" autocomplete="new-password">'+
 '<label for="hn" style="margin-top:12px">Nombre de tu hijo o hija</label><input id="hn" type="text">'+
 '<label for="he" style="margin-top:12px">Edad</label><select id="he">'+edades(11)+'</select>'+
 '<label for="pl" style="margin-top:12px">Plan</label><select id="pl">'+planOpts('familia')+'</select>'+
 '<p id="err" role="alert" style="color:var(--acc);font-weight:500;margin:10px 0 0"></p>'+
 '<div style="margin-top:12px"><button class="btn p" type="submit">Crear cuenta</button></div></form></div>':
 '<div class="cols2"><div><p>Ingresá con el correo y la contraseña con los que creaste la cuenta.</p></div>'+
 '<form id="fl" novalidate style="max-width:460px"><label for="em">Correo electrónico</label><input id="em" type="email" inputmode="email" autocomplete="email">'+
 '<label for="pw" style="margin-top:12px">Contraseña</label><input id="pw" type="password" autocomplete="current-password">'+
 '<p id="err" role="alert" style="color:var(--acc);font-weight:500;margin:10px 0 0"></p>'+
 '<div style="margin-top:12px"><button class="btn p" type="submit">Ingresar</button></div></form></div>')+
 '</section><section><div class="shead"><span class="num">§ 2</span><h2>Planes</h2></div>'+planCards('')+'</section>'+TERM.replace('§ 4','§ 3');
}
function logged(){
 var c=E.cuenta(),h='';
 var hij='';c.hijos.forEach(function(x){hij+='<tr><td>'+esc(x.nombre)+'</td><td>'+x.edad+' años</td><td>'+(E.cubierto(x)?'3 lecciones por semana':'Próximamente')+'</td><td><button class="btn" type="button" data-q="'+x.id+'" aria-label="Quitar a '+esc(x.nombre)+'">Quitar</button></td></tr>'});
 var maxh=c.plan==='libre'?1:4;
 host.innerHTML='<section><div class="shead"><span class="num">§ 1</span><h2>La familia</h2><span class="sc">alta: '+esc(c.alta)+'</span></div><div class="pc">'+
 '<dl class="props"><dt>Adulto</dt><dd>'+esc(c.nombre)+'</dd><dt>Correo</dt><dd>'+esc(E.S.sesion)+'</dd></dl>'+
 '<dl class="props"><dt>Plan</dt><dd>'+E.PLANES[c.plan].n+', '+E.PLANES[c.plan].p+'</dd><dt>Hijos</dt><dd>'+c.hijos.length+' de '+maxh+'</dd></dl></div>'+
 '<div class="btns" style="margin-top:14px"><button class="btn" type="button" id="salir">Cerrar sesión</button></div></section>'+
 '<section><div class="shead"><span class="num">§ 2</span><h2>Hijos</h2></div><div class="scroll" tabindex="0"><table class="tbl" style="min-width:480px"><thead><tr><th>Nombre</th><th>Edad</th><th>Ritmo</th><th><span class="vh">Acciones</span></th></tr></thead><tbody>'+hij+'</tbody></table></div>'+
 (c.hijos.length<maxh?'<form id="fh" novalidate style="max-width:460px;margin-top:16px"><label for="hn">Agregar un hijo o hija</label><input id="hn" type="text" placeholder="Nombre"><label for="he" style="margin-top:12px">Edad</label><select id="he">'+edades(10)+'</select><p id="err" role="alert" style="color:var(--acc);font-weight:500;margin:10px 0 0"></p><div style="margin-top:10px"><button class="btn" type="submit">Agregar</button></div></form>':'<p class="small" style="margin-top:12px">Llegaste al máximo de hijos del plan.</p>')+'</section>'+
 '<section><div class="shead"><span class="num">§ 3</span><h2>Plan</h2></div>'+planCards(c.plan)+
 '<form id="fp" style="max-width:460px;margin-top:16px"><label for="pl">Cambiar de plan</label><select id="pl">'+planOpts(c.plan)+'</select><p id="okp" role="status" class="small" style="margin:8px 0 0"></p><div style="margin-top:10px"><button class="btn" type="submit">Guardar plan</button></div></form></section>'+
 TERM.replace('§ 4','§ 4')+
 '<section><div class="shead"><span class="num">§ 5</span><h2>Evidencias y datos</h2></div><p>La carpeta de evidencias reúne los chequeos y la puerta de unidad de cada hijo o hija, en un archivo de texto.</p><div class="btns"><button class="btn" type="button" id="exp">Descargar carpeta de evidencias</button><button class="btn" type="button" id="del">Eliminar cuenta</button></div><p id="msg" role="status" class="small" style="margin-top:8px"></p></section>';
}
function draw(modo){if(E.cuenta())logged();else anon(modo||(location.hash==='#login'?'login':'alta'))}
draw();
host.addEventListener('click',function(e){
 var m=e.target.closest('[data-m]');if(m){anon(m.getAttribute('data-m'));return}
 if(e.target.id==='salir'){E.salir();document.getElementById('quien').textContent='Ingresar';location.hash='#login';draw('login');return}
 var q=e.target.closest('[data-q]');
 if(q){var c=E.cuenta();if(c.hijos.length<2){document.getElementById('msg').textContent='La cuenta necesita al menos un hijo o hija.';return}
  c.hijos=c.hijos.filter(function(x){return x.id!==+q.getAttribute('data-q')});c.hijo=c.hijos[0].id;E.save();logged();return}
 if(e.target.id==='del'){if(confirm('Se elimina la cuenta y todo su avance. ¿Seguís?')){E.eliminar();location.hash='#alta';location.reload()}return}
 if(e.target.id==='exp'){
  var c=E.cuenta(),t='Carpeta de evidencias · Domus\nFamilia: '+c.nombre+'\n\n';
  c.hijos.forEach(function(x){t+=x.nombre+' ('+x.edad+' años)\n';var k=x.prog.chequeos,any=0;Object.keys(k).forEach(function(i){any=1;t+='  Chequeo El péndulo: '+k[i].ok+' de 5 ('+k[i].fecha+')\n'});
   if(x.prog.puerta)t+='  Puerta unidad 3: '+(x.prog.puerta.ok?'superada':'sin superar')+', '+x.prog.puerta.pt+' de 10, intentos '+x.prog.puerta.intentos+'\n';
   if(!any&&!x.prog.puerta)t+='  Sin registros todavía.\n';t+='\n'});
  t+='Domus no otorga títulos con validez oficial.\n';
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download='evidencias-domus.txt';document.body.appendChild(a);a.click();a.remove();
  document.getElementById('msg').textContent='Se descargó evidencias-domus.txt.';
 }
});
host.addEventListener('submit',function(e){
 e.preventDefault();var err=document.getElementById('err'),v=function(i){return document.getElementById(i).value.trim()};
 if(e.target.id==='fa'){
  var d={nombre:v('n'),correo:v('em'),pw:document.getElementById('pw').value,hijo:v('hn'),edad:+v('he'),plan:v('pl')};
  if(!d.nombre){err.textContent='Escribí tu nombre.';document.getElementById('n').focus();return}
  if(!MAIL.test(d.correo)){err.textContent='Escribí un correo válido, con el formato nombre@dominio.com.';document.getElementById('em').focus();return}
  if(d.pw.length<6){err.textContent='La contraseña necesita 6 caracteres o más.';document.getElementById('pw').focus();return}
  if(!d.hijo){err.textContent='Escribí el nombre de tu hijo o hija.';document.getElementById('hn').focus();return}
  var r=E.crear(d);if(r){err.textContent=r;return}
  location.hash='';location.href='familia.html';
 }
 if(e.target.id==='fl'){var r2=E.entrar(v('em'),document.getElementById('pw').value);if(r2){err.textContent=r2;return}location.href='familia.html'}
 if(e.target.id==='fh'){
  var c=E.cuenta(),n=v('hn');if(!n){err.textContent='Escribí el nombre.';return}
  c.hijos.push({id:Date.now(),nombre:n,edad:+v('he'),prog:{unidad:3,semana:1,chequeos:{},puerta:null,minHijo:0,minAdulto:0,gasto:0,mats:{}}});E.save();logged();
 }
 if(e.target.id==='fp'){var c2=E.cuenta(),np=v('pl');if(np==='libre'&&c2.hijos.length>1){document.getElementById('okp').textContent='El plan Libre admite un solo hijo o hija. Quitá uno primero.';return}c2.plan=np;E.save();logged();document.getElementById('okp').textContent='Plan actualizado.'}
});
})();
