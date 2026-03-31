import express from 'express';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import featureRoutes from './routes/feature.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


app.use('/api/features', featureRoutes);


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} 🚀`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err.message);
    });