const nuevaListaBtn = document.getElementById("nueva-lista")

nuevaListaBtn.addEventListener('click', crearFormularioLista)

function validarCampo(campo) {
  if (!campo.value) {
    campo.classList.add('empty')
    return false
  }
  return true
}

function crearLista(nuevoTitulo, id, cartas = []) {
  const plantilla = document.getElementById('plantilla-lista')
  const nuevaLista = plantilla.content.cloneNode(true)
  const contenedor = document.querySelector("main")
  const formulario = nuevaLista.querySelector('.nueva-carta')
  const wrapper = nuevaLista.querySelector('.carta-wrapper')
  const titulo = nuevaLista.querySelector('.lista-titulo')
  titulo.innerText = nuevoTitulo
  titulo.addEventListener('click', editarTituloLista)
  formulario.addEventListener('click', crearFormulario)
  const formularioCreacionLista = document.querySelector('#creacion-lista')
  contenedor.insertBefore(nuevaLista, formularioCreacionLista)
  const lista = formularioCreacionLista.previousElementSibling
  lista.addEventListener('dragover', e => {
    e.preventDefault()
    const siguienteElemento = getDragAfterElement(wrapper, e.clientY)
    const draggable = document.querySelector('.dragging')
    if (!siguienteElemento)
      wrapper.append(draggable)
    else
      wrapper.insertBefore(draggable, siguienteElemento)
  })
  const eliminarbtn = lista.querySelector('.eliminar-lista')
  eliminarbtn.addEventListener('click', eliminarLista)
  cartas.forEach(carta => {
    crearCarta(wrapper, carta.titulo, carta.descripcion, carta._id)
  })
  lista.dataset.id = id
}

function crearFormularioLista(e) {
  verificarFormulariosActivos()
  const plantilla = document.querySelector('#plantilla-creacion-lista')
  const formulario = plantilla.content.cloneNode(true)
  e.target.removeEventListener("click", crearFormularioLista)
  e.target.innerHTML = ""
  e.target.classList.add('creando-lista')
  e.target.append(formulario)
  const cancelar = e.target.querySelector('#cancelar')
  cancelar.addEventListener('click', _ => removerFormularioLista(e.target))
  const agregarbtn = e.target.querySelector("#crear-lista")
  agregarbtn.addEventListener('click', async _ => {
    const inputTitulo = document.querySelector("#nuevo-titulo-lista")
    if (!validarCampo(inputTitulo)) return
    const nuevoTitulo = inputTitulo.value
    const response = await request('https://To-do.jfernando122.repl.co/lista', 'POST', { titulo: nuevoTitulo })
    const nuevaLista = await response.json()
    crearLista(nuevoTitulo, nuevaLista._id)
    removerFormularioLista(e.target)
  })
  e.target.querySelector('input').focus()
}

function removerFormularioLista(formulario) {
  formulario.classList.remove('creando-lista')
  formulario.innerHTML = "<i class='fa fa-plus'></i>&nbsp;Nueva Lista"
  formulario.addEventListener('click', crearFormularioLista)
}

function crearCarta(lista, nuevotitulo, nuevadescripcion, id) {
  const plantillaCarta = document.querySelector('#plantilla-carta')
  const nuevaCarta = plantillaCarta.content.cloneNode(true)
  nuevaCarta.querySelector(".titulo").innerText = nuevotitulo
  nuevaCarta.querySelector(".descripcion").innerText = nuevadescripcion
  lista.appendChild(nuevaCarta)
  const carta = lista.lastElementChild
  carta.addEventListener('dragstart', dragStart)
  carta.addEventListener('dragend', dragEnd)
  const eliminarbtn = carta.querySelector('.eliminar')
  eliminarbtn.addEventListener('click', eliminarCarta)
  const editarbtn = carta.querySelector('.editar')
  editarbtn.addEventListener('click', editarCarta)
  carta.dataset.id = id
}

function crearFormulario(e) {
  verificarFormulariosActivos()
  const plantilla = document.getElementById('plantilla-creacion-carta')
  const formulario = plantilla.content.cloneNode(true)
  e.target.removeEventListener('click', crearFormulario)
  e.target.innerHTML = ""
  e.target.classList.add('creando-carta')
  e.target.append(formulario)
  const cancelar = e.target.querySelector("#cancelar")
  cancelar.addEventListener('click', _ => removerFormulario(e.target))
  const agregarbtn = e.target.querySelector('#agregar-carta')
  agregarbtn.addEventListener('click', async _ => {
    const inputTitulo = e.target.querySelector('#nuevo-titulo')
    const inputDescripcion = e.target.querySelector("#nuevo-descripcion")
    const validacion = !validarCampo(inputTitulo) | !validarCampo(inputDescripcion)
    if (validacion) return
    const titulo = inputTitulo.value
    const descripcion = inputDescripcion.value
    const lista = e.target.parentNode
    const response = await request('https://To-do.jfernando122.repl.co/lista/carta', 'POST', { titulo, descripcion, id: lista.dataset.id })
    const cuerpo = await response.json()
    crearCarta(e.target.previousElementSibling, titulo, descripcion, cuerpo)
    removerFormulario(e.target)
  })
  e.target.querySelector('input').focus()
}

function removerFormulario(formulario) {
  formulario.classList.remove("creando-carta")
  formulario.innerHTML = "<i class='fa fa-plus'></i>&nbsp;Nueva Carta"
  formulario.addEventListener('click', crearFormulario)
}

let cartaEnEdicion = null
function cancelarEdicionCarta(e) {
  e ?.stopPropagation()
    const input = document.querySelector('.carta > input')
  const wrapper = input.parentNode
  wrapper.innerHTML = ''
  const contenidoCarta = [...cartaEnEdicion.children]
  contenidoCarta.forEach(elemento => wrapper.appendChild(elemento))
  wrapper.draggable = true
  const eliminarbtn = wrapper.querySelector('.eliminar')
  eliminarbtn.addEventListener('click', eliminarCarta)
  const editarbtn = wrapper.querySelector('.editar')
  editarbtn.addEventListener('click', editarCarta)
  document.removeEventListener('click', cancelarEdicionCarta)
  cartaEnEdicion = null
}

async function finalizarEdicionCarta(e) {
  e ?.stopPropagation()
    const tituloInput = document.querySelector('.carta #nuevo-titulo')
  const inputDescripcion = document.querySelector('.carta #nuevo-descripcion')
  const validacion = !validarCampo(tituloInput) | !validarCampo(inputDescripcion)
  const titulo = tituloInput.value
  const descripcion = inputDescripcion.value
  if (validacion) return
  const carta = tituloInput.parentNode
  const contenidoCarta = [...cartaEnEdicion.children]
  await request('https://To-do.jfernando122.repl.co/carta', 'PATCH', { titulo, descripcion, id: carta.dataset.id })
  contenidoCarta[0].innerText = titulo
  contenidoCarta[1].innerText = descripcion
  carta.innerHTML = ''
  contenidoCarta.forEach(elemento => carta.append(elemento))
  carta.draggable = true
  const eliminarbtn = carta.querySelector('.eliminar')
  eliminarbtn.addEventListener('click', eliminarCarta)
  const editarbtn = carta.querySelector('.editar')
  editarbtn.addEventListener('click', editarCarta)
  document.removeEventListener('click', cancelarEdicionCarta)
  cartaEnEdicion = null
}

function editarCarta(e) {
  e.stopPropagation()
  verificarFormulariosActivos()
  const plantilla = document.querySelector('#plantilla-edicion-carta')
  const formulario = plantilla.content.cloneNode(true)
  const carta = e.target.parentNode
  cartaEnEdicion = carta.cloneNode(true)
  carta.innerHTML = ''
  carta.append(formulario)
  carta.removeAttribute('draggable')
  carta.querySelector('#nuevo-titulo').value = cartaEnEdicion.children[0].innerText
  carta.querySelector('#nuevo-descripcion').value = cartaEnEdicion.children[1].innerText
  const btn = carta.querySelector('.carta button')
  btn.addEventListener('click', finalizarEdicionCarta)
  document.querySelectorAll(".carta input").forEach(input => input.addEventListener('click', e => e.stopPropagation()))
  document.addEventListener('click', cancelarEdicionCarta)
}

let tituloEnEdicion = null
function cancelarEdicionTituloLista(e) {
  e ?.stopPropagation()
    const input = document.querySelector('.titulo-wrapper > input')
  const wrapper = input.parentNode
  wrapper.removeChild(input)
  wrapper.appendChild(tituloEnEdicion)
  const btn = wrapper.querySelector('button')
  btn.classList.add("eliminar-lista", "far", "fa-trash-alt")
  btn.classList.remove('confirmar-lista', "fas", "fa-check")
  btn.removeEventListener('click', finalizarEdicionLista)
  btn.addEventListener('click', eliminarLista)
  document.removeEventListener('click', cancelarEdicionTituloLista)
  tituloEnEdicion = null
}

async function finalizarEdicionLista(e) {
  e.stopPropagation()
  const wrapper = e.target.parentNode
  const input = wrapper.querySelector('input')
  const btn = wrapper.querySelector('button')
  if (!validarCampo(input)) return
  await request('https://To-do.jfernando122.repl.co/lista', 'PATCH', { id: wrapper.parentNode.dataset.id, titulo: input.value })
  tituloEnEdicion.innerText = input.value
  wrapper.removeChild(input)
  wrapper.appendChild(tituloEnEdicion)
  btn.classList.add("eliminar-lista", "far", "fa-trash-alt")
  btn.classList.remove('confirmar-lista', "fas", "fa-check")
  btn.removeEventListener('click', finalizarEdicionLista)
  btn.addEventListener('click', eliminarLista)
  document.removeEventListener('click', cancelarEdicionTituloLista)
  tituloEnEdicion = null
}

function editarTituloLista(e) {
  e.stopPropagation()
  verificarFormulariosActivos()
  const input = document.createElement('input')
  input.addEventListener('click', e => e.stopPropagation())
  const titulo = e.target
  input.value = titulo.innerText
  tituloEnEdicion = titulo
  const wrapper = titulo.parentNode
  const btn = titulo.parentNode.querySelector('button')
  btn.removeEventListener('click', eliminarLista)
  btn.classList.remove("eliminar-lista", "far", "fa-trash-alt")
  btn.classList.add('confirmar-lista', "fas", "fa-check")
  btn.tabIndex = "0"
  btn.addEventListener('click', finalizarEdicionLista)
  wrapper.removeChild(e.target)
  wrapper.insertBefore(input, btn)
  input.focus()
  document.addEventListener('click', cancelarEdicionTituloLista)
}

async function eliminarCarta(e) {
  const carta = e.target.parentNode
  if (confirm('¿Seguro qué deseas eliminar la carta?\nNo la vas a poder recuperar')) {
    await request('https://To-do.jfernando122.repl.co/carta', 'DELETE', { cartaId: carta.dataset.id, listaId: carta.parentNode.parentNode.dataset.id })
    carta.parentNode.removeChild(carta)
  }
}

async function eliminarLista(e) {
  const lista = e.target.parentNode.parentNode
  if (confirm('¿Seguro que desea eliminar la lista?\nTodas las cartas adentro de la lista tambien serán eliminadas para siempre')) {
    await request('https://To-do.jfernando122.repl.co/lista', 'DELETE', { id: lista.dataset.id })
    lista.parentNode.removeChild(lista)
  }
}

function verificarFormulariosActivos() {
  if (!!cartaEnEdicion) return cancelarEdicionCarta()
  if (!!tituloEnEdicion) return cancelarEdicionTituloLista()
  const formularioActivo = document.querySelector('.creando-carta')
  if (!!formularioActivo) return removerFormulario(formularioActivo)
  const formularioListaActivo = document.querySelector(".creando-lista")
  if (!!formularioListaActivo) return removerFormularioLista(formularioListaActivo)
}

const inicializarFormularios = () => {
  const nuevaCartaBtn = document.querySelectorAll(".nueva-carta:not(#nueva-lista)")
  nuevaCartaBtn.forEach(btn => btn.addEventListener('click', crearFormulario))
}

function dragStart(e) {
  const carta = e.target
  carta.classList.add('dragging')
  listaInicial = carta.parentNode.parentNode
}

async function dragEnd(e) {
  carta = e.target
  carta.classList.remove('dragging')
  const listaFinal = carta.parentNode.parentNode
  if (listaFinal == listaInicial) {
    const cartas = [...listaInicial.querySelectorAll('.carta-wrapper .carta')]
    await request('https://To-do.jfernando122.repl.co/lista', 'PATCH', { id: listaInicial.dataset.id, cartas: cartas.map(carta => carta.dataset.id) })
  } else {
    const cartasLista1 = [...listaInicial.querySelectorAll('.carta-wrapper .carta')].map(carta => carta.dataset.id)
    const cartasLista2 = [...listaFinal.querySelectorAll('.carta-wrapper .carta')].map(carta => carta.dataset.id)
    await request('https://To-do.jfernando122.repl.co/lista/s', 'PATCH', {
      lista1: {
        id: listaInicial.dataset.id,
        cartas: cartasLista1
      },
      lista2: {
        id: listaFinal.dataset.id,
        cartas: cartasLista2
      }
    })
  }
}

let listaInicial = null
const inicializarCartas = () => {
  const cartas = document.querySelectorAll("[draggable='true']")
  cartas.forEach(carta => {
    carta.addEventListener("dragstart", dragStart)
    carta.addEventListener("dragend", dragEnd)
    const eliminarbtn = carta.querySelector('.eliminar')
    eliminarbtn.addEventListener('click', eliminarCarta)
    const editarbtn = carta.querySelector('.editar')
    editarbtn.addEventListener('click', editarCarta)
  })
}

function getDragAfterElement(container, y) {
  const draggableItems = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')]
  return draggableItems.reduce((closest, draggableItem) => {
    const box = draggableItem.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset)
      return {
        offset,
        element: draggableItem
      }
    else
      return closest
  }, {
      offset: Number.NEGATIVE_INFINITY
    }).element
}

const inicializarContenedores = () => {
  const listas = document.querySelectorAll('.lista:not(#creacion-lista)')
  listas.forEach(lista => {
    const wrapper = lista.querySelector(".carta-wrapper")
    lista.addEventListener("dragover", e => {
      e.preventDefault()
      const siguienteElemento = getDragAfterElement(wrapper, e.clientY)
      const draggable = document.querySelector('.dragging')
      if (!siguienteElemento)
        wrapper.append(draggable)
      else
        wrapper.insertBefore(draggable, siguienteElemento)
    })
    const eliminarbtn = lista.querySelector(".eliminar-lista")
    eliminarbtn.addEventListener('click', eliminarLista)
    const titulo = lista.querySelector('.lista-titulo')
    titulo.addEventListener('click', editarTituloLista)
  })
}

async function request(url, tipo, cuerpo) {
  return fetch(url, { method: tipo, body: JSON.stringify(cuerpo), headers: { 'Content-Type': 'application/json' } })
}

const iniciar = async () => {
  const respuesta = await request('https://To-do.jfernando122.repl.co/lista', 'get')
  const listas = await respuesta.json()
  listas.forEach(lista => { crearLista(lista.titulo, lista._id, lista.cartas) })
  inicializarCartas()
  inicializarContenedores()
  inicializarFormularios()
}

iniciar()
