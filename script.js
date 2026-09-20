const products=[
{id:1,name:"Wildflower Tote",cat:"bags",price:149,emoji:"🌼",class:"p1",desc:"Hand-painted canvas tote"},
{id:2,name:"Leaf Stitch Tee",cat:"tees",price:149,emoji:"🌿",class:"p2",desc:"Hand-stitched cotton tee"},
{id:3,name:"Sunset Doodle Bag",cat:"bags",price:149,emoji:"🌅",class:"p3",desc:"Original painted artwork"},
{id:4,name:"Floral Thread Tee",cat:"tees",price:149,emoji:"🌸",class:"p4",desc:"Thread embroidery detail"},
{id:5,name:"Mini Art Pouch",cat:"gifts",price:149,emoji:"🎨",class:"p5",desc:"Tiny handmade zipper pouch"},
{id:6,name:"Custom Gift Box",cat:"gifts",price:149,emoji:"🎁",class:"p6",desc:"Curated handmade gift set"},
{id:7,name:"03 Number Black Tee",cat:"tees",price:149,images:["tshirt-both.webp","tshirt-front.webp","tshirt-back.webp"],desc:"Stylish front and back print tee"}
];

let cart=JSON.parse(localStorage.getItem("haathse-cart")||"[]");

function renderProducts(list=products){
  document.getElementById("products").innerHTML=list.map(p=>{
    if(p.images){
      let imagesHtml = p.images.map((img, idx) => `<img src="${img}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; display:${idx===0?'block':'none'};" class="product-slide-${p.id}">`).join("");
      return `<article class="card" onclick="openProductModal(${p.id})" style="cursor:pointer;">
        <div class="photo" style="height: 180px; background: #f4f4f4; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          ${imagesHtml}
          <button onclick="changeSlide(event, ${p.id}, -1)" style="position:absolute; left:5px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:#fff; border:none; padding:4px 8px; cursor:pointer; border-radius:3px; z-index:10;">‹</button>
          <button onclick="changeSlide(event, ${p.id}, 1)" style="position:absolute; right:5px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:#fff; border:none; padding:4px 8px; cursor:pointer; border-radius:3px; z-index:10;">›</button>
        </div>
        <h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">Add to cart</button>
      </article>`;
    } else {
      return `<article class="card" onclick="openProductModal(${p.id})" style="cursor:pointer;">
        <div class="photo ${p.class}">${p.emoji}</div>
        <h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">Add to cart</button>
      </article>`;
    }
  }).join("");
}

window.currentIndices = {};
function changeSlide(e, productId, direction) {
  e.stopPropagation();
  if(!window.currentIndices[productId]) window.currentIndices[productId] = 0;
  const product = products.find(p => p.id === productId);
  if(!product || !product.images) return;
  
  let slides = document.querySelectorAll(`.product-slide-${productId}`);
  window.currentIndices[productId] = (window.currentIndices[productId] + direction + slides.length) % slides.length;
  
  slides.forEach((img, idx) => {
    img.style.display = idx === window.currentIndices[productId] ? 'block' : 'none';
  });
}

function openProductModal(id) {
  const p = products.find(prod => prod.id === id);
  if(!p) return;
  
  let modal = document.getElementById("productModal");
  if(!modal) {
    modal = document.createElement("div");
    modal.id = "productModal";
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px;";
    document.body.appendChild(modal);
  }
  
  let contentHtml = "";
  if(p.images) {
    let imgList = p.images.map((img, idx) => `<img src="${img}" alt="${p.name}" style="width:100%; height:250px; object-fit:cover; display:${idx===0?'block':'none'};" class="modal-slide">`).join("");
    contentHtml = `
      <div style="position:relative; width:100%; height:250px; background:#eee; border-radius:8px; overflow:hidden; margin-bottom:15px; display:flex; align-items:center; justify-content:center;">
        ${imgList}
        ${p.images.length > 1 ? `<button onclick="modalSlide(-1)" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:#fff; border:none; padding:6px 10px; cursor:pointer; border-radius:3px;">‹</button>
        <button onclick="modalSlide(1)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:#fff; border:none; padding:6px 10px; cursor:pointer; border-radius:3px;">›</button>` : ''}
      </div>
    `;
  } else {
    contentHtml = `<div style="font-size:60px; text-align:center; height:180px; display:flex; align-items:center; justify-content:center; background:#f4f4f4; border-radius:8px; margin-bottom:15px;">${p.emoji}</div>`;
  }
  
  modal.innerHTML = `
    <div style="background:#fff; width:100%; max-width:400px; padding:20px; border-radius:10px; position:relative; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
      <button onclick="closeProductModal()" style="position:absolute; right:15px; top:15px; background:none; border:none; font-size:22px; cursor:pointer;">&times;</button>
      ${contentHtml}
      <h2>${p.name}</h2>
      <p style="color:#666; margin:10px 0;">${p.desc}</p>
      <div style="font-size:18px; font-weight:bold; margin-bottom:15px;">₹${p.price}</div>
      <button onclick="addToCart(${p.id}); closeProductModal();" style="width:100%; background:#000; color:#fff; border:none; padding:10px; border-radius:5px; cursor:pointer;">Add to cart</button>
    </div>
  `;
  modal.style.display = "flex";
}

function closeProductModal() {
  let modal = document.getElementById("productModal");
  if(modal) modal.style.display = "none";
}

let modalSlideIndex = 0;
function modalSlide(direction) {
  let slides = document.querySelectorAll(".modal-slide");
  if(slides.length === 0) return;
  modalSlideIndex = (modalSlideIndex + direction + slides.length) % slides.length;
  slides.forEach((img, idx) => {
    img.style.display = idx === modalSlideIndex ? 'block' : 'none';
  });
}

function filterProducts(cat,btn){
  document.querySelectorAll(".filters button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(cat==="all"?products:products.filter(p=>p.cat===cat));
}

function addToCart(id){
  cart.push(products.find(p=>p.id===id));
  save();
  openCart();
}

function save(){
  localStorage.setItem("haathse-cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  document.getElementById("cartCount").textContent=cart.length;
  let el=document.getElementById("cartItems");
  el.innerHTML=cart.length?cart.map((p,i)=>{
    let displayThumb = p.images ? `<img src="${p.images[0]}" style="width:100%; height:100%; object-fit:cover;">` : p.emoji;
    return `<div class="cart-item"><div class="mini" style="overflow:hidden; display:flex; align-items:center; justify-content:center;">${displayThumb}</div><div><b>${p.name}</b><p>₹${p.price}</p><button onclick="removeItem(${i})">Remove</button></div></div>`;
  }).join(""):"<p>Your cart is empty.</p>";
  document.getElementById("cartTotal").textContent="₹"+cart.reduce((s,p)=>s+p.price,0);
}

function removeItem(i){
  cart.splice(i,1);
  save();
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function openCart(){
  document.getElementById("cart").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function checkout(){
  if(!cart.length) return alert("Your cart is empty.");
  
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  
  if(!name || !email || !phone || !address){
    alert("Please fill in all the checkout details (Name, Email, Phone, Address).");
    return;
  }
  
  let total = cart.reduce((s,p)=>s+p.price,0);
  let itemsList = cart.map(i => `${i.name} (₹${i.price})`).join(", ");
  
  fetch("https://formspree.io/f/xkjgobvr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, address, items: itemsList, total: "₹" + total })
  }).catch(err => console.log(err));

  let orderText = `*New Order Received!*%0A%0A`;
  orderText += `*Name:* ${name}%0A`;
  orderText += `*Phone:* ${phone}%0A`;
  orderText += `*Email:* ${email}%0A`;
  orderText += `*Address:* ${address}%0A%0A`;
  orderText += `*Items:*%0A`;
  
  cart.forEach(item => {
    orderText += `- ${item.name} (₹${item.price})%0A`;
  });
  
  orderText += `%0A*Total Amount: ₹${total}*`;
  
  const whatsappNumber = "919204965346";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${orderText}`;
  
  window.open(whatsappURL, "_blank");
}

function submitCustom(e){
  e.preventDefault();
  
  const item = e.target.querySelector('[name="item"]').value.trim();
  const color = e.target.querySelector('[name="color"]').value.trim();
  const budget = e.target.querySelector('[name="budget"]').value.trim();
  const idea = e.target.querySelector('[name="idea"]').value.trim();
  
  if(!item || !idea){
    alert("Please fill in the required custom request details.");
    return;
  }
  
  // WhatsApp par custom request bhejna
  let customText = `*New Custom Design Request!*%0A%0A`;
  customText += `*What they want:* ${item}%0A`;
  customText += `*Base Color:* ${color || 'Not specified'}%0A`;
  customText += `*Budget:* ₹${budget || 'Not specified'}%0A`;
  customText += `*Design/Idea:* ${idea}%0A`;
  
  const whatsappNumber = "919204965346";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${customText}`;
  
  document.getElementById("customMsg").textContent="Thanks! Redirecting to WhatsApp to send your custom request...";
  
  setTimeout(() => {
    window.open(whatsappURL, "_blank");
    e.target.reset();
  }, 1000);
}


renderProducts();
renderCart();

