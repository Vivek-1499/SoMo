import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import { Socket } from 'socket.io';
import http from 'http';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js'

dotenv.config({})
const PORT =  process.env.PORT || 3000;

const app = express();

app.get("/", (req, res)=>{
  return res.status(200).json({
    message: "Yo, i'm seeing you from backend",
    success: true
  })
})
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));

const corsOption ={
  origin : 'http://localhost/5173',
  credentials : true
}
app.use(cors(corsOption));

//APi
app.use('/api/v2/user', userRoute);  //create routes so https://localhost/8000 and whatever router
app.use('/api/v2/post', postRoute);
app.use('/api/v2/message', messageRoute);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
});
