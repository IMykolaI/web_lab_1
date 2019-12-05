const mongoose = require('mongoose');

const appealSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    text: String,
    time: String,
    date: String
})

module.exports = mongoose.model('Appeal', appealSchema);