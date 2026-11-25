'use client';

import { useEffect, useState } from 'react';

const KEY = 'blumy_items';
const VACIO = { nombre: '', descripcion: '', precio: '', stock: '' };

function cargar() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export default function Page() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);

  useEffect(() => { setItems(cargar()); }, []);

  function guardar(nuevos) {
    setItems(nuevos);
    localStorage.setItem(KEY, JSON.stringify(nuevos));
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limpiar() {
    setForm(VACIO);
    setEditId(null);
  }

  function enviar(e) {
    e.preventDefault();
    const datos = { ...form, nombre: form.nombre.trim(), descripcion: form.descripcion.trim() };
    if (editId) {
      guardar(items.map((it) => (it.id === editId ? { id: editId, ...datos } : it)));
    } else {
      const id = items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
      guardar([...items, { id, ...datos }]);
    }
    limpiar();
  }

  function editar(it) {
    setForm({ nombre: it.nombre, descripcion: it.descripcion, precio: it.precio, stock: it.stock });
    setEditId(it.id);
  }

  function eliminar(id) {
    if (!confirm('¿Eliminar este registro?')) return;
    guardar(items.filter((x) => x.id !== id));
    if (editId === id) limpiar();
  }

  return (
    <main>
      <h1>Panel Blumy</h1>

      <form onSubmit={enviar}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={cambiar} required />
        <label>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={cambiar} />
        <label>Precio</label>
        <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={cambiar} />
        <label>Stock</label>
        <input name="stock" type="number" min="0" value={form.stock} onChange={cambiar} />
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={limpiar}>Cancelar</button>}
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6}>No hay registros</td></tr>
          ) : (
            items.map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.nombre}</td>
                <td>{it.descripcion}</td>
                <td>{it.precio}</td>
                <td>{it.stock}</td>
                <td>
                  <button onClick={() => editar(it)}>Editar</button>{' '}
                  <button onClick={() => eliminar(it.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
