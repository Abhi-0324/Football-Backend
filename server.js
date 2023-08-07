import express from 'express'
import cors from 'cors'
import colors from 'colors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import database from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import multer from 'multer' 

const app = express();


dotenv.config();

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json())
app.use(express.json());

//connect to database
database();

//listen server
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    try {
        console.log('Server running on PORT '.bgGreen.white, PORT);
    } catch (error) {
        console.log('Failed to start server')
    }
})

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/auth', authRoutes);
app.use('/match', matchRoutes);
app.use('/player', playerRoutes)
app.use('/team', teamRoutes)
app.use('/tournament', tournamentRoutes)