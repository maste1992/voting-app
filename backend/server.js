const express=require('express');
const app=express();
const dotenv=require('dotenv');

dotenv.config();

//listen the app
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`)
})
