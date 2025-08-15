import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import errorHandling from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow browser to send cookies
  })
);

app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api", productRoutes);

app.use('/', (req, res) => {
  res.send(`Server is running on port ${PORT}`)
})

app.use(errorHandling);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})