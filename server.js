import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import { Pool } from 'pg';

import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'customerFeedbackPortal',
    password: 'postgres',
    dialect: 'postgres',
    port: 5432
})

/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error('Error executing client', err.stack)
        }
        console.log('Connected to Database !')
    })
})

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/api', (req, res, next) => {
    console.log('Test API data')
    pool.query('SELECT * FROM userTable')
        .then(userData => {
            console.log(userData);
            res.send(userData.rows)
        })
})

app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})