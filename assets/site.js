(function(){
  var $=function(s,r){return (r||document).querySelector(s)};

  /* mobile menu */
  var bg=$("#burger"),mn=$("#menu");
  function setMenu(o){mn.classList.toggle("open",o);bg.setAttribute("aria-expanded",String(o));bg.setAttribute("aria-label",o?"Close menu":"Open menu");}
  if(bg&&mn){
    bg.addEventListener("click",function(){setMenu(!mn.classList.contains("open"))});
    mn.addEventListener("click",function(e){if(e.target.closest("a"))setMenu(false)});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&mn.classList.contains("open")){setMenu(false);bg.focus();}});
  }

  /* theme toggle: stored choice overrides the system preference */
  var tb=$("#theme");
  function effective(){
    var t=document.documentElement.getAttribute("data-theme");
    if(t)return t;
    return window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
  }
  function label(){
    if(!tb)return;
    var cur=effective();
    tb.setAttribute("aria-label","Switch to "+(cur==="dark"?"light":"dark")+" theme");
    tb.setAttribute("aria-pressed",String(cur==="light"));
    var m=document.querySelector('meta[name="theme-color"]');
    if(m)m.setAttribute("content",cur==="light"?"#F3F6F4":"#0A0D0F");
  }
  if(tb){
    tb.addEventListener("click",function(){
      var next=effective()==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",next);
      try{localStorage.setItem("nifa-theme",next)}catch(e){}
      label();
    });
    label();
  }

  /* gentle reveal */
  var els=[].slice.call(document.querySelectorAll(".rv"));
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!("IntersectionObserver" in window)||reduce){els.forEach(function(e){e.classList.add("in")})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(n){if(n.isIntersecting){n.target.classList.add("in");io.unobserve(n.target)}})},{threshold:.08});
    els.forEach(function(e){io.observe(e)});
  }

  /* Wrong Turn illustrative mini-demo (not the game) */
  var arrow=$("#arrow");
  if(arrow){
    var dir=0,mode=0,streak=0,NM=["up","right","down","left"];
    var rule=$("#rule"),fb=$("#fb");
    var round=function(){
      dir=Math.floor(Math.random()*4);mode=Math.floor(Math.random()*2);
      arrow.style.transform="rotate("+(dir*90)+"deg)";
      rule.textContent=mode?"RULE: GO OPPOSITE":"RULE: FOLLOW THE ARROW";
    };
    document.addEventListener("click",function(e){
      var b=e.target.closest(".pad button");if(!b)return;
      var want=mode?(dir+2)%4:dir,ok=+b.dataset.d===want;
      streak=ok?streak+1:0;
      fb.textContent=ok?"Correct. Streak "+streak+".":"The rule said "+(mode?"go opposite":"follow the arrow")+": "+NM[want]+".";
      round();
    });
    round();
  }
})();
