import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../config/.env') });
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dd1gyzzib',
  api_key: '645815824983961',
  api_secret: 'i5N2UbUQIKIrpb77qaB3hzOzH2E',
  secure: true,
});

export default cloudinary.v2;
