require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const Razorpay = require("razorpay");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "orders.json");
const razorpay = new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});

app.use(express.json({limit:"1mb"}));
app.use(express.static(__dirname));

function readOrders(){try{return JSON.parse(fs.readFileSync(DATA,"utf8"))}catch{return []}}
function writeOrders(o){fs.writeFileSync(DATA,JSON.stringify(o,null,2))}

app.post("/api/create-order", async (req,res)=>{
  try{
    const {amount,customer,items}=req.body;
    if(!amount || !customer?.name || !customer?.email || !customer?.phone || !customer?.address || !Array.isArray(items) || !items.length)
      return res.status(400).json({error:"Incomplete order details"});
    const order=await razorpay.orders.create({
      amount:Math.round(Number(amount)*100), currency:"INR",
      receipt:"HS_"+Date.now(), notes:{customer_name:customer.name}
    });
    const orders=readOrders();
    orders.push({orderId:order.id,amount:order.amount/100,currency:"INR",customer,items,status:"payment_pending",createdAt:new Date().toISOString()});
    writeOrders(orders);
    res.json({orderId:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID});
  }catch(e){console.error(e);res.status(500).json({error:"Unable to create Razorpay order"});}
});

app.post("/api/verify-payment",(req,res)=>{
  try{
    const {orderId,paymentId,signature}=req.body;
    const expected=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
      .update(orderId+"|"+paymentId).digest("hex");
    if(!signature || !crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(signature)))
      return res.status(400).json({error:"Invalid payment signature"});
    const orders=readOrders();
    const idx=orders.findIndex(o=>o.orderId===orderId);
    if(idx<0) return res.status(404).json({error:"Order not found"});
    orders[idx].status="paid"; orders[idx].paymentId=paymentId; orders[idx].paidAt=new Date().toISOString();
    writeOrders(orders);
    res.json({ok:true,orderId});
  }catch(e){console.error(e);res.status(500).json({error:"Payment verification failed"});}
});

app.get("/api/admin/orders",(req,res)=>{
  if(req.headers["x-admin-key"]!==process.env.ADMIN_KEY) return res.status(401).json({error:"Unauthorized"});
  res.json(readOrders().reverse());
});

app.get("/admin", (req,res)=>res.sendFile(path.join(__dirname,"admin.html")));

app.listen(PORT,()=>console.log(`the.mood_core running at http://localhost:${PORT}`));
