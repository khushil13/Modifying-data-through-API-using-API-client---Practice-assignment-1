const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose'); 

const app = express();
const port = process.env.PORT || 3010; 

// 1. MongoDB Connection 
const mongoURI = "mongodb+srv://choprakhushil13:1rfebIFKUYUBCiDe@cluster0.nhg4l.mongodb.net/ecom_db"; 

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// 2. Mongoose Schema and Model (Example - Adapt as needed)
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number
});

const Item = mongoose.model('Item', itemSchema); // 'Item' is the collection name

// Middleware
app.use(express.static('static'));
app.use(express.json()); // Important for parsing JSON request bodies

// 3. API Endpoints

// Endpoint 1: Create an item
app.post('/api/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json({ message: 'Item created', data: newItem });
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
});

// Endpoint 2: Get all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error getting items', error: error.message });
    }
});

// Example: Get a single item by ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error getting item', error: error.message });
    }
});

// Example: Update an item
app.put('/api/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }); // { new: true } gets the updated document
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated', data: updatedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error: error.message });
    }
});


// Example: Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${3010}`);
});