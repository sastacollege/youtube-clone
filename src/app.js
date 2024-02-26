import express from "express";
import cookie_parser from "cookie-parser";
import cors from "cors";

//APP
let app = express();

//CONFIG CORS USING MIDDLEWARE
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);
app.use(cookie_parser());

app.get((req, res) => {
  res.send("Hello");
});

//IMPORT ROUTE
import userRouter from "./routes/user.routes.js";

//ROUTE DECLARATION
app.use("/api/v1/users", userRouter);

//EXPORT APP
export default app;
