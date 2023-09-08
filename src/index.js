const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route")
const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://Bhavi:Bhavi123@cluster1.yydegcy.mongodb.net/triveousAssignment", 
{useNewUrlParser:true})
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err))
app.use("/",route)
app.listen(3000, ()=>console.log("Express app running on port 3000"))