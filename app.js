
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const port = 3000;
const app = express();

const publicPath = './public';
const uploadsPath = publicPath + '/uploads/';
const upload = multer({ dest: uploadsPath });

const uploaded_files = [];

app.use(express.static(publicPath));
app.use(express.static(uploadsPath));

const html = {
    head: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>My Kenziegram</title>
            <link rel="stylesheet" href="./style.css">
        </head>
    `,
    bodyHeader: `
        <body>
            <div id="titleBox">
                <h1 id="title">Welcome to Kenziegram!</h1>
            </div>
    `,
    form: `
            <form action="http://localhost:3000/uploads" method="post" enctype="multipart/form-data">
                <div>
                <label for="file">Choose a File</label>
                <!-- <input type="file" id="file" name="myFile"> -->
                <input type="file" id="file" name="myFile">
              
                
                <!-- <input type="file" name="file" id="file" accept="image/*" multiple> -->
                </div>
                <div>
                <button>Send the file</button>
                </div>
            </form>
            <div id="gallery">
    
    `,
    foot: `
           
            </div>
            <script src="./index.js"></script>
        </body>
        </html>
    `,
}


const html2 = {
    head: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>My Kenziegram</title>
            <link rel="stylesheet" href="./style.css">
        </head>
    `,
    bodyHeader: `
        <body>
            <h1>You uploaded this image!</h1>
          
    `,
    body: `
        
        <div id="confirmPage">
            <a href="/">Return</a>
        </div>
    `,
    foot: `
        <script src="./index.js"></script>
        </body>
        </html>
    `,
}


app.get('/', (req, res) => {
    fs.readdir(uploadsPath, function (err, items) {
        console.log(items);
        let htmlImageGallery = ``;
        for (let i = 0; i < items.length; i++) {
            htmlImageGallery += `<img src="${ items[i] }">`;
        }

        const htmlOutput = 
            html.head + 
            html.bodyHeader + 
            html.form + 
            htmlImageGallery + 
            html.foot;
        res.send(htmlOutput);
    });
});


app.post('/uploads', upload.single('myFile'), function (req, res, next) {
    let returnButton = '<a href="/">Return</a>';
    // req.file is the `myFile` file?
    let newImage = `<img src="${req.file.filename}"  id="newImage">`;    
    console.log(`Uploaded: ${req.file.filename}`); 
    console.log(req);   
    uploaded_files.push(req.file.filename);

    const htmlConfirm = 
            html2.head + 
            html2.bodyHeader + 
            returnButton + 
            newImage + 
            html2.foot;
    res.end(htmlConfirm);        
});


app.listen(port);
