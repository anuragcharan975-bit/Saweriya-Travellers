const mongoose = require("mongoose");

const Dbasync = () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/anurag_travels';
    mongoose.connect(mongoUri)
        .then(() => console.log('connected to mongodb'))
        .catch((err) => console.log('connected error:', err));
};

module.exports = Dbasync;
