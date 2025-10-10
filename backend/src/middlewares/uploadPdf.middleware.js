import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../lib/cloudinary.js';

//Cloudinary Storage Config PDF
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uninote/sheets",
    allowed_formats: ["pdf"],
    resource_type: "raw", //pdf ใช้ raw
    public_id: (req, file) => {
      
        //สร้างชื่อไฟล์ timestamp-originalname
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, ""); 
      return `${timestamp}-${originalName}`;
    },
  },
});

//File filter PDF
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, //50MB 
  },
});

export default uploadPdf;