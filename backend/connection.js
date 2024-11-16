const mongoose = require('mongoose');
require('dotenv').config();

const connectionToDatabase = () => {
    return mongoose.connect(process.env.MONGO_URL);
};

module.exports = {
    connectionToDatabase,
}