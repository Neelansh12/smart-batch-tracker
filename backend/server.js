const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log(MONGODB_URI);
// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-batch-tracker')
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        console.error('Please ensure MongoDB is installed and running on port 27017');
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/batches', require('./routes/batches'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/quality', require('./routes/quality'));
app.use('/api/environmental', require('./routes/environmental'));
app.use('/api/costs', require('./routes/costs'));

app.get('/', (req, res) => {
    res.send('Smart Batch Tracker API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});
