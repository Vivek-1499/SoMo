import {v2 as cloudinary } from 'cloudinary';   //getting v2 from cloudinary and changing it's name as cloudinary
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;