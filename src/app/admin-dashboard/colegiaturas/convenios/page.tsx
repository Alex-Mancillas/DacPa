'use client';

import { supabase } from '@/app/lib/supabaseclient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ConveniosPage() {
  const [tab, setTab] = useState('crear');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estado de Cuenta</h1>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded border ${tab === 'crear' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => setTab('crear')}
        >
          ➕ Crear Convenio
        </button>
        <button
          className={`px-4 py-2 rounded border ${tab === 'activos' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => setTab('activos')}
        >
          📑 Convenios Activos
        </button>
      </div>

      <div className="bg-white border rounded p-4 shadow-sm">
        {tab === 'crear' && <CrearConvenio />}
        {tab === 'activos' && <TablaConveniosActivos />}
      </div>
    </div>
  );
}

function TablaConveniosActivos() {
  const [convenios, setConvenios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConvenios = async () => {
      const { data, error } = await supabase.from('convenios').select('*');
      if (!error) setConvenios(data || []);
      setLoading(false);
    };

    fetchConvenios();
  }, []);

  const eliminarConvenio = async (id: number) => {
    const { error } = await supabase.from('convenios').delete().eq('id', id);
    if (!error) {
      alert('✅ Convenio eliminado exitosamente');
      window.location.reload();
    } else {
      alert('❌ Error al eliminar el convenio');
      console.error(error);
    }
  };

  if (loading) return <p>Cargando convenios...</p>;
  if (convenios.length === 0) return <p>No hay convenios activos.</p>;

  return (
    <table className="min-w-full border border-gray-300 rounded-lg">
      <thead className="bg-pink-200">
        <tr>
          <th className="px-4 py-2 border">Padre</th>
          <th className="px-4 py-2 border">Alumno</th>
          <th className="px-4 py-2 border">Salón</th>
          <th className="px-4 py-2 border">Correo</th>
          <th className="px-4 py-2 border">Teléfono</th>
          <th className="px-4 py-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {convenios.map((c, i) => (
          <tr key={i} className="text-center">
            <td className="px-4 py-2 border">{c.nombre_padre}</td>
            <td className="px-4 py-2 border">{c.nombre_alumno}</td>
            <td className="px-4 py-2 border">{c.salon}</td>
            <td className="px-4 py-2 border">{c.correo}</td>
            <td className="px-4 py-2 border">{c.telefono}</td>
            <td className="px-4 py-2 border">
              <button
                onClick={() => eliminarConvenio(c.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CrearConvenio() {
  const router = useRouter();
  const [form, setForm] = useState({
    padre: '',
    alumno: '',
    salon: '',
    correo: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { padre, alumno, salon, correo, telefono } = form;

    if (!padre || !alumno || !salon || !correo || !telefono) {
      setError('Por favor llena todos los campos.');
      return;
    }

    const { error } = await supabase.from('convenios').insert([
      {
        nombre_padre: padre,
        nombre_alumno: alumno,
        salon,
        correo,
        telefono,
      },
    ]);

    if (error) {
      console.error(error);
      setError('Hubo un error al crear el convenio.');
      return;
    }

    setSuccess('¡Convenio creado con éxito!');
    setForm({ padre: '', alumno: '', salon: '', correo: '', telefono: '' });

    setTimeout(() => {
      router.refresh();
    }, 1500);
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Formato de Convenio', 105, 20, { align: 'center' });

    autoTable(doc, {
      startY: 30,
      head: [['Campo', 'Valor']],
      body: [
        ['Nombre del padre de familia', form.padre || '_______________________'],
        ['Nombre del alumno', form.alumno || '_______________________'],
        ['Salón del alumno', form.salon || '_______________________'],
        ['Correo electrónico', form.correo || '_______________________'],
        ['Teléfono', form.telefono || '_______________________'],
      ],
      theme: 'grid',
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 110;

    doc.text('Firma del Padre: ___________________________', 20, finalY + 30);
    doc.text('Firma del Director: _________________________', 20, finalY + 50);

    doc.save('convenio.pdf');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Convenio</h1>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 border border-red-400">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 border border-green-400">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="padre" placeholder="Nombre del padre de familia" onChange={handleChange} value={form.padre} className="border p-2 w-full rounded" />
        <input name="alumno" placeholder="Nombre del alumno" onChange={handleChange} value={form.alumno} className="border p-2 w-full rounded" />
        <input name="salon" placeholder="Salón del alumno" onChange={handleChange} value={form.salon} className="border p-2 w-full rounded" />
        <input name="correo" placeholder="Correo electrónico" type="email" onChange={handleChange} value={form.correo} className="border p-2 w-full rounded" />
        <input name="telefono" placeholder="Teléfono" type="tel" onChange={handleChange} value={form.telefono} className="border p-2 w-full rounded" />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Crear Convenio</button>
      </form>

      <div className="mt-6">
        <button
          onClick={generarPDF}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Descargar Formato de Convenio
        </button>
      </div>
    </div>
  );
}