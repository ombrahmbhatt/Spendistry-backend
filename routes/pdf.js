const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');



//get a new PDF file
// router.get('/', (req, res) => {
//     res.download('upload/pdf/invoice.pdf');
// });

//create a new PDF file inside upload/pdf folder
// router.get('/',  (req, res) => {
//     doc.pipe(fs.createWriteStream('upload/pdf/invoice.pdf'));
//     doc.pipe(res);
//     doc.text('Hello Om');
//     doc.end();
//     // delete pdf file after download
    
//     // fs.unlink('upload/pdf/invoice.pdf', (err) => {
//     //     // if (err) throw err;
//     //     console.log('successfully deleted');
//     // })
    
    
// });

//creat a new PDF file inside upload/pdf folder
// router.get('/',  (req, res) => {
//     try {
//         const doc = new PDFDocument();
//         res.setHeader('Content-disposition', 'attachment; filename=invoice.pdf');
//         doc.pipe(res);
//         doc.text('Hello Om2');
//         doc.end();
        
//     } catch (error) {
//         console.log(error);
//     }
// });

//create a pdf for a specific invoice
router.get('/:userId/:vendorId/:invoiceId', async (req, res) => {
    try {

        const invoice = await Invoice.aggregate([
            {$match: {_id: req.params.userId}},
            {$unwind: '$businessName'},
            {$match: {"businessName._id": req.params.vendorId}},
            {$unwind: "$businessName.invoices"},
            {$match: {"businessName.invoices._id": mongoose.Types.ObjectId(req.params.invoiceId) }},
            {$project: {
                "invoices": "$businessName.invoices",
            }}
           

        ]).then(invoice => {
        
        // calling the function to create a pdf file
        const doc = new PDFDocument({
            size: 'A5',
            // margin: 50
        });

        // setting the header and sending the pdf file
        res.setHeader('Content-disposition', 'attachment; filename='+req.params.vendorId+"_"+Date.now()+'.pdf');
        doc.pipe(res);

        //setting meta data of the pdf file
        doc.info['Title'] = 'Invoice';
        doc.info['Author'] = req.params.vendorId;
        doc.info['Subject'] = 'Invoice';

        //title of the pdf file
        doc.fontSize(25).text(invoice[0].invoices.invoiceTitle.toUpperCase(), {
            underline: true
        });

        //business address
        doc.fontSize(12).text(invoice[0].invoices.businessAddress);

        
      //city in upper case
      const city = invoice[0].invoices.city.toUpperCase();

        //subject to jurisdiction
        doc.fontSize(12).text('SUBJECT TO '+city+' JURISDICTION ONLY');

        //GST number
        doc.fontSize(12).text('GST NO:'+invoice[0].invoices.gstNumber);

        //vendor id
        doc.fontSize(12).text('VENDOR ID:'+req.params.vendorId);

        //business contact number
        doc.fontSize(12).text('CONTACT NO:'+invoice[0].invoices.businessContactNo);

        //convert unix time to date
        const uxixDate = new Date(invoice[0].invoices.invoiceTime);
        const date = new Date(uxixDate * 1000);


        const dateString = date.toLocaleDateString();


        //invoice date and time
        doc.fontSize(12).text('INVOICE DATE:'+dateString);

        //user ID 
        doc.fontSize(12).text('USER ID:'+req.params.userId);

        //Invoice number
        doc.fontSize(12).text('INVOICE NO:'+invoice[0].invoices.invoiceNumber);

        //create a table of invoiceTotalItems
        // doc.fontSize(12).table().unstyled().body([
        //     ['ITEM', 'QUANTITY', 'UNIT PRICE', 'AMOUNT']
        // ])

        // //create a table of invoiceTotalItems
        // doc.fontSize(12).table().unstyled().body(invoice[0].invoices.invoiceTotalItems.map(item => [
        //     item.itemName,
        //     item.quantity,
        //     item.price,
        //     item.total
        // ]));

        // create a tabel of invoiceTotalItems
        // doc.table({
        //      headers: ['ITEM', 'QUANTITY', 'UNIT PRICE', 'AMOUNT']

        // }).body(invoice[0].invoices.invoiceTotalItems.map(item => [
        //     item.itemName,
        //     item.quantity,
        //     item.price,
        //     item.total
        // ]));

        //an array of item, quantity, unit price and amount
        // const invoiceTotalItems = invoice[0].invoices.invoiceTotalItems.map(item => [
        //     item.itemName,
        //     item.quantity,
        //     item.price,
        //     item.total
        //     ]);

        

        // [[item, quantity, price, amount],[item, ....],[],[]]
        // const invoiceTotalItemsArray = invoiceTotalItems.map(item => [
        //     item.itemName,
        //     item.quantity,
        //     item.price,
        //     item.total
        // ]);

        // console.log(invoiceTotalItems);

        
    //   const invoiceItems =   invoice[0].invoices.invoiceTotalitems.map(item => {
    //     // doc.text("name: "+item.itemName);
    //     // doc.text("qnt"+item.quantity);
    //     // doc.text("price"+item.price);
    //     // doc.text("total"+item.total);

    //     item.itemName,
    //     item.quantity,
    //     item.price,
    //     item.total

    // });
    
        const table = {
            // headers: ['itemName', 'quantity', 'price', 'total'],
            headers: [
                {label: 'itemName', width: 100, property: 'itemName'},
                {label: 'quantity', width: 100, property: 'quantity'},
                {label: 'price', width: 100, property: 'price'},
                {label: 'total', width: 100, property: 'total'}
            ],
            datas:[
                {itemName: 'itemName', quantity: 'quantity', price: 'price', total: 'total', id: "om"},
                {itemName: 'itemName', quantity: 'quantity', price: 'price', total: 'total'},
                {itemName: 'itemName', quantity: 'quantity', price: 'price', total: 'total'},
                {itemName: 'itemName', quantity: 'quantity', price: 'price', total: 'total'},
            ]
        }

        doc.table(table);

        console.log(invoice[0].invoices.invoiceTotalItems);


        

        //total amount
        doc.fontSize(12).text('TOTAL AMOUNT:'+invoice[0].invoices.invoiceAmount);

        //all kind of gst 
        doc.fontSize(12).text('IGST'+invoice[0].invoices.invoiceIGST);
        doc.fontSize(12).text('CGST'+invoice[0].invoices.invoiceCGST);
        doc.fontSize(12).text('SGST'+invoice[0].invoices.invoiceSGST);
        doc.fontSize(12).text('UTGST'+invoice[0].invoices.invoiceUTGST);

        //discount
        doc.fontSize(12).text('DISCOUNT:'+invoice[0].invoices.discount);

        //payment method
        doc.fontSize(12).text('PAYMENT METHOD:'+invoice[0].invoices.invoicePaymentMode);

        //net total (roundoff)
        doc.fontSize(12).text('NET TOTAL:'+invoice[0].invoices.roundoff);
        
        //invoice description
        doc.fontSize(12).text('INVOICE DESCRIPTION:'+invoice[0].invoices.invoiceDescription);


        // doc.text('Hello Om');
        // doc.text('Invoice Number: '+invoice[0].invoices.invoiceNumber);
        // doc.text('reason'+invoice[0].invoices.reportReason);

    


        doc.end();

        });
       
        
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;