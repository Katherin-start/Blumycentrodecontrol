const KEY = 'blumy_items';
const $ = (id) => document.getElementById(id);

function cargar() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function guardar(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function limpiar() {
  $('form').reset();
  $('id').value = '';
  $('btnGuardar').textContent = 'Agregar';
  $('btnCancelar').hidden = true;
}

function render() {
  const items = cargar();
  $('tabla').innerHTML = '';
  if (items.length === 0) {
    $('tabla').innerHTML = '<tr><td colspan="6">No hay registros</td></tr>';
    return;
  }
  items.forEach((it) => {
    const tr = document.createElement('tr');
    [it.id, it.nombre, it.descripcion, it.precio, it.stock].forEach((v) => {
      const td = document.createElement('td');
      td.textContent = v ?? '';
      tr.appendChild(td);
    });
    const acc = document.createElement('td');
    const bEdit = document.createElement('button');
    bEdit.textContent = 'Editar';
    bEdit.onclick = () => editar(it.id);
    const bDel = document.createElement('button');
    bDel.textContent = 'Eliminar';
    bDel.onclick = () => eliminar(it.id);
    acc.append(bEdit, ' ', bDel);
    tr.appendChild(acc);
    $('tabla').appendChild(tr);
  });
}

function editar(id) {
  const it = cargar().find((x) => x.id === id);
  if (!it) return;
  $('id').value = it.id;
  $('nombre').value = it.nombre;
  $('descripcion').value = it.descripcion;
  $('precio').value = it.precio;
  $('stock').value = it.stock;
  $('btnGuardar').textContent = 'Actualizar';
  $('btnCancelar').hidden = false;
}

function eliminar(id) {
  if (!confirm('¿Eliminar este registro?')) return;
  guardar(cargar().filter((x) => x.id !== id));
  render();
}

$('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const items = cargar();
  const datos = {
    nombre: $('nombre').value.trim(),
    descripcion: $('descripcion').value.trim(),
    precio: $('precio').value,
    stock: $('stock').value,
  };
  const id = Number($('id').value);
  if (id) {
    const i = items.findIndex((x) => x.id === id);
    if (i >= 0) items[i] = { id, ...datos };
  } else {
    const nuevoId = items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
    items.push({ id: nuevoId, ...datos });
  }
  guardar(items);
  limpiar();
  render();
});

$('btnCancelar').addEventListener('click', limpiar);

render();
