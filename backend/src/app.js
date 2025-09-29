import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: (process.env.DEV || "http://localhost:5000").split(","),
    credentials: true,
  })
);

app.listen(PORT, () => {
    console.log(`Server run on PORT : ${PORT}`)
    console.log(`Protected cors use only : ${process.env.DEV}`)
    
});


