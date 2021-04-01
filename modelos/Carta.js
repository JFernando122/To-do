const mongoose = require('mongoose')

const Carta = new mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
    descripcion:{
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('Carta', Carta);
