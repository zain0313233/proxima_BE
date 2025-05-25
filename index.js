const express = require('express');
const cors = require('cors');
require('dotenv').config();
 

const app= express();
app.use(express.json());
app.use("/api/health",(req ,res)=>{
    res.status(200).json({
        status: "ok",
        message: "Server is running"
    });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
module.exports = app;