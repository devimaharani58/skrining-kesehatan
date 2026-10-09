(function(){
var $=function(i){return document.getElementById(i)};
var num=function(i){var v=$(i).value.trim();return v===""?null:parseFloat(v)};
var lv={ok:"Normal",warn:"Perlu perhatian",bad:"Periksa ke tenaga kesehatan"};

function imt(tb,bb){
  var m=tb/100,v=bb/(m*m),c,t,d;
  if(v<18.5){c="warn";t="Kurus";d="Berat badan di bawah rentang sehat. Perhatikan asupan gizi."}
  else if(v<23){c="ok";t="Normal";d="Berat badan dalam rentang sehat."}
  else if(v<25){c="warn";t="Berat berlebih";d="Mulai atur pola makan dan tingkatkan aktivitas."}
  else{c="bad";t="Obesitas";d="Risiko penyakit jantung dan diabetes meningkat."}
  return {n:"Indeks massa tubuh (IMT): "+v.toFixed(1),c:c,t:t,d:d,s:c=="ok"?0:c=="warn"?1:2};
}
function tensi(s,d){
  if(s==null||d==null)return null;
  var c,t,x;
  if(s>=140||d>=90){c="bad";t="Tinggi";x="Tekanan darah tinggi. Periksakan ke tenaga kesehatan untuk pengukuran ulang."}
  else if(s>=120||d>=80){c="warn";t="Agak tinggi";x="Di atas ideal. Kurangi garam dan pantau secara rutin."}
  else if(s<90||d<60){c="warn";t="Rendah";x="Lebih rendah dari biasanya. Periksakan jika pusing atau lemas."}
  else{c="ok";t="Normal";x="Tekanan darah dalam batas normal."}
  return {n:"Tekanan darah: "+s+"/"+d+" mmHg",c:c,t:t,d:x,s:c=="ok"?0:c=="warn"?1:2};
}
function gula(g){
  if(g==null)return null;
  var c,t,x;
  if(g>=126){c="bad";t="Tinggi";x="Kadar di rentang diabetes. Perlu pemeriksaan lanjutan."}
  else if(g>=100){c="warn";t="Prediabetes";x="Di atas normal. Atur makan, olahraga, dan periksa ulang."}
  else if(g<70){c="warn";t="Rendah";x="Di bawah normal. Pastikan Anda benar-benar puasa saat tes."}
  else{c="ok";t="Normal";x="Gula darah puasa dalam batas normal."}
  return {n:"Gula darah puasa: "+g+" mg/dL",c:c,t:t,d:x,s:c=="ok"?0:c=="warn"?1:2};
}
function perut(l,jk){
  if(l==null)return null;
  var lim=jk=="L"?90:80,hi=l>lim;
  return {n:"Lingkar perut: "+l+" cm",c:hi?"bad":"ok",t:hi?"Berisiko":"Normal",
    d:hi?"Melebihi batas "+lim+" cm (obesitas sentral).":"Di bawah batas "+lim+" cm.",s:hi?2:0};
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

$("f").addEventListener("submit",function(e){
  e.preventDefault();
  var err=$("err");err.textContent="";
  var usia=num("usia"),tb=num("tb"),bb=num("bb"),sis=num("sis"),dia=num("dia");
  if(usia==null||tb==null||bb==null){err.textContent="Usia, tinggi, dan berat badan wajib diisi.";return}
  if((sis==null)!=(dia==null)){err.textContent="Isi kedua angka tekanan darah, atau kosongkan keduanya.";return}
  var jk=$("jk").value;
  var hasil=[imt(tb,bb),tensi(sis,dia),gula(num("gdp")),perut(num("lp"),jk)].filter(Boolean);
  var skor=hasil.reduce(function(a,h){return a+h.s},0);
  if($("rokok").value=="1")skor+=2;
  if($("olah").value=="0")skor+=1;
  if($("rw").value=="1")skor+=1;
  if(usia>=45)skor+=1;
  var lvl=skor<=1?"ok":skor<=4?"warn":"bad";
  var jud={ok:"Risiko rendah",warn:"Risiko sedang",bad:"Risiko tinggi"}[lvl];
  var saran={ok:"Pertahankan pola hidup sehat dan skrining ulang setahun sekali.",
    warn:"Perbaiki pola makan dan aktivitas, lalu ulangi pengukuran dalam 1 bulan.",
    bad:"Sebaiknya segera periksa ke puskesmas atau dokter untuk pemeriksaan lanjutan."}[lvl];
  var nm=$("nama").value.trim();
  var h='<div class="sum" style="border-color:var(--'+(lvl=="ok"?"ok":lvl=="warn"?"warn":"bad")+')">'+
    '<h2 class="'+lvl+'">'+jud+(nm?" untuk "+esc(nm):"")+'</h2><div>'+saran+'</div></div>';
  hasil.forEach(function(r){
    h+='<div class="item"><b>'+r.n+'</b><span class="tag '+r.c+'">'+r.t+'</span><p>'+r.d+'</p></div>';
  });
  var f=[];
  if($("rokok").value=="1")f.push("merokok");
  if($("olah").value=="0")f.push("olahraga kurang");
  if($("rw").value=="1")f.push("riwayat keluarga");
  if(usia>=45)f.push("usia 45 tahun ke atas");
  if(f.length)h+='<div class="item"><b>Faktor tambahan</b><span class="tag warn">'+f.length+'</span><p>'+f.join(", ")+'.</p></div>';
  h+='<div class="row"><button type="button" onclick="window.print()">Cetak hasil</button></div>';
  var el=$("hasil");el.innerHTML=h;el.hidden=false;el.classList.remove("show");void el.offsetWidth;el.classList.add("show");
  el.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
});
$("reset").addEventListener("click",function(){$("hasil").hidden=true;$("err").textContent=""});
})();