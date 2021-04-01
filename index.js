const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

const rutasCarta = require('./rutas/rutasCarta')
const rutasLista = require('./rutas/rutasLista')

mongoose.connect(process.env.MONGO_URI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => console.log('Base de datos conectada'))

app.use(express.json());
app.use(cors())
app.use(express.static('./public'))

app.use('/carta', rutasCarta)

app.use('/lista', rutasLista)

app.listen('8000', () => console.log('Server running'))