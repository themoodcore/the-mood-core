const products=[
{id:1,name:"Wildflower Tote",cat:"bags",price:149,emoji:"🌼",class:"p1",desc:"Hand-painted canvas tote"},
{id:2,name:"Leaf Stitch Tee",cat:"tees",price:149,emoji:"🌿",class:"p2",desc:"Hand-stitched cotton tee"},
{id:3,name:"Sunset Doodle Bag",cat:"bags",price:149,emoji:"🌅",class:"p3",desc:"Original painted artwork"},
{id:4,name:"Floral Thread Tee",cat:"tees",price:149,emoji:"🌸",class:"p4",desc:"Thread embroidery detail"},
{id:5,name:"Mini Art Pouch",cat:"gifts",price:149,emoji:"🎨",class:"p5",desc:"Tiny handmade zipper pouch"},
{id:6,name:"Custom Gift Box",cat:"gifts",price:149,emoji:"🎁",class:"p6",desc:"Curated handmade gift set"},
{id:7,name:"03 Number Black Tee",cat:"tees",price:149,images:["Tshirt-both.webp","tshirt-front.webp","tshirt-back.webp"],desc:"Stylish front and back print tee"}
];

let cart=JSON.parse(localStorage.getItem("haathse-cart")||"[]");

function renderProducts(list=products){
  document.getElementById("products").innerHTML=list.map(p=>`<article class="card"><div class="photo ${p.class}">${p.emoji}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div><button onclick="addToCart(${p.id})">Add to cart</button></article>`).join("");
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
  el.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><div class="mini">${p.emoji}</div><div><b>${p.name}</b><p>₹${p.price}</p><button onclick="removeItem(${i})">Remove</button></div></div>`).join(""):"<p>Your cart is empty.</p>";
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
  
  // 1. Formspree ke zariye Email bhejna
  fetch("https://formspree.io/f/xkjgobvr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, address, items: itemsList, total: "₹" + total })
  }).catch(err => console.log(err));

  // 2. WhatsApp par order message bhejna
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
  document.getElementById("customMsg").textContent="Thanks! Your custom request has been saved. We'll contact you shortly.";
  e.target.reset();
}

renderProducts();
renderCart();
