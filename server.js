import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

import productRoutes from './routes/productRoutes.js';
import pool from './config/db.js';

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

app.get('/api/userData', (req, res) => {
    console.log('Test API data')
    pool.query('SELECT * FROM public."userTable"')
        .then(userData => {
            res.send(userData.rows)
        })
})

app.get('/api/products', (req, res) => {
    pool.query('SELECT * FROM public."productsTable"').then((productsData) => {
        res.send(productsData.rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})