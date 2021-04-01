const mongoose = require('mongoose')

const Lista = new mongoose.Schema({
    titulo: {
        type:String,
        required: true
    },
    cartas: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carta",
        default: []
    }]
})

module.exports = mongoose.model('Lista', Lista)