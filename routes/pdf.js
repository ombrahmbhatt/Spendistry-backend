const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();


//get a new PDF file
// router.get('/', (req, res) => {
//     res.download('upload/pdf/invoice.pdf');
// });

//create a new PDF file inside upload/pdf folder
router.get('/', async (req, res) => {
    doc.pipe(fs.createWriteStream('upload/pdf/invoice.pdf'));
    doc.pipe(res);
    doc.text('Hello Om');
    doc.end();
    res.download('upload/pdf/invoice.pdf');
    // delete pdf file after download
    fs.unlink('upload/pdf/invoice.pdf', (err) => {
        if (err) throw err;
        console.log('successfully deleted');
    })
});



module.exports = router;