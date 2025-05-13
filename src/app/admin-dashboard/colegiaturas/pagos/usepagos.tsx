'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseclient'
import jsPDF from 'jspdf'

// Tipos
export type Pago = {
  id: number;
  fecha_pago: string;
  concepto: string;
  id_alumno: number;
  monto: number;
  metodo_pago: string;
  estado: string;
};

export type Alumno = {
  id: number;
  nombre: string;
};

// Hook principal para gestionar pagos
export function usePagos() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [mesSeleccionado, setMesSeleccionado] = useState('')
  const [añoSeleccionado, setAñoSeleccionado] = useState('')
  const [estudiantes, setEstudiantes] = useState<Alumno[]>([])

  useEffect(() => {
    const fetchPagos = async () => {
      const { data, error } = await supabase
        .from('PagoColegiatura')
        .select('*')
        .order('fecha_pago', { ascending: false })

      if (!error) setPagos(data || [])
      else console.error('Error fetching pagos:', error)
    }

    const fetchEstudiantes = async () => {
      const { data, error } = await supabase
        .from('Alumno')
        .select('id, nombre')

      if (!error) setEstudiantes(data || [])
      else console.error('Error fetching alumnos:', error)
    }

    fetchPagos()
    fetchEstudiantes()
  }, [])

  // Filtrar pagos según mes y año seleccionados
  const pagosFiltrados = pagos.filter((pago) => {
    const fecha = new Date(pago.fecha_pago)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()
    return (
      (mesSeleccionado === '' || mes === mesSeleccionado) &&
      (añoSeleccionado === '' || año === añoSeleccionado)
    )
  })

  // Obtener alumnos deudores (sin pagos en los últimos 60 días)
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - 60);

  const alumnosDeudores = estudiantes.filter((alumno) => {
    const pagosAlumno = pagos.filter((p) => p.id_alumno === alumno.id && p.estado?.toLowerCase().trim() === 'pagado');

    if (pagosAlumno.length === 0) {
      return true;
    }

    const ultimoPago = pagosAlumno.reduce((ultimo, actual) => {
      return new Date(actual.fecha_pago) > new Date(ultimo.fecha_pago) ? actual : ultimo;
    }, pagosAlumno[0])

    return new Date(ultimoPago.fecha_pago) < fechaLimite;
  });

  // Función para generar PDF de comprobante
  const generarPDF = (pago: Pago) => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('Recibo de Pago', 20, 20)

    doc.setFontSize(12)
    doc.text(`Fecha de Pago: ${pago.fecha_pago}`, 20, 40)
    doc.text(`Concepto: ${pago.concepto}`, 20, 50)
    doc.text(`ID Estudiante: ${pago.id_alumno}`, 20, 60)
    doc.text(`Monto: $${pago.monto?.toFixed(2) || '0.00'}`, 20, 70)
    doc.text(`Método de Pago: ${pago.metodo_pago}`, 20, 80)
    doc.text(`Estado: ${pago.estado}`, 20, 90)

    doc.save(`pago_${pago.id_alumno}_${pago.fecha_pago}.pdf`)
  }

  // Utilidad para obtener el último pago de un alumno
  const obtenerUltimoPagoAlumno = (idAlumno: number) => {
    const pagosAlumno = pagos.filter(p => p.id_alumno === idAlumno && p.estado?.toLowerCase() === 'pagado');
    if (pagosAlumno.length === 0) return null;
    
    return pagosAlumno.sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())[0];
  };

  return {
    pagos,
    pagosFiltrados,
    mesSeleccionado,
    setMesSeleccionado,
    añoSeleccionado,
    setAñoSeleccionado,
    estudiantes,
    alumnosDeudores,
    generarPDF,
    obtenerUltimoPagoAlumno
  }
}