const express =require('express');
const app = express();
require("dotenv").config();
const cors = require("cors")
const mongoose =require('mongoose')
const PORT =3000 ;
const url = process.env.API 
const fileUpload = require('express-fileupload');
const admin = require("./routes/Admin");
const student=require('./routes/Student')
const auth =require('./routes/Auth')
const faculty=require('./routes/Faculty')
app.use(
  cors({
    // origin: "https://mastercode.netlify.app",
    origin: "http://localhost:5173",
    methods: ["POST", "GET","DELETE","PUT"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
  })
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);

mongoose.connect(url,options)
  .then(() => {
    console.log("Connected to MongoDB");
  
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


app.use("/api/v1",admin);
app.use("/api/v2",student);
app.use("/api/v3",auth)
app.use("/api/v4",faculty)

app.listen(PORT,()=>{
    console.log('Running......',PORT);
})