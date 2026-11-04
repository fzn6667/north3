const $=(q,e=document)=>e.querySelector(q),$$=(q,e=document)=>[...e.querySelectorAll(q)];
let S=Store.get();const save=()=>Store.set(S);
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2600)}
function nav(cur){
 const L=[["index.html","🏠 Home"],["tourist.html","🧳 Tourist"],["volunteer.html","🙋 Volunteer"],["admin.html","🛡️ Admin"],["hotel.html","🏨 Hotel Owner"]];
 document.body.insertAdjacentHTML("afterbegin",`<nav><b>⛰️ The North</b>${L.map(l=>`<a href="${l[0]}" class="${l[0]==cur?"on":""}">${l[1]}</a>`).join("")}<button id="lang">اردو / EN</button><button id="rst" title="Reset demo data">↺</button></nav>`);
 const rtl=()=>document.body.classList.toggle("rtl",S.lang=="ur");rtl();
 $("#lang").onclick=()=>{S.lang=S.lang=="ur"?"en":"ur";save();rtl();toast(S.lang=="ur"?"اردو layout (RTL) enabled":"English layout enabled")};
 $("#rst").onclick=()=>confirm("Reset all demo data?")&&Store.reset();
 document.body.insertAdjacentHTML("beforeend",`<p class="muted" style="text-align:center;padding:16px">Prototype with simulated data · Safety-support tool, not an emergency authority · Emergency: <b>Rescue 1122</b></p>`)}
function tag(st){return `<span class="tag ${st}">${ICON[st]} ${LBL[st]}</span>`}
function legend(){return `<div class="legend">${["green","yellow","red","grey"].map(tag).join("")}</div>`}
function tabs(el){const b=$$(".tabs button",el),p=$$(".pane",el);const go=i=>{b.forEach((x,j)=>x.classList.toggle("on",i==j));p.forEach((x,j)=>x.classList.toggle("on",i==j))};b.forEach((x,i)=>x.onclick=()=>go(i));go(0)}
const COL={green:"#1e8e3e",yellow:"#e6a100",red:"#d32f2f",grey:"#78858a"},DASH={green:"",yellow:"14 8",red:"3 9",grey:"22 10"};
function drawMap(el,o={}){
 const P=S.places;let h=`<svg viewBox="0 0 700 480" role="img" aria-label="Hazard map of Gilgit-Baltistan"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6ee"/><stop offset="1" stop-color="#e8f2ee"/></linearGradient></defs><rect width="700" height="480" fill="url(#sk)"/>`;
 [[40,470,120],[160,470,150],[300,470,110],[420,470,170],[560,470,140]].forEach(m=>h+=`<polygon points="${m[0]-m[2]/1.2},480 ${m[0]},${m[1]-m[2]*1.6} ${m[0]+m[2]/1.2},480" fill="#b8cfc9" opacity=".55"/><polygon points="${m[0]-12},${m[1]-m[2]*1.6+30} ${m[0]},${m[1]-m[2]*1.6} ${m[0]+12},${m[1]-m[2]*1.6+30}" fill="#fff" opacity=".85"/>`);
 S.segs.forEach(s=>{const st=eff(s),d="M"+s.pts.map(p=>p.join(",")).join(" L"),m=s.pts[1];
  h+=`<path d="${d}" class="seg ${st=="red"?"pulse":""} ${o.sel==s.id?"sel":""}" data-id="${s.id}" stroke="${COL[st]}" stroke-dasharray="${DASH[st]}" tabindex="0" role="button" aria-label="${s.name}, ${LBL[st]}"/>`;
  h+=`<g transform="translate(${m[0]},${m[1]})" style="pointer-events:none"><circle r="12" fill="${COL[st]}" stroke="#fff" stroke-width="2"/><text y="5" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">${ICON[st]}</text></g>`});
 if(o.alt){h+=`<path d="M190,330 L250,300 L310,270" stroke="#7b1fa2" stroke-width="4" fill="none" stroke-dasharray="2 7" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite"/></path><text x="215" y="285" font-size="12" fill="#7b1fa2" font-weight="700">Alt. route</text>`}
 Object.entries(P).forEach(([n,p])=>h+=`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#10262c"/><text x="${p[0]+8}" y="${p[1]-8}" font-size="13" font-weight="600" fill="#10262c">${n}</text>`);
 h+=`<g><circle r="7" fill="#0F4C5C" stroke="#fff" stroke-width="2"><animateMotion dur="9s" repeatCount="indefinite" path="M60,440 L120,390 L190,330 L250,300 L310,270"/></circle></g>`;
 h+=`<text x="12" y="470" font-size="11" fill="#445">Simulated map · OSM-style schematic</text></svg>`;
 el.innerHTML=h;
 $$(".seg",el).forEach(p=>{const f=()=>o.pick&&o.pick(+p.dataset.id);p.onclick=f;p.onkeydown=e=>e.key=="Enter"&&f()})}
function segCard(s){const st=eff(s);return `<h3>${s.name}</h3>${tag(st)} ${stale(s)&&s.st!="grey"?'<span class="tag grey">Needs update (&gt;6h)</span>':""}<table><tr><td>Cause</td><td>${s.cause}</td></tr><tr><td>Source</td><td>${s.src}</td></tr><tr><td>Updated</td><td>${ago(s.upd)}</td></tr><tr><td>Alternate</td><td>${s.alt}</td></tr></table>`}
