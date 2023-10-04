const express =require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')
const mongoose =require('mongoose')
const PORT =process.env.PORT || 3000 ;
const url = process.env.API // Replace with your MongoDB server URL and database name
const admin = require("./routes/Admin");
const fileUpload = require('express-fileupload');


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
mongoose.connect(url, options)
  .then(() => {
    console.log("Connected to MongoDB");
  
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


app.use("/api/v1", admin);

app.listen(3000,()=>{
    console.log('Running......');
})