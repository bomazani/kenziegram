
// Applies the required modules. 
const express = require('express');
const multer = require('multer');
const fs = require('fs');

// *?* Instructs multer to place uploaded folders into public/uploads folder.
const upload = multer({ dest: 'public/uploads' });

// creates a variable named 'port' with a value of '3000',
// so we can easily change the port ID#.
const port = 3000;

// *?* creates a variable named 'app'...that...kind of "activates" express???
const app = express();

// creates variables named 'publicPath' & 'uploadsPath',
// so we can easily change the paths.
const publicPath = './public';
const uploadsPath = publicPath + '/uploads/';

// creates an empty array to hold the uploaded files.
const uploaded_files = [];

// *?* introduces our paths to express???
app.use(express.static(publicPath));
app.use(express.static(uploadsPath));

// creates an object named 'html' that holds our html code
// in various keys (head, bodyHeader, form, foot)
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
            <h1>Welcome to Kenziegram!</h1>
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
    `,
    foot: `
        <script src="./index.js"></script>
        </body>
        </html>
    `,
}

// *** I created this object in an attempt to add a return button and
// confirmation image to the /uploads screen... 
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
            <h1>You uploaded an image!</h1>
          
    `,
    body: `
        
        <div>
            <a href="/">Return</a>
        </div>
    `,
    foot: `
        <script src="./index.js"></script>
        </body>
        </html>
    `,
}


// When the user submits a 'get' request to '/'...
app.get('/', (req, res) => {
    // access files at ./public/uploads/,
    // those files will be assigned a variable of 'items' 
    // callback function...???if error return err, otherwise return 'items'??? 
    fs.readdir(uploadsPath, function (err, items) {
        console.log(items);
        // creates an empty string called 'htmlImageGallery'
        let htmlImageGallery = ``;
        // for loop that cycles through the items found in ./public/uploads/
        for (let i = 0; i < items.length; i++) {
            // adds each item to the string 'htmlImageGallery'
            htmlImageGallery += `<img src="${ items[i] }">`;
        }


// creates a variable named 'htmlOutput' 
        const htmlOutput = 
        // adds html.head, html.bodyHeader, html.form to the variable...
            html.head + 
            html.bodyHeader + 
            html.form + 
        // adds the string of image (names) to the variable...
            htmlImageGallery + 
        // adds html.foot to the variable.
            html.foot;

        // console.log("code that will run in node, instead of in the browser")

        // sends the variable (object?) back to the client.
        res.send(htmlOutput);
    });
});

// When user submits a 'post' request to '/uploads'...
// upload the single posted file, followed by a callback function...
app.post('/uploads', upload.single('myFile'), function (req, res, next) {
    // creates a variable 'returnButton' that contains html code for a return button. 
    let returnButton = '<a href="/">Return</a>';
    // creates a variable 'newImage' that contains html code & the posted image (name).
    let newImage = `<img src="${req.file.filename}">`;
    // req.file is the `myFile` file
    // req.body will hold the text fields, if there are any

    console.log("Uploaded: " + req.file.filename);
    // console.log(`Uploaded: ${req.file.filename}`; 
    
    // adds the new posted image (name) to the 'uploaded_files' array.
    uploaded_files.push(req.file.filename);

    
    // creates a variable named 'htmlConfirm'
    const htmlConfirm = 
        // adds html.head, html.bodyHeader to the variable...
            html2.head + 
            html2.bodyHeader + 
        // adds a return button to the variable...
            returnButton + 
            // redundant... adds a duplicate return button.
            html2.body +

        // adds the newImage (name) to the variable...
            newImage + 
        // adds html.foot to the variable.
            html2.foot;

    res.end(htmlConfirm);        
    // res.end(`Uploaded file!  ${req.file.filename}`);
});


// Starts listening to the 'port' which we assigned '3000'.
app.listen(port);
