import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js'
import { app, server } from './socket/socket.js';

dotenv.config({})
const PORT =  process.env.PORT || 3000;


app.get("/", (req, res)=>{
  return res.status(200).json({
    message: "Yo, i'm seeing you from backend",
    success: true
  })
})
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",                      // for local dev
  "https://your-frontend.vercel.app"           // for production - replace with actual Vercel domain
];


const corsOption = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  credentials: true,
};
app.use(cors(corsOption));

//APi
app.use('/api/v2/user', userRoute);  //create routes so https://localhost/8000 and whatever router
app.use('/api/v2/post', postRoute);
app.use('/api/v2/message', messageRoute);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
});
