const Lista = require('../modelos/Lista')
const Carta = require('../modelos/Carta')

const getListas = async (_,res) =>{
    try {
        const listas = await Lista.find().populate('cartas')
        res.status(200).send(listas)
    } catch (error) {
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

const agregarLista = async (req,res) =>{
    try {
        console.log(req.body);
        const titulo = req.body.titulo
        let nuevaLista = new Lista({titulo})
        nuevaLista = await nuevaLista.save()
        res.status(200).send(nuevaLista)
    } catch (error) {
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

const agregarCarta = async(req,res) =>{
    try{
        const cartaid = req.nuevaCarta._id;
        const lista = await Lista.findById(req.body.id)
        lista.cartas.push(cartaid)
        const listaActualizada = await lista.save()
        res.status(201).send(listaActualizada.cartas[listaActualizada.cartas.length - 1])
    }catch(error){
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }

}

const actualizarLista = async (req,res) =>{
    try{
        const id = req.body.id
        const titulo = req.body.titulo
        const cartas = req.body.cartas
        await Lista.findByIdAndUpdate(id,{titulo,cartas},{omitUndefined: true})
        res.status(200).send({mensaje: 'Lista actualizada exitosamente'})
    }catch(error){
        consolge.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

const actualizarListas = async(req,res) =>{
    try{
        const lista1 = req.body.lista1
        const lista2 = req.body.lista2
        await Promise.all([
            Lista.findByIdAndUpdate(lista1.id,{cartas: [...lista1.cartas]},{omitUndefined: true}),
            Lista.findByIdAndUpdate(lista2.id,{cartas: [...lista2.cartas]},{omitUndefined: true})
        ])
        res.status(200).send({mensaje: 'Listas actualizadas exitosamente'})
    }catch(error){
        console.log(error);
        res.status(500).send({mensaje:'Hubo un error'})
    }

}

const eliminarLista = async (req,res) =>{
    try{
        const id = req.body.id
        const lista = await Lista.findById(id);
        await Promise.all(lista.cartas.map(carta => Carta.findByIdAndDelete(carta)))
        await Lista.findByIdAndDelete(id)
        res.status(200).send({mensaje: 'Lista borrada de manera exitosa'})
    }catch(error){
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

const quitarCarta = async (req,res) =>{
    try{
        const lista = await Lista.findById(req.body.listaId)
        const cartas = lista.cartas.filter(carta => carta != req.body.cartaId)
        lista.cartas = cartas
        await lista.save()
        res.status(200).send({mensaje: 'Carta eliminada de manera exitosa'})
    }catch(error){
        console.log(error);
        res.status(500).send({mensaje: 'Hubo un error'})
    }
}

module.exports = {
    getListas,
    agregarLista,
    agregarCarta,
    actualizarLista,
    actualizarListas,
    eliminarLista,
    quitarCarta
}