import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

import errorHandling from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.VITE_PORT || 3000;

/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', userRoutes);
app.use('/api', productRoutes);

app.use(errorHandling);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})