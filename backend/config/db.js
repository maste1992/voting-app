const mongoose =require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const connectDB = async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("mongodb connected successfully")
    } catch (error) {
       console.error("mongodb connection failed");
       console.error(error.message);             
    }
};
module.exports=connectDB;