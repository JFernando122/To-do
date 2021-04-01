const router = require('express').Router()

const controladorLista = require('../controladores/controladorLista')
const { crearCarta } = require('../controladores/controladorCarta')

router.get('/', controladorLista.getListas)

router.post('/', controladorLista.agregarLista)

router.post('/carta',crearCarta, controladorLista.agregarCarta)

router.patch('/', controladorLista.actualizarLista)

router.patch('/s', controladorLista.actualizarListas)

router.delete('/', controladorLista.eliminarLista)

router.delete('/carta')

module.exports = router