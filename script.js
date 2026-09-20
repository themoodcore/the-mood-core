const products=[
{id:1,name:"Wildflower Tote",cat:"bags",price:149,emoji:"🌼",class:"p1",desc:"Hand-painted canvas tote"},
{id:2,name:"Leaf Stitch Tee",cat:"tees",price:149,emoji:"🌿",class:"p2",desc:"Hand-stitched cotton tee"},
{id:3,name:"Sunset Doodle Bag",cat:"bags",price:149,emoji:"🌅",class:"p3",desc:"Original painted artwork"},
{id:4,name:"Floral Thread Tee",cat:"tees",price:149,emoji:"🌸",class:"p4",desc:"Thread embroidery detail"},
{id:5,name:"Mini Art Pouch",cat:"gifts",price:149,emoji:"🎨",class:"p5",desc:"Tiny handmade zipper pouch"},
{id:6,name:"Custom Gift Box",cat:"gifts",price:149,emoji:"🎁",class:"p6",desc:"Curated handmade gift set"}];
let cart=JSON.parse(localStorage.getItem("the.mood_core-cart")||"[]");

function renderProducts(list=products){document.getElementById("products").innerHTML=list.map(p=>`<article class="card"><div class="photo ${p.class}">${p.emoji}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div><button onclick="addToCart(${p.id})">Add to cart</button></article>`).join("")}
function filterProducts(cat,btn){document.querySelectorAll(".filters button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderProducts(cat==="all"?products:products.filter(p=>p.cat===cat))}
function addToCart(id){cart.push(products.find(p=>p.id===id));save();openCart()}
function save(){localStorage.setItem("the.mood_core-cart",JSON.stringify(cart));renderCart()}
function renderCart(){document.getElementById("cartCount").textContent=cart.length;let el=document.getElementById("cartItems");el.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><div class="mini">${p.emoji}</div><div><b>${p.name}</b><p>₹${p.price}</p><button onclick="removeItem(${i})">Remove</button></div></div>`).join(""):"<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent="₹"+cart.reduce((s,p)=>s+p.price,0)}
function removeItem(i){cart.splice(i,1);save()}
function toggleCart(){document.getElementById("cart").classList.toggle("open");document.getElementById("overlay").classList.toggle("show")}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
async function checkout(){
  if(!cart.length) return alert("Your cart is empty.");
  const name=document.getElementById("customerName").value.trim();
  const email=document.getElementById("customerEmail").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const address=document.getElementById("customerAddress").value.trim();
  if(!name||!email||!phone||!address) return alert("Please fill in all delivery details.");

  const amount=cart.reduce((s,p)=>s+p.price,0);
  try{
    const r=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({amount,customer:{name,email,phone,address},items:cart})});
    const data=await r.json();
    if(!r.ok) throw new Error(data.error||"Could not create payment order");

    const options={
      key:data.keyId, amount:data.amount, currency:"INR", order_id:data.orderId,
      name:"the.mood_core", description:"Handmade order",
      prefill:{name,email,contact:phone},
      theme:{color:"#c95f3d"},
      handler:async function(response){
        const vr=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({orderId:data.orderId,paymentId:response.razorpay_payment_id,signature:response.razorpay_signature})});
        const result=await vr.json();
        if(!vr.ok) return alert(result.error||"Payment verification failed.");
        cart=[]; save(); toggleCart();
        document.getElementById("orderStatus").innerHTML="<div><b>Payment successful 🎉</b><br>Order "+result.orderId+" received. We'll start making it soon.</div>";
        window.scrollTo({top:document.getElementById("orderStatus").offsetTop-80,behavior:"smooth"});
      },
      modal:{ondismiss:function(){console.log("Razorpay checkout closed");}}
    };
    new Razorpay(options).open();
  }catch(e){alert(e.message);}
}
function submitCustom(e){e.preventDefault();document.getElementById("customMsg").textContent="Thanks! Your custom request has been saved for this demo. We'll contact you for details.";e.target.reset()}
renderProducts();renderCart();
