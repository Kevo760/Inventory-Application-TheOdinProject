const asyncHandler = require("express-async-handler");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require( "firebase/storage");
const {initializeApp} = require("firebase/app");
const app = require('../config/firebase.config');
const multer = require('multer');

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}
const upload = multer({storage: multer.memoryStorage()});

initializeApp(app);


exports.create_get = (req, res, next) => {
    res.render("test_upload", { title: "test" });
};

exports.create_post = [
upload.single('image'),

asyncHandler( async (req, res, next) => {
    const storage = getStorage();

    try {
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, dateTime);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log(req.file.mimetype)

        console.log(downloadURL);
        res.redirect('/')
    } catch (error) {
        return res.status(400).send(error.message)
    }
})
]