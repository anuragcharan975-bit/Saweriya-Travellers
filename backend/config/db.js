const mongoose = require("mongoose")
const Dbasync = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/anurag_travels')
        .then(() => console.log('connected to mongodb'))
        .catch((err) => console.log('connected error:', err));
}

module.exports = Dbasync 
