const express = require('express');
const app = express();
const Return = require('../models/return');

//getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const returnData = await Return.find();
    res.json(returnData);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//getting one
router.get('/:id', getReturn, (req, res) => {
    // res.send(`getting user ${req.params.id}`);
    res.json(res.return);
});

//creating one
router.post('/', async (req, res) => {
    // res.send('creating a user');
    const returnData = new Return({
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        invoiceAmount: req.body.invoiceAmount,
        invoiceStatus: req.body.invoiceStatus,
        invoiceTitle: req.body.invoiceTitle,
        invoiceTotalitems: req.body.invoiceTotalitems,
        invoiceIGST: req.body.invoiceIGST,
        invoiceCGST: req.body.invoiceCGST,
        invoiceSGST: req.body.invoiceSGST,
        invoiceUTGST: req.body.invoiceUTGST,
        invoiceSentTo: req.body.invoiceSentTo,
        invoiceSentBy: req.body.invoiceSentBy,
        invoicePaymentMode: req.body.invoicePaymentMode,
        invoicePDF: req.body.invoicePDF,
        invoiceReport: req.body.invoiceReport,
        invoiceTime : req.body.invoiceTime,
        discount : req.body.discount,
        roundoff : req.body.roundoff,
        extra1 : req.body.extra1,
        extra2 : req.body.extra2,
        extra3 : req.body.extra3,
        extra4 : req.body.extra4,
        extra5 : req.body.extra5
    });
    try{
        const savedReturn = await returnData.save();
        res.status(201).json(savedReturn);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// updating one
router.patch('/:id', getReturn, async (req, res) => {
    // res.send(`updating user ${req.params.id}`);
    if(req.body.invoiceNumber != null){
        res.invoice.invoiceNumber = req.body.invoiceNumber;
    }
    if(req.body.invoiceDate != null){
        res.invoice.invoiceDate = req.body.invoiceDate;
    }
    if(req.body.invoiceAmount != null){
        res.invoice.invoiceAmount = req.body.invoiceAmount;
    }
    if(req.body.invoiceStatus != null){
        res.invoice.invoiceStatus = req.body.invoiceStatus;
    }
    if(req.body.invoiceTitle != null){
        res.invoice.invoiceTitle = req.body.invoiceTitle;
    }
    if(req.body.invoiceTotalitems != null){
        res.invoice.invoiceTotalitems = req.body.invoiceTotalitems;
    }
    if(req.body.invoiceIGST != null){
        res.invoice.invoiceIGST = req.body.invoiceIGST;
    }
    if(req.body.invoiceCGST != null){
        res.invoice.invoiceCGST = req.body.invoiceCGST;
    }
    if(req.body.invoiceSGST != null){
        res.invoice.invoiceSGST = req.body.invoiceSGST;
    }
    if(req.body.invoiceUTGST != null){
        res.invoice.invoiceUTGST = req.body.invoiceUTGST;
    }
    if(req.body.invoiceSentTo != null){
        res.invoice.invoiceSentTo = req.body.invoiceSentTo;
    }
    if(req.body.invoiceSentBy != null){
        res.invoice.invoiceSentBy = req.body.invoiceSentBy;
    }
    if(req.body.invoicePaymentMode != null){
        res.invoice.invoicePaymentMode = req.body.invoicePaymentMode;
    }
    if(req.body.invoicePDF != null){
        res.invoice.invoicePDF = req.body.invoicePDF;
    }
    if(req.body.invoiceReport != null){
        res.invoice.invoiceReport = req.body.invoiceReport;
    }
    if(req.body.invoiceTime != null){
        res.invoice.invoiceTime = req.body.invoiceTime;
    }
    if(req.body.discount != null){
        res.invoice.discount = req.body.discount;
    }
    if(req.body.roundoff != null){
        res.invoice.roundoff = req.body.roundoff;
    }
    if(req.body.extra1 != null){
        res.invoice.extra1 = req.body.extra1;
    }
    if(req.body.extra2 != null){
        res.invoice.extra2 = req.body.extra2;
    }
    if(req.body.extra3 != null){
        res.invoice.extra3 = req.body.extra3;
    }
    if(req.body.extra4 != null){
        res.invoice.extra4 = req.body.extra4;
    }
    if(req.body.extra5 != null){
        res.invoice.extra5 = req.body.extra5;
    }
    try{
        const updateInvoice = await res.invoice.save();
        res.json(updateInvoice);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// deleting one
router.delete('/:id', getReturn, async (req, res) => {
    // res.send(`deleting user ${req.params.id}`);
    try{
        await res.return.remove();
        res.json({message: 'Deleted Return'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//getting by invoiceSentTo
router.get('/useremail/:invoiceSentTo', async (req, res) => {
    // res.send(`getting user ${req.params.id}`);
    try{
        const returnData = await Return.find({invoiceSentTo: req.params.invoiceSentTo});
        res.json(returnData);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//getting by invoiceSentBy
router.get('/vendormail/:invoiceSentBy', async (req, res) => {
    // res.send(`getting user ${req.params.id}`);
    try{
        const returnData = await Return.find({invoiceSentBy: req.params.invoiceSentBy});
        res.json(returnData);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});




async function getReturn(req, res, next) {
    let returnData;
    try {
        returnData = await Return.findById(req.params.id);
        if (returnData == null) {
            return res.status(404).json({message: 'Cannot find return'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.return = returnData;
}