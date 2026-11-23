// Cascade Ventures site script. gaId: Google Analytics 4 ID (G-XXXXXXXXXX); leave empty to run no analytics.
var CONFIG={endpoint:"/api/contact",gaId:""};
var btn=document.querySelector(".menu"),nl=document.getElementById("nl");
function closeMenu(){nl.classList.remove("open");btn.setAttribute("aria-expanded","false")}
btn.addEventListener("click",function(){var o=nl.classList.toggle("open");btn.setAttribute("aria-expanded",o)});
addEventListener("keydown",function(e){if(e.key==="Escape"&&nl.classList.contains("open")){closeMenu();btn.focus()}});
document.getElementById("yr").textContent=new Date().getFullYear();
// Old single-page links (#services etc.) forward to the new pages.
var LEG={services:"/services",pricing:"/pricing",audit:"/visibility-audit",work:"/projects",testimonials:"/reviews",about:"/about",contact:"/contact",privacy:"/privacy",terms:"/terms",refunds:"/refunds"};
if(location.pathname==="/"&&LEG[location.hash.slice(1)])location.replace(LEG[location.hash.slice(1)]);
// Pricing buttons pass ?package=Name so the quote form can mention it.
var pk=new URLSearchParams(location.search).get("package"),pm=document.getElementById("msg");if(pk&&pm&&!pm.value)pm.value="Package of interest: "+pk.slice(0,80)+"\n";
function setup(f){var st=f.nextElementSibling,sb=f.querySelector("button[type=submit]"),label=sb.textContent,t0=Date.now();
function say(m,err){st.textContent=m;st.className="status on";st.setAttribute("role",err?"alert":"status");st.focus()}
f.addEventListener("submit",function(ev){ev.preventDefault();st.className="status";var bad=null;
f.querySelectorAll("[data-v]").forEach(function(i){var v=i.value.trim(),k=i.dataset.v,m="";
if(k==="req"&&!v||k==="email"&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)||k==="url"&&v&&!/^https?:\/\/\S+\.\S+/.test(v)||k==="long"&&v.length<10)m=i.dataset.m;
i.setAttribute("aria-invalid",!!m);document.getElementById("e-"+i.id).textContent=m;if(m&&!bad)bad=i});
if(bad){bad.focus();return}
if(f.querySelector(".hp input").value)return;
var fd={};new FormData(f).forEach(function(v,k){if(k!=="hp"&&v!=="")fd[k]=fd[k]?fd[k]+", "+v:v});
sb.disabled=true;sb.textContent="Sending…";
fetch(CONFIG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({form:f.dataset.kind,fields:fd,elapsed:Date.now()-t0})})
.then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(j){if(!j||j.ok!==true)throw new Error("bad response");if(window.gtag)gtag("event","generate_lead",{form_type:f.dataset.kind});f.reset();f.hidden=true;say("Thank you. Your request has been sent and we will be in touch.",false)})
.catch(function(){say("We couldn’t send your request. Your details are still in the form, so please try again in a moment.",true)})
.then(function(){sb.disabled=false;sb.textContent=label})})}
document.querySelectorAll("form[data-kind]").forEach(setup);
function loadGA(){var g=document.createElement("script");g.async=true;g.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(CONFIG.gaId);document.head.append(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",CONFIG.gaId,{anonymize_ip:true})}
function setChoice(v){try{localStorage.setItem("cv-consent",v)}catch(e){}document.getElementById("consent").hidden=true;if(v==="yes")loadGA()}
(function(){if(!CONFIG.gaId)return;var c=null;try{c=localStorage.getItem("cv-consent")}catch(e){}if(c==="yes")return loadGA();if(c==="no")return;document.getElementById("consent").hidden=false;document.getElementById("c-yes").onclick=function(){setChoice("yes")};document.getElementById("c-no").onclick=function(){setChoice("no")}})();
