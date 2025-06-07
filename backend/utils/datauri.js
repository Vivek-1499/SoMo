import DataURIParser from 'datauri/parser.js';
import path from 'path';

const parser = new DataURIParser();

const getDataUri = (file) =>{
  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer).content;
}

export default getDataUri;


//This getDataUri function is a utility that converts a file buffer to a Data URI string, which is often used to embed files (like images) directly as Base64-encoded strings in HTML, CSS, or to upload to cloud services (like Cloudinary).
