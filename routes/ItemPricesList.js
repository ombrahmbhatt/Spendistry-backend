const express = require('express');
const { findById } = require('../models/itemPricesList');
const router = express.Router();
const ItemPricesSchema = require('../models/itemPricesList');

// getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const item = await ItemPricesSchema.find();
    res.json(item);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// getting one
router.get('/:id', getItems, (req, res) => {
    // res.send(`getting user ${req.params.id}`);
    res.json(res.item);
})

router.get('/filter/:id/:ItemsPrices', async (req, res) => {
    // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
    try {
    // const itemsPrices = await ItemPricesSchema.find({"_id": req.params.id, "ItemsPrices": {$elemMatch: { "price": req.params.ItemsPrices }}});
    const itemsPrices = await ItemPricesSchema.aggregate([{$match: {"_id": req.params.id}}, {$unwind: "$ItemsPrices"}, "ItemsPrices".findById(req.params.ItemsPrices)]);
    res.json(itemsPrices);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.patch('/filter/:id/:ItemsPrices', getItems, async (req, res) => { 
    try {
        const itemsPrices = await ItemPricesSchema.findOneAndUpdate({"_id": req.params.id, "ItemsPrices": {$elemMatch: { "price": req.params.ItemsPrices }}}, {$set: {"ItemsPrices.$.price": req.body.price}}, {new: true});
        res.json(itemsPrices);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
  })

// creating one
router.post('/', async (req, res) => {
    // res.send(`creating user ${req.body.name}`);
    const item = new ItemPricesSchema({
        _id : req.body._id,
        ItemsPrices: req.body.ItemsPrices
    });
    try{
        const savedItems = await item.save();
        res.status(201).json(savedItems);
        
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
})

// updating one
router.patch('/:id', getItems, async (req, res) => {
    // res.send(`updating user ${req.params.id}`);
    if(req.body.ItemsPrices != null){
        res.item.ItemsPrices = req.body.ItemsPrices;
    }
    try{
        const updatedItems = await res.item.save();
        res.json(updatedItems);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// deleting one
router.delete('/:id', getItems, async (req, res) => {
    // res.send(`deleting user ${req.params.id}`);
    try{
        await res.item.remove();
        res.json({message: 'Deleted This UserItemList'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

async function getItems(req, res, next) {
    let item;
    try {
        item = await ItemPricesSchema.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({message: 'Cannot find Items'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.item = item;
    next();
}


module.exports = router;