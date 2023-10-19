const express =require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')
const mongoose =require('mongoose')
const PORT =process.env.PORT || 3000 ;
// const url = process.env.API 
const fileUpload = require('express-fileupload');
const admin = require("./routes/Admin");
const student=require('./routes/Student')
const auth =require('./routes/Auth')

app.use(
  cors({
    origin: "*",
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
const url =
  "mongodb+srv://connectitdept:x2FnvrxDpPLhLaUe@cluster0.zpkisx0.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, options)
  .then(() => {
    console.log("Connected to MongoDB");
  
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


app.use("/api/v1", admin);
app.use("/api/v2",student);
app.use("/api/v3",auth)

app.listen(3000,()=>{
    console.log('Running......');
})