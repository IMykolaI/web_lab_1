const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    image: String
})

module.exports = mongoose.model('News', newsSchema);