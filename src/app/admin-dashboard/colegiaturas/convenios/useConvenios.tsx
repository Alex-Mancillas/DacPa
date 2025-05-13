'use client';

import { supabase } from '@/app/lib/supabaseclient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos
export type Convenio = {
  id: number;
  nombre_padre: string;
  nombre_alumno: string;
  salon: string;
  correo: string;
  telefono: string;
};

export type FormData = {
  padre: string;
  alumno: string;
  salon: string;
  correo: string;
  telefono: string;
};

// Hook para gestionar los convenios activos
export function useConveniosActivos() {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConvenios = async () => {
    const { data, error } = await supabase.from('convenios').select('*');
    if (!error) setConvenios(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchConvenios();
  }, []);

  const eliminarConvenio = async (id: number) => {
    console.log('ID a eliminar:', id);
  
    const { error } = await supabase.from('convenios').delete().eq('id', id);
    
    if (!error) {
      alert('✅ Convenio eliminado exitosamente');
      window.location.reload();
    } else {
      alert('❌ Error al eliminar el convenio');
      console.error(error);
    }
  };

  return { convenios, loading, eliminarConvenio };
}

// Hook para crear nuevos convenios
export function useCrearConvenio() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
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

  return { form, error, success, handleChange, handleSubmit };
}