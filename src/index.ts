import {connectDatabase} from './config';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

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


