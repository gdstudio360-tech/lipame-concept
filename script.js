
const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false');});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}));}
const animated=document.querySelectorAll('.reveal,.reveal-right,.stagger');
const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}})},{threshold:0.14});
animated.forEach(el=>observer.observe(el));
const heroBg=document.querySelector('.hero-bg');
const processSection=document.querySelector('.process-section');
const processProgress=document.querySelector('.process-progress');
function updateScrollEffects(){const y=window.scrollY;if(heroBg&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const move=Math.min(y*0.10,48);heroBg.style.transform=`scale(1.04) translateY(${move}px)`;}if(processSection&&processProgress){const rect=processSection.getBoundingClientRect();const vh=window.innerHeight;const total=rect.height+vh;const travelled=vh-rect.top;const progress=Math.max(0,Math.min(1,travelled/total));processProgress.style.width=`${progress*100}%`;}}
window.addEventListener('scroll',updateScrollEffects,{passive:true});updateScrollEffects();
