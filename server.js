import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})