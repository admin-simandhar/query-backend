const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs");
const mysql = require("mysql");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
const Buffer = require("buffer");
const { file } = require("pdfkit");
// const pool=createPool({
//     host: "127.0.0.1",
//     port: 3036,
//     user: "admin_simandhar_internal",
//     password: "Jw224j$z",
//     database: "simandhar_internal_db",
//     connectionLimit:10,

// })

// pool.query('/',(err,result)=>{
//     if(err){
//         return console.log(err)
//     }
//     return console.log("Connected to Database")
//user: "admin_simandhar_internal",
//password: "Jw224j$z",
// })
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "test",
  password: "",
  database: "simandhar_internal_db",
});

db.connect(function (err) {
  if (err) {
    console.log("Error connecting to Db" + err.stack);
    return;
  }
  console.log("Connection established");
});

app.listen(process.env.PORT || 5000);

// const AWSCredentials = {
//     accessKey: 'AKIA36ASJN7RA3D6VGJ4',
//     secret: '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',
//     bucketName: 'simandhar-edu-assets/Evaluations'
// };

// const s3 = new AWS.S3({
//     accessKeyId: AWSCredentials.accessKey,
//     secretAccessKey: AWSCredentials.secret
// });

app.post("/query/", async (request, response) => {
  const { fullname, emailaddress, phonenumber, course, media, textvalue } =
    request.body;

  AWS.config.update({
    accessKeyId: "AKIA36ASJN7RA3D6VGJ4", // Access key ID
    secretAccesskey: "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", // Secret access key
    region: "ap-south-1", //Region
  });

  let params = {
    Bucket: "simandhar-edu-assets/Evaluations",
    ACL: "public-read",
    Body: media,
    Key: media.name,
  }; 
 

    const S3_BUCKET ='simandhar-edu-assets/Evaluations';
  const REGION ='ap-south-1';
  const myBucket = new AWS.S3({
   params: { Bucket: S3_BUCKET},
 region: REGION,
 }) 

   myBucket.putObject(params)
    //   .on('httpUploadProgress', (evt) => {
    //       setProgress(Math.round((evt.loaded / evt.total) * 100))
          
    //   })
      .send((err) => {
          if (err) console.log(err)
      })

     



  // const s3 = new AWS.S3();

  // Binary data base64
  // const fileContent  = Buffer.from(request.files.media, 'binary');

  // Setting up S3 upload parameters
  // const params = {
  //     Bucket: 'simandhar-edu-assets/Evaluations',
  //     Key: fileContent.media, // File name you want to save as in S3
  //     Body: fileContent
  // };
  // s3.upload(params, function(err, media) {
  //     if (err) {
  //         throw err;
  //     }
  //     res.send({
  //         "response_code": 200,
  //         "response_message": "Success",
  //         "response_data": media
  //     });
  // });

  //   const uploadToS3 = (media) => {
  //     // Read content from the file
  //     const fileContent = fs.readFileSync(media);

  //     // Setting up S3 upload parameters
  //     const params = {
  //         Bucket: AWSCredentials.bucketName,
  //         Key: media,
  //         Body: fileContent
  //     };

  //     // Uploading files to the bucket
  //     s3.upload(params, function(err, data) {
  //         if (err) {
  //             throw err;
  //         }
  //         console.log(`File uploaded successfully. ${data.Location}`);
  //     });
  // };

  // uploadToS3(`${media}`);

  const addUserQuery = `
        INSERT INTO query_page( fullname,emailaddress,phonenumber,course,image,textvalue)
        VALUES(
            '${fullname},
            '${emailaddress}',
            '${phonenumber}',
            '${course}',
            '${media.location}',
            '${textvalue}'
        );
      `;
  const dbResponse = await db.run(addUserQuery);
  response.send("New Query Created");
  response.status(200);
});
