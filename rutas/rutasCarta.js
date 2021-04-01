const router = require('express').Router()

const controladorCarta = require('../controladores/controladorCarta')
const { quitarCarta } = require('../controladores/controladorLista')

router.get('/', controladorCarta.getCartas)

router.post('/', controladorCarta.crearCarta)

router.patch('/', controladorCarta.modificarCarta)

router.delete('/', controladorCarta.eliminarCarta, quitarCarta)

module.exports = router