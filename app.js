'use strict';
(() => {
const paths={chevron:'<path d="m6 9 6 6 6-6"/>',search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',heart:'<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>',bag:'<path d="M5 7h14l2 14H3L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',sliders:'<path d="M3 7h5m4 0h9M3 17h9m4 0h5"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/>',chat:'<path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.9-5A9 9 0 1 1 21 11.5Z"/>',instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',whatsapp:'<path d="M2.5 21.5l1.8-5.3A9 9 0 1 1 21.5 12a8.9 8.9 0 0 1-2.6 6.3 8.9 8.9 0 0 1-6.4 2.7 9 9 0 0 1-4.8-1.4z"/><path d="M8.5 9.5c.2-.5.5-.5.8-.5h.6c.2 0 .4.1.5.4l.7 1.8c.1.3.1.5-.1.7l-.4.5c-.1.2-.2.3 0 .6.3.5.8 1.1 1.4 1.6.6.5 1.2.9 1.7 1.1.3.1.4.1.6-.1l.6-.7c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.6v.6c0 .8-.6 1.4-1.4 1.4-2.8 0-5.8-2.6-7.3-5.2-.8-1.5-.9-2.8-.2-3.6z"/>',copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[n]||paths.bag}</svg>`;
const $=s=>document.querySelector(s);
const paintIcons=(root=document)=>root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const heads=['Mika','Paula','Lara','Eduarda','Natália','Ana','Luana','Lívia','Luiza','Clara','Bruna','Camila','Pedro','Caio','Gabriel','Daniel','Jonathan','Pablo','Rafael','Samuel','Bia','Sofia','João','Juliana','Xuxa','Vick'];
const flexSizes=[['rn','RN até 1 ano',572],['2','2 anos',609.60],['4','4 anos',639.20],['6','6 anos',676],['8','8 anos',719.60],['10','10 anos',761.20],['12','12 anos',884],['14','14 anos',906.80]];
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const products=[
 ...flexSizes.map(([id,size,price])=>({id:'flex-kids-'+id,name:size.toLocaleUpperCase('pt-BR'),size,price,category:'Bustos',line:'flex-kids',material:'Malha crua',img:'assets/products/flex-kids-real.png',note:'Cabeça removível • braços articuláveis',options:heads,description:'Estrutura em aço carbono galvanizado, espuma de poliuretano flexível de alta densidade e forração em malha crua ribana. Cabeça removível, braços com ângulo de 360° e base cromada.'})),
 {id:'madeira',name:'Cabide de madeira',category:'Cabides',material:'Madeira',img:'assets/products/cabide-madeira.png',note:'Acabamento natural',options:['Natural','Personalizado com sua marca'],description:'Uma apresentação clássica para suas peças. Consulte os modelos, acabamentos e as opções de personalização disponíveis.',fresh:true},
 {id:'manequim',name:'Manequim feminino',category:'Manequins',material:'Polietileno',img:'assets/products/manequim-feminino.png',note:'Exposição em vitrine',options:['Branco','Consultar outros modelos'],description:'Para compor vitrines e destacar combinações. Consulte medidas, posições e acabamentos com a equipe Luganas.'},
 {id:'busto',name:'Busto de linho',category:'Bustos',material:'Linho',img:'assets/products/busto-linho.png',note:'Visual leve e natural',options:['Linho natural','Consultar outros modelos'],description:'Uma proposta versátil para a exposição de peças. Consulte as opções de bustos, bases e revestimentos disponíveis.'},
 {id:'personalizado',name:'Cabide personalizado',category:'Personalizados',material:'Madeira',img:'assets/products/cabide-personalizado.png',note:'Com a sua marca',options:['Logo em uma face','Consultar personalização'],description:'Leve a identidade da sua marca para a exposição da loja. Envie sua ideia e consulte formatos, aplicação e quantidade com a Luganas.'},
 {id:'veludo',name:'Cabide de veludo',category:'Cabides',material:'Veludo',img:'assets/products/cabide-veludo.png',note:'Acabamento em veludo',options:['Preto','Consultar outras cores'],description:'Uma opção para organizar o mostruário com unidade visual. Consulte tamanhos, cores e disponibilidade.'},
 {id:'presilha',name:'Cabide com presilha',category:'Cabides',material:'Madeira',img:'assets/products/cabide-presilha.png',note:'Para saias e calças',options:['Madeira natural','Consultar outros modelos'],description:'Uma alternativa para a exposição de saias e calças. Consulte medidas e opções de acabamento.'},
 {id:'kit-madeira',name:'Conjunto de cabides de madeira',category:'Cabides',material:'Madeira',img:'assets/products/kit-madeira.png',note:'Seleção para sua loja',options:['Natural','Com personalização'],description:'Monte uma seleção de cabides para a sua loja. Informe a quantidade desejada e consulte as opções com a equipe.'}
];
function load(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
let quote=load('luganas-quote',[]);if(!Array.isArray(quote))quote=[];quote=quote.filter(q=>products.some(p=>p.id===q.id)&&products.find(p=>p.id===q.id).options.includes(q.option)&&Number.isInteger(q.qty)&&q.qty>0&&q.qty<=9999);
let notes=load('luganas-notes','');if(typeof notes!=='string')notes='';notes=notes.slice(0,1500);
let view='home',category='Todos',material='Todos',sort='featured',query='',detailProduct=null,toastTimer,line='',sizeFilter='Todos',editingItem=null;
const headPhoto=(name,cls='')=>{const i=heads.indexOf(name);return `<span class="head-photo ${cls}" role="img" aria-label="Cabeça ${escape(name)}" style="--head-x:${[28,130,232,334,436][i%5]};--head-y:${[115,252,389,526,665,805][Math.floor(i/5)]}"></span>`};
const photo=(p,cls='')=>`<div class="product-photo ${cls}" role="img" aria-label="${escape(p.name)}"><img src="${p.img}" alt="${escape(p.name)}" class="product-img" loading="lazy" decoding="async"></div>`;
const find=id=>products.find(p=>p.id===id);
function persist(){try{localStorage.setItem('luganas-quote',JSON.stringify(quote));localStorage.setItem('luganas-notes',JSON.stringify(notes))}catch{}updateCounts()}
function updateCounts(){const qc=$('#quote-count');const n=quote.reduce((a,q)=>a+q.qty,0);qc.textContent=n>99?'99+':n;qc.hidden=!n;$('#quote-link').setAttribute('aria-label',`Abrir orçamento (${n} unidades)`)}
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3000)}
const catData=[['Cabides','madeira'],['Manequins','manequim'],['Bustos','busto'],['Personalizados','personalizado']];
const catBg={'Cabides':'#fdeee4','Manequins':'#edf3fa','Bustos':'#f7f1e9','Personalizados':'#fdf2e3'};
const catGradients={
  'Cabides':'linear-gradient(150deg, #fae4d5 0%, #faece2 100%)',
  'Manequins':'linear-gradient(150deg, #dbe6f6 0%, #edf3fa 100%)',
  'Bustos':'linear-gradient(150deg, #ede3d8 0%, #f9f5f0 100%)',
  'Personalizados':'linear-gradient(150deg, #faeedd 0%, #fcf4eb 100%)'
};
function renderHomeCategories(){
  const bar=$('#home-categories-bar');if(!bar)return;
  bar.innerHTML=catData.map(([c,id])=>`
    <a class="home-cat-bubble" href="#catalogo/${normalize(c)}" data-cat="${c}">
      <div class="home-cat-avatar">
        ${photo(find(id),'home-cat-photo')}
      </div>
      <span class="home-cat-label">${c}</span>
    </a>
  `).join('');
}
function render(){
 document.body.classList.toggle('route-catalog',view==='catalog');
 $('#home-content').hidden=view!=='home';$('#promos').hidden=view!=='home';$('#catalog-tools').hidden=view!=='catalog';$('#view-all').hidden=view!=='home';$('#catalog-eyebrow').hidden=view!=='catalog';$('#results-label').hidden=view==='home';
 $('#catalog-title').textContent=view==='home'?'Destaques para sua loja':category==='Todos'?'Explore o catálogo':category;
 if(view==='home')renderHomeCategories();
 const catItems=[{name:'Todos',id:null},...catData.map(([c,id])=>({name:c,id}))];
 $('#filter-chips').innerHTML=catItems.map(c=>`<button class="cat-pill-card" data-filter="${c.name}" aria-pressed="${category===c.name}"><div class="cat-squircle">${c.id?photo(find(c.id),'cat-squircle-photo'):`<div class="cat-all-icon">${icon('grid')}</div>`}</div><span class="cat-label">${c.name}</span></button>`).join('');
 const materials=[...new Set(products.filter(p=>category==='Todos'||p.category===category).map(p=>p.material))];
 if(!materials.includes(material))material='Todos';
 $('#material').innerHTML='<option value="Todos">Todos os materiais</option>'+materials.map(m=>'<option>'+escape(m)+'</option>').join('');
 $('#material').closest('label').hidden=!!line;
 $('#size-filter-field').hidden=line!=='flex-kids';$('#size-filter').value=sizeFilter;
 $('#material').value=material;$('#sort').value=sort;
 $('#line-showcase').hidden=!(view==='catalog'&&category==='Bustos'&&!line&&!query&&material==='Todos');
 $('#line-context').hidden=true;
 document.body.classList.toggle('is-flex-line',line==='flex-kids');
 $('#catalog-title').textContent=line==='flex-kids'?'Flex Kids':$('#catalog-title').textContent;
 $('#flex-breadcrumb').hidden=line!=='flex-kids';
 $('#clear-filters').hidden=(category==='Todos' && material==='Todos' && !query && sizeFilter==='Todos');
 document.body.classList.toggle('is-searching',Boolean(query));
 let list=products.filter(p=>(category==='Todos'||p.category===category)&&(material==='Todos'||p.material===material)&&(!line||p.line===line)&&(sizeFilter==='Todos'||p.size===sizeFilter)&&(!query||normalize(`${p.name} ${p.line?.replaceAll('-',' ')||''} ${p.category} ${p.material} ${p.note}`).includes(normalize(query))));
 if(category==='Bustos'&&!line&&!query&&material==='Todos')list=list.filter(p=>!p.line);
 if(sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));if(sort==='za')list.sort((a,b)=>b.name.localeCompare(a.name,'pt-BR'));
 if(view==='home')list=list.filter(p=>!p.line).slice(0,4);
 if(sort==='price')list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
 $('#results-label').textContent=`${list.length} produto${list.length===1?'':'s'}${query?' para “'+query+'”':''}`;
 if(!$('#line-showcase').hidden)$('#results-label').textContent=`1 linha · ${list.length} outro${list.length===1?'':'s'} produto${list.length===1?'':'s'}`;
 $('#product-grid').classList.toggle('is-home-grid',view==='home');
 
 if(view==='home'){
  // Estilo Glassmorphism (Card com painel de vidro fosco da Referência)
  $('#product-grid').innerHTML=list.map(p=>{
   const inQuote=quote.find(q=>q.id===p.id);
   const grad=catGradients[p.category]||'linear-gradient(150deg, #fae4d5 0%, #faece2 100%)';
   return `<article class="glass-product-card" style="--card-gradient: ${grad}">
     <div class="glass-card-top">
       
       ${p.fresh?'<span class="glass-new-badge">Novo</span>':''}
     </div>
     <button class="glass-photo-btn" data-detail="${p.id}" aria-label="Ver detalhes de ${escape(p.name)}">
       ${photo(p,'glass-card-photo')}
     </button>
     <div class="glass-overlay">
       <div class="glass-top-row">
         <button class="glass-title-btn" data-detail="${p.id}">${escape(p.name)}</button>
       </div>
       <div class="glass-footer-row">
         <p class="glass-desc">${escape(p.note)}</p>
         ${inQuote?`
           <div class="stepper-pill mini" role="group" aria-label="Quantidade de ${escape(p.name)}">
             <button class="step-btn" data-step-sub="${p.id}" aria-label="Diminuir">−</button>
             <span class="step-qty">${inQuote.qty}</span>
             <button class="step-btn" data-step-add="${p.id}" aria-label="Aumentar">+</button>
           </div>
         `:`
           <button class="glass-add-btn" data-add="${p.id}" aria-label="Adicionar ${escape(p.name)} ao orçamento">
             ${icon('plus')}
           </button>
         `}
       </div>
     </div>
   </article>`;
  }).join('');
 } else {
  // Estilo Catálogo (Cards Modernos Split Horizontal com Stepper)
  $('#product-grid').innerHTML=list.map(p=>{
   if(p.line)return flexCard(p);
   const inQuote=quote.find(q=>q.id===p.id);
   const bg=catBg[p.category]||'#fdeee4';
   return `<article class="modern-card">
     <div class="card-left">
       <div class="card-badges">
         
         ${p.fresh?'<span class="card-new-tag">Novo</span>':''}
       </div>
       <button class="card-title-btn" data-detail="${p.id}">${escape(p.name)}</button>
       <p class="card-desc">${escape(p.note)}</p>
       <div class="card-action-row">
         ${inQuote?`
           <div class="stepper-pill" role="group" aria-label="Quantidade de ${escape(p.name)}">
             <button class="step-btn" data-step-sub="${p.id}" aria-label="Diminuir quantidade">−</button>
             <span class="step-qty">${inQuote.qty}</span>
             <button class="step-btn" data-step-add="${p.id}" aria-label="Aumentar quantidade">+</button>
           </div>
         `:`
           <button class="add-pill-btn" data-add="${p.id}" aria-label="Adicionar ${escape(p.name)} ao orçamento">
             ${icon('plus')} Adicionar
           </button>
         `}
         <button class="detail-link-btn" data-detail="${p.id}">Opções</button>
       </div>
     </div>
     <div class="card-right" style="--card-bg: ${bg}">
       <button class="card-photo-btn" data-detail="${p.id}" aria-label="Ver detalhes de ${escape(p.name)}">
         ${photo(p,'card-thumb')}
       </button>
     </div>
   </article>`;
  }).join('');
 }
 $('#empty-state').hidden=!!list.length;$('#empty-title').textContent='Nenhum produto encontrado';$('#empty-copy').textContent='Experimente outro termo ou limpe os filtros.';
 document.title=(view==='home'?'Luganas Cabides | Cada peça merece destaque':`${line==='flex-kids'?'Flex Kids':category==='Todos'?'Catálogo':category} | Luganas Cabides`);
 paintIcons();updateCounts();observeReveals();
}
const scrollObserver=('IntersectionObserver' in window)?new IntersectionObserver((entries,obs)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}});},{threshold:0.02,rootMargin:'60px'}):null;
function observeReveals(root=document){const els=root.querySelectorAll('.reveal-on-scroll:not(.is-visible)');if(!scrollObserver){els.forEach(el=>el.classList.add('is-visible'));return;}els.forEach(el=>{const r=el.getBoundingClientRect();if(r.top<window.innerHeight+80){el.classList.add('is-visible');}else{scrollObserver.observe(el);}});}
(document.documentElement || document.body)?.classList.add('js-ready');
window.addEventListener('scroll',()=>{const h=$('.site-header');if(h)h.classList.toggle('is-scrolled',window.scrollY>15);},{passive:true});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href');if(h==='#inicio'){e.preventDefault();history.pushState(null,'','#inicio');route();window.scrollTo({top:0,behavior:'smooth'});}else if(h==='#conteudo'){e.preventDefault();$('#conteudo')?.scrollIntoView({behavior:'smooth',block:'start'});}});
function route(){let hash;try{hash=decodeURIComponent(location.hash.slice(1))}catch{hash='catalogo'}line='';sizeFilter='Todos';material='Todos';$('#material').value=material;sort='featured';$('#sort').value=sort;query='';$('#search').value='';if($('#catalog-search'))$('#catalog-search').value='';if($('#home-search'))$('#home-search').value='';category='Todos';view=hash.startsWith('catalogo')?'catalog':'home';const slug=hash.split('/')[1];if(slug)category=catData.find(([c])=>normalize(c)===slug)?.[0]||'Todos';if(hash.split('/')[2]==='flex-kids'&&category==='Bustos')line='flex-kids';render();if(view==='catalog'&&hash!==''){$('#catalog-title').scrollIntoView({behavior:'smooth',block:'start'});}else{window.scrollTo({top:0,behavior:'smooth'});}}
window.addEventListener('hashchange',route);
$('#filter-chips')?.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;const cat=b.dataset.filter;const target=cat==='Todos'?'catalogo':'catalogo/'+normalize(cat);if(location.hash==='#'+target){line='';sizeFilter='Todos';category=cat;material='Todos';render()}else location.hash=target});
$('#material')?.addEventListener('change',e=>{material=e.target.value;render()});$('#sort')?.addEventListener('change',e=>{sort=e.target.value;render()});
function resetFilters(){sizeFilter='Todos';material='Todos';query='';sort='featured';if($('#material'))$('#material').value='Todos';if($('#sort'))$('#sort').value='featured';$('#search').value='';if($('#catalog-search'))$('#catalog-search').value='';if($('#home-search'))$('#home-search').value='';view='catalog';render()}
$('#clear-filters')?.addEventListener('click',resetFilters);$('#empty-reset')?.addEventListener('click',()=>{if(location.hash==='#catalogo')resetFilters();else location.hash='catalogo'});
function search(val){line='';sizeFilter='Todos';query=val.trim();$('#search').value=query;if($('#catalog-search'))$('#catalog-search').value=query;if($('#home-search'))$('#home-search').value=query;category='Todos';material='Todos';if($('#material'))$('#material').value='Todos';view=query?'catalog':location.hash.startsWith('#catalogo')?'catalog':'home';render()}
$('#search')?.addEventListener('input',e=>search(e.target.value));
$('#search-form').addEventListener('submit',e=>{
  e.preventDefault();
  search($('#search').value);
  $('#catalog-title').scrollIntoView({block:'start',behavior:'smooth'});
});
$('#search-action-btn')?.addEventListener('click',e=>{
  e.preventDefault();
  if($('#search').value.trim()){
    search($('#search').value);
  } else {
    if(view!=='catalog')location.hash='catalogo';
  }
  $('#catalog-title').scrollIntoView({block:'start',behavior:'smooth'});
});
function addToQuote(id,option,qty=1){const p=find(id);if(!p)return;if(p.line&&!p.options.includes(option)){openProduct(id);return}option=option||p.options[0];if(!p.options.includes(option))return;qty=clamp(qty);const existing=quote.find(q=>q.id===id&&q.option===option);if(existing)existing.qty=Math.min(9999,existing.qty+qty);else quote.push({id,option,qty});persist();toast('Produto adicionado ao orçamento');}
function openProduct(id,edit=null){editingItem=edit;detailProduct=find(id);if(detailProduct?.line){openFlexProduct(detailProduct,edit);return}const p=detailProduct;$('#product-detail').innerHTML=`<div class="detail-layout">${photo(p,'detail-photo')}<div class="detail-copy"><p class="eyebrow">${p.category}</p><h2 id="detail-name">${p.name}</h2><p class="detail-description">${p.description}</p><label for="detail-option">Opção<select id="detail-option">${p.options.map(o=>`<option>${o}</option>`).join('')}</select></label><label for="detail-qty">Quantidade</label><div class="qty-control"><button data-detail-step="-1" aria-label="Diminuir quantidade">${icon('minus')}</button><input type="number" min="1" max="9999" value="1" id="detail-qty" inputmode="numeric"><button data-detail-step="1" aria-label="Aumentar quantidade">${icon('plus')}</button></div><button class="button" id="detail-add">${icon('bag')} Adicionar ao orçamento</button><p class="quote-hint">Imagem ilustrativa. Consulte disponibilidade.</p></div></div>`;$('#product-dialog').showModal()}
document.addEventListener('click',e=>{
 const stepAdd=e.target.closest('[data-step-add]');
 const stepSub=e.target.closest('[data-step-sub]');
 const a=e.target.closest('[data-add]');
 const d=e.target.closest('[data-detail]');
 if(stepAdd){e.stopPropagation();addToQuote(stepAdd.dataset.stepAdd,find(stepAdd.dataset.stepAdd).options[0],1);render();return;}
 if(stepSub){e.stopPropagation();const id=stepSub.dataset.stepSub,item=quote.find(q=>q.id===id);if(item){if(item.qty>1){item.qty-=1;persist();render();}else{quote=quote.filter(q=>q.id!==id);persist();render();toast('Produto removido');}}return;}
 if(a){addToQuote(a.dataset.add);render();return;}
 if(d){openProduct(d.dataset.detail);return;}
 if(e.target.closest('.close-dialog')){e.target.closest('dialog').close();}
});
const clamp=n=>Math.max(1,Math.min(9999,Math.floor(Number(n)||1)));
$('#product-dialog').addEventListener('click',e=>{const step=e.target.closest('[data-detail-step]');if(step)$('#detail-qty').value=clamp(Number($('#detail-qty').value)+Number(step.dataset.detailStep));if(e.target.closest('#detail-add')&&!detailProduct.line){addToQuote(detailProduct.id,$('#detail-option').value,clamp($('#detail-qty').value));$('#product-dialog').close()}});
$('#product-dialog').addEventListener('change',e=>{if(e.target.id==='detail-qty')e.target.value=clamp(e.target.value)});
function renderQuote(){const list=$('#quote-items');$('#quote-bottom').hidden=!quote.length;if(!quote.length){list.innerHTML=`<div class="empty-state">${icon('bag')}<h3>Vamos montar sua seleção?</h3><p>Adicione produtos pelo botão + do catálogo.</p><button class="button" id="quote-explore">Explorar catálogo</button></div>`;return}list.innerHTML=quote.map((q,i)=>{const p=find(q.id);return `<div class="quote-item">${p.line?headPhoto(q.option,'quote-head-photo'):photo(p,'quote-photo')}<div><h3>${p.name}</h3><p>${p.line?'Cabeça: ':''}${escape(q.option)}</p>${p.price?`<p class="quote-price">${money(p.price*q.qty)} <small>(${money(p.price)} / un.)</small></p><button class="detail-link-btn" data-edit="${i}">Editar cabeça</button>`:''}<div class="qty-control"><button data-quote-step="-1" data-index="${i}" aria-label="Diminuir quantidade de ${p.name}" ${q.qty===1?'disabled':''}>${icon('minus')}</button><input aria-label="Quantidade de ${p.name}" data-quote-qty="${i}" type="number" min="1" max="9999" inputmode="numeric" value="${q.qty}"><button data-quote-step="1" data-index="${i}" aria-label="Aumentar quantidade de ${p.name}">${icon('plus')}</button></div></div><button class="icon-btn" data-remove="${i}" aria-label="Remover ${p.name} do orçamento">${icon('trash')}</button></div>`}).join('');const priced=quote.filter(q=>find(q.id).price);$('#quote-subtotal').hidden=!priced.length;$('#quote-subtotal').innerHTML=priced.length?`<span>${priced.length===quote.length?'Subtotal de referência':'Subtotal Flex Kids'}</span><strong>${money(priced.reduce((s,q)=>s+find(q.id).price*q.qty,0))}</strong><small>Valores da tabela enviada. Cabeça, disponibilidade e frete a confirmar com a Luganas.${priced.length!==quote.length?' Demais produtos sob consulta.':''}</small>`:'';$('#quote-notes').value=notes;paintIcons($('#quote-dialog'));}
$('#quote-link').addEventListener('click',()=>{renderQuote();$('#quote-dialog').showModal()});
$('#quote-dialog').addEventListener('click',e=>{const edit=e.target.closest('[data-edit]');if(edit){const i=Number(edit.dataset.edit);$('#quote-dialog').close();openProduct(quote[i].id,quote[i]);return}const step=e.target.closest('[data-quote-step]'),remove=e.target.closest('[data-remove]');if(step){const q=quote[Number(step.dataset.index)];q.qty=clamp(q.qty+Number(step.dataset.quoteStep));persist();renderQuote()}if(remove){quote.splice(Number(remove.dataset.remove),1);persist();renderQuote()}if(e.target.closest('#quote-explore')){$('#quote-dialog').close();if(location.hash==='#catalogo')resetFilters();else location.hash='catalogo'}});
$('#quote-dialog').addEventListener('change',e=>{if(e.target.matches('[data-quote-qty]')){quote[Number(e.target.dataset.quoteQty)].qty=clamp(e.target.value);persist();renderQuote()}});
$('#quote-notes').addEventListener('input',e=>{notes=e.target.value;persist()});
const WHATSAPP_NUMBER = ''; // Configure aqui o número da Luganas com DDD (ex: '5511999999999')
function quoteText(){return 'Olá, Luganas! Gostaria de fazer o seguinte pedido:\n\n'+quote.map(q=>`• ${q.qty} × ${find(q.id).name} (${find(q.id).line?'Cabeça: ':''}${q.option})${find(q.id).price?' — '+money(find(q.id).price*q.qty)+' (referência)':''}`).join('\n')+(notes.trim()?'\n\nObservações: '+notes.trim():'')+'\n\nPodem confirmar valores e prazo de entrega?';}
$('#make-order')?.addEventListener('click',()=>{if(!quote.length)return;const msg=quoteText();const url=WHATSAPP_NUMBER?`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`:`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;window.open(url,'_blank','noopener,noreferrer');});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
function flexCard(p){
 return `<article class="modern-card flex-size-card"><div class="card-left"><button class="card-title-btn" data-detail="${p.id}">${escape(p.name)}</button><p class="card-desc size-price">${money(p.price)}</p><div class="card-action-row"><button class="add-pill-btn" data-detail="${p.id}">${icon('plus')} Escolher cabeça</button></div></div><div class="card-right" style="--card-bg:#f7f1e9"><button class="card-photo-btn" data-detail="${p.id}" aria-label="Ver detalhes de ${escape(p.name)}">${photo({...p,img:'assets/products/busto-flex-kids.png'},'card-thumb')}</button></div></article>`;
}
function openFlexProduct(p,edit){
 const selected=edit?.option||'';
 $('#product-detail').innerHTML=`<form id="flex-form" class="flex-detail"><div class="flex-detail-visual">${photo(p,'detail-photo')}<p class="flex-photo-caption">Imagem ilustrativa da linha.</p><section class="flex-specs" aria-labelledby="flex-specs-title"><h3 id="flex-specs-title">Características do produto</h3><p>${escape(p.description)}</p></section><div id="selected-head-preview" class="selected-head-preview" ${selected?'':'hidden'}>${selected?headPhoto(selected):''}<span>${selected?'Cabeça: '+escape(selected):''}</span></div></div><div class="flex-detail-copy"><p class="eyebrow">BUSTOS / FLEX KIDS</p><h2 id="detail-name">${escape(p.name)}</h2><p class="flex-price">${money(p.price)} <small>/ unidade*</small></p><fieldset class="head-fieldset"><legend>Escolha a cabeça <span>* Obrigatório</span></legend><div class="head-grid">${heads.map(h=>`<label class="head-option"><input type="radio" name="head" value="${escape(h)}" required ${h===selected?'checked':''}>${headPhoto(h)}<span>${escape(h)}</span><b aria-hidden="true">✓</b></label>`).join('')}</div></fieldset><div class="flex-purchase"><p id="flex-selection-summary" aria-live="polite">Tamanho: <strong>${escape(p.size)}</strong> · Cabeça: <strong>${selected?escape(selected):'selecione acima'}</strong></p><label for="detail-qty">Quantidade</label><div class="flex-purchase-actions"><div class="qty-control"><button type="button" data-detail-step="-1" aria-label="Diminuir quantidade">${icon('minus')}</button><input type="number" min="1" max="9999" value="${edit?.qty||1}" id="detail-qty" inputmode="numeric" required><button type="button" data-detail-step="1" aria-label="Aumentar quantidade">${icon('plus')}</button></div><button class="button" type="submit">${icon('bag')} ${edit?'Salvar alteração':'Adicionar ao orçamento'}</button></div></div><p class="quote-hint">Preço de referência. Cabeça, disponibilidade e frete a confirmar.</p></div></form>`;
 const form=$('#flex-form');
 form.addEventListener('change',e=>{if(e.target.name==='head'){const h=e.target.value;$('#flex-selection-summary').innerHTML=`Tamanho: <strong>${escape(p.size)}</strong> · Cabeça: <strong>${escape(h)}</strong>`;const preview=$('#selected-head-preview');preview.hidden=false;preview.innerHTML=headPhoto(h)+`<span>Cabeça: ${escape(h)}</span>`;}});
 form.addEventListener('submit',e=>{e.preventDefault();const selected=form.querySelector('input[name="head"]:checked');if(!selected)return;const qty=clamp($('#detail-qty').value);if(edit){const i=quote.indexOf(edit);if(i<0)return;const existing=quote.find(q=>q!==edit&&q.id===p.id&&q.option===selected.value);if(existing){existing.qty=Math.min(9999,existing.qty+qty);quote.splice(i,1)}else{edit.option=selected.value;edit.qty=qty}persist();toast('Configuração atualizada')}else addToQuote(p.id,selected.value,qty);$('#product-dialog').close();render();renderQuote();$('#quote-dialog').showModal();});
 $('#product-dialog').showModal();$('#product-dialog').scrollTop=0;
}
$('#size-filter').addEventListener('change',e=>{sizeFilter=e.target.value;render()});
$('#quote-more-flex').addEventListener('click',()=>{$('#quote-dialog').close()});
$('#product-dialog').addEventListener('close',()=>{if(editingItem){editingItem=null;if(!$('#quote-dialog').open){renderQuote();$('#quote-dialog').showModal()}}});

route();
})();
