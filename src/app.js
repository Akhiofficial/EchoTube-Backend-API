import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // * represent Allow all origins by default
    credentials: true, // Allow credentials if needed

}));

//for json parsing
app.use(express.json({limit: '10kb'})); // Increase the limit to 10kb

// for urlencoded data parsing
app.use(express.urlencoded({
    extended: true,
    limit: '10kb' // Increase the limit to 10kb
}))

// for pdf image etc parsing
app.use(express.static('public')); // Serve static files from the 'public' directory

// for cookie parsing to access cookies in request 
app.use(cookieParser());


export default app;