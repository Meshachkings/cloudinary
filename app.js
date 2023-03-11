const express = require('express');
const multer  = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config()

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const PORT = process.env.PORT || 3000

// configure cloudinary
cloudinary.config({
    cloud_name: "dujux4xcs",
    api_key: "781979772451722",
    api_secret: "MGyuZeAAZpxu0_8EKpVl2owFonY"
});

// configure multer
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });
const upload = multer({ storage });

// handle file upload
app.post("/images", upload.array("pictures", 10), async (req, res) => {
    try {
      let pictureFiles = req.files;
      //Check if files exist
      if (!pictureFiles)
        return res.status(400).json({ message: "No picture attached!" });
      //map through images and create a promise array using cloudinary upload function
      let multiplePicturePromise = pictureFiles.map((picture) =>
        cloudinary.uploader.upload(picture.path)
      );
      // await all the cloudinary upload functions in promise.all, exactly where the magic happens
      let imageResponses = await Promise.all(multiplePicturePromise);
      res.status(200).json({ images: imageResponses });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });

app.listen(PORT, () => {
  console.log('Server started on port 3000.');
});