const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
.then(() => {console.log("connected to db")})
.catch((err) => console.log(err));      

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6745e9abf302e34981b1ba6b"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};


initDb();