const mongoose = require("mongoose");
const initdata = require("./data.js")
const Listing = require("../models/listing.js");

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(()=>{
    console.log("connected to Dbs");
})    
.catch((err)=>{
    console.log(err);
})

const initDB = async()=>{
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=>({
    ...obj,
    owner:"69774c3c1b64af5f4a8cc0f1",
  }));
  await Listing.insertMany(initdata.data);
  console.log("data was initilized");
}
initDB();