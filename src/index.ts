import {connectDatabase} from './config';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await connectDatabase();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});


