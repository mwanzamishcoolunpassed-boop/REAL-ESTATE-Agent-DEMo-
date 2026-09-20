const properties = [
  {id:1,title:"Modern Family Residence",location:"Lusaka, Zambia",price:1850000,status:"sale",type:"House",beds:4,baths:3,size:"420 m²",newest:12},
  {id:2,title:"Contemporary City Apartment",location:"Ibex Hill, Lusaka",price:9500,status:"rent",type:"Apartment",beds:2,baths:2,size:"115 m²",newest:11},
  {id:3,title:"Residential Development Plot",location:"Chalala, Lusaka",price:650000,status:"sale",type:"Land",beds:0,baths:0,size:"1,200 m²",newest:10},
  {id:4,title:"Premium Office Suite",location:"Longacres, Lusaka",price:18000,status:"rent",type:"Office",beds:0,baths:2,size:"210 m²",newest:9},
  {id:5,title:"Retail Space Opportunity",location:"Kabulonga, Lusaka",price:2300000,status:"sale",type:"Shop",beds:0,baths:2,size:"185 m²",newest:8},
  {id:6,title:"Executive Garden Home",location:"Roma, Lusaka",price:3200000,status:"sale",type:"House",beds:5,baths:4,size:"650 m²",newest:7},
  {id:7,title:"Central Warehouse",location:"Makeni, Lusaka",price:27000,status:"rent",type:"Warehouse",beds:0,baths:2,size:"900 m²",newest:6},
  {id:8,title:"Elegant 3-Bed Apartment",location:"Mass Media, Lusaka",price:14500,status:"rent",type:"Apartment",beds:3,baths:2,size:"160 m²",newest:5},
  {id:9,title:"Commercial Corner Property",location:"Chilenje, Lusaka",price:4100000,status:"sale",type:"Commercial",beds:0,baths:3,size:"800 m²",newest:4},
  {id:10,title:"Luxury Hillside Residence",location:"State Lodge, Lusaka",price:6500000,status:"sale",type:"House",beds:6,baths:5,size:"1,050 m²",newest:3},
  {id:11,title:"Serviced Office Floor",location:"Rhodespark, Lusaka",price:22000,status:"rent",type:"Office",beds:0,baths:3,size:"300 m²",newest:2},
  {id:12,title:"Affordable Starter Home",location:"Chalala, Lusaka",price:1250000,status:"sale",type:"House",beds:3,baths:2,size:"300 m²",newest:1}
];

let currentProperties = [...properties];
const grid = document.getElementById("propertyGrid");
const resultCount = document.getElementById("resultCount");

function money(value,status){
  return status === "rent" ? `K${value.toLocaleString()}/month` : `K${value.toLocaleString()}`;
}

function renderProperties(items=currentProperties){
  grid.innerHTML = items.map(p => `
    <article class="property-card">
      <div class="property-image">
        <span>(Property Image)</span>
        <span class="badge">${p.status === "sale" ? "FOR SALE" : "FOR RENT"}</span>
      </div>
      <div class="property-body">
        <h3>${p.title}</h3>
        <p class="location">${p.location}</p>
        <p class="price">${money(p.price,p.status)}</p>
        <p class="description">${p.type} property prepared as demo content for (Business Name).</p>
        <div class="meta">
          ${p.beds ? `<span>${p.beds} Beds</span>` : ""}
          ${p.baths ? `<span>${p.baths} Baths</span>` : ""}
          <span>${p.size}</span>
        </div>
        <a href="#" class="view-property" data-id="${p.id}">View Property →</a>
      </div>
    </article>
  `).join("");
  resultCount.textContent = `${items.length} demo ${items.length === 1 ? "property" : "properties"}`;
}

function applyFilters(){
  const location = document.getElementById("locationInput").value.trim().toLowerCase();
  const type = document.getElementById("typeInput").value;
  const status = document.getElementById("statusInput").value;
  const min = Number(document.getElementById("minPrice").value) || 0;
  const max = Number(document.getElementById("maxPrice").value) || Infinity;
  const beds = Number(document.getElementById("bedsInput").value) || 0;

  currentProperties = properties.filter(p =>
    (!location || p.location.toLowerCase().includes(location)) &&
    (!type || p.type === type) &&
    (!status || p.status === status) &&
    p.price >= min && p.price <= max &&
    p.beds >= beds
  );
  sortAndRender();
}

function sortAndRender(){
  const sort = document.getElementById("sortSelect").value;
  const sorted = [...currentProperties].sort((a,b)=>{
    if(sort === "low") return a.price-b.price;
    if(sort === "high") return b.price-a.price;
    return b.newest-a.newest;
  });
  renderProperties(sorted);
}

document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  applyFilters();
  document.getElementById("properties").scrollIntoView({behavior:"smooth"});
});

document.getElementById("sortSelect").addEventListener("change",sortAndRender);

document.querySelectorAll("[data-filter-link]").forEach(link=>{
  link.addEventListener("click",()=>{
    const value=link.dataset.filterLink;
    document.getElementById("statusInput").value=value;
    applyFilters();
  });
});

document.querySelectorAll("[data-category-link]").forEach(link=>{
  link.addEventListener("click",()=>{
    document.getElementById("typeInput").value=link.dataset.categoryLink;
    applyFilters();
  });
});

document.querySelectorAll(".category-card").forEach(card=>{
  card.addEventListener("click",()=>{
    const category=card.dataset.category;
    if(category === "Luxury"){
      currentProperties=properties.filter(p=>p.price>=3000000);
    }else{
      currentProperties=properties.filter(p=>p.type===category);
    }
    sortAndRender();
    document.getElementById("properties").scrollIntoView({behavior:"smooth"});
  });
});

document.querySelectorAll(".view-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".view-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    if(btn.dataset.view==="map"){
      grid.classList.add("hidden");
      document.getElementById("mapView").classList.remove("hidden");
    }else{
      document.getElementById("mapView").classList.add("hidden");
      grid.classList.remove("hidden");
      document.body.classList.toggle("list-view",btn.dataset.view==="list");
    }
  });
});

grid.addEventListener("click",e=>{
  const link=e.target.closest(".view-property");
  if(!link)return;
  e.preventDefault();
  const p=properties.find(x=>x.id===Number(link.dataset.id));
  document.getElementById("modalContent").innerHTML=`
    <div class="modal-content-image">(Property Image)</div>
    <p class="eyebrow">${p.status==="sale"?"FOR SALE":"FOR RENT"}</p>
    <h2>${p.title}</h2>
    <p class="location">${p.location}</p>
    <p class="price">${money(p.price,p.status)}</p>
    <div class="meta"><span>${p.type}</span>${p.beds?`<span>${p.beds} Beds</span>`:""}${p.baths?`<span>${p.baths} Baths</span>`:""}<span>${p.size}</span></div>
    <p style="margin:20px 0;color:#6d766f">Demo property description. Replace this content with verified information about the actual property, its amenities, terms and availability.</p>
    <p><strong>Features:</strong> Parking · Security · Modern finishes · Convenient location</p>
    <div style="display:flex;gap:10px;margin-top:25px;flex-wrap:wrap">
      <a class="primary-btn" href="#contact" onclick="closeModal()">Contact Agent</a>
      <a class="primary-btn" style="background:#1e9d5a" href="#" onclick="return whatsappProperty('${p.title}')">WhatsApp Agent</a>
      <a class="primary-btn" href="tel:+000000000">Call Agent</a>
    </div>`;
  document.getElementById("propertyModal").classList.remove("hidden");
  document.getElementById("propertyModal").setAttribute("aria-hidden","false");
});

function closeModal(){
  document.getElementById("propertyModal").classList.add("hidden");
  document.getElementById("propertyModal").setAttribute("aria-hidden","true");
}
document.getElementById("modalClose").addEventListener("click",closeModal);
document.getElementById("propertyModal").addEventListener("click",e=>{if(e.target.id==="propertyModal")closeModal()});

function whatsappProperty(title){
  alert(`Replace (WhatsApp Number) in script.js with the agency's real WhatsApp number. Property: ${title}`);
  return false;
}
document.getElementById("whatsappButton").addEventListener("click",e=>{
  e.preventDefault();
  alert("Replace (WhatsApp Number) in script.js with the agency's real WhatsApp number.");
});

function formSuccess(id,message){
  document.getElementById(id).textContent=message;
}
document.getElementById("listForm").addEventListener("submit",e=>{
  e.preventDefault(); formSuccess("listMessage","Demo submission received. Connect this form to your backend/email service.");
  e.target.reset();
});
document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault(); formSuccess("contactMessage","Demo enquiry received. Connect this form to your backend/email service.");
  e.target.reset();
});

const menuToggle=document.querySelector(".menu-toggle");
const nav=document.getElementById("nav");
menuToggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",open);
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();

renderProperties();
