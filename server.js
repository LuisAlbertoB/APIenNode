const express = require("express");
const cors = require("cors")
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dbConfig = require("./src/config/db.config")
const rateLimit = require("express-rate-limit");
const app = express();


const accountLimiter = rateLimit({
    windowMs: 60  * 1000, // 1 minuto
    max: 5, 
    message: "Demasiadas peticiones realizadas, intenta despues de 1 hora"
}); 


let corsOption = {
    origin: ["http://localhost:3000", "http://187.244.120.3:3000", "http://34.203.125.206:3030"]
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(accountLimiter);

const db = require("./src/models");
const Role = db.role;


db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
.then(() => {
    console.log("Exito al conectar con mongo db");
    initial();
})
    .catch(err => {
    console.error("error al conectar", err);
    process.exit();
});

app.get("/", (req,res)=>{
    res.json({message:"ApiProyectoIntegrador"})
})


require('./src/routers/auth.routes')(app);
require('./src/routers/user.routes')(app);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto: ${PORT}.`);
});

async function initial() {
    try{
      const count = await Role.estimatedDocumentCount();
      if(count === 0){
        await Promise.all([
          new Role({name: "user"}).save(),
          new Role({name: "admin"}).save()
        ])
        console.log("Roles activados e iniciados");
      }
      }catch (error){
        console.error("error al iniciar los roles checalo",error);
  }
  
  }

  const upload = multer({ dest: 'uploads/' });


