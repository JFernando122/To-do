const Carta = require('../modelos/Carta')

const getCartas = async (_,res) =>{
    try{
        const cartas = await Carta.find()
        res.send(cartas)
    }catch(error){
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

const crearCarta = async (req,res, next) =>{
    try {
        const titulo = req.body.titulo
        const descripcion = req.body.descripcion
        let nuevaCarta = new Carta({titulo,descripcion})
        nuevaCarta = await nuevaCarta.save();
        req.nuevaCarta = nuevaCarta
        next()
    } catch (error) {
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

const modificarCarta = async (req,res) =>{
    try {
        const id = req.body.id
        const nuevoTitulo = req.body.titulo
        const nuevaDescripcion = req.body.descripcion
        await Carta.findByIdAndUpdate(id,{
            titulo: nuevoTitulo,
            descripcion: nuevaDescripcion
        })
        res.status(200).send({mensaje: 'Carta guardada exitosamente'})
    } catch (error) {
        console.log(error);
        res.status(500).send({mensaje : 'Hubo un error'})
    }
    const id = req.body.id
}

const eliminarCarta = async (req,res,next) =>{
    try{
        const id = req.body.cartaId;
        await Carta.findByIdAndDelete(id)
        next()
    }catch(error){
        console.log(error)
        res.status(500).sned({mensaje:'Hubo un error'})
    }
}

module.exports = {
    getCartas,
    crearCarta,
    modificarCarta,
    eliminarCarta
}