import dotenv from "dotenv";
import dataBaseConnection from "./db/db.js";
import app from "./app.js";

//ENVIRONMENT VARIABLE CONFIGURATION
dotenv.config({
  path: "./../.env",
});

//DATABASE CONBNECTION
dataBaseConnection()
  .then(() => console.log("DB CONNECTED SUCCESSFULLY ✔✔✔"))
  .catch(() => {
    console.log("FAILED TO CONNECT DATABASE");
  });

//listen
app.listen(process.env.PORT, () => {
  console.log(`app is listening at port ${process.env.PORT}`);
});
