"use client";

import { useState, useEffect } from "react";
import { supabase } from '../../lib/supabaseclient';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Definición del tipo para jsPDF + autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Tipos
export type Alumno = {
  id_alumno: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  estado: string;
};

export type Pago = {
  id_alumno: number;
  monto: number;
  fecha_pago: string;
};

export function useAlumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    setLoading(true);
    
    // Obtener datos de alumnos
    const { data: alumnosData, error: alumnosError } = await supabase
      .from("Alumno")
      .select(`
        id_alumno,
        nombre,
        apellido_paterno,
        apellido_materno,
        estado
      `);

    if (alumnosError) {
      console.error("Error al obtener alumnos:", alumnosError);
    } else {
      setAlumnos(alumnosData || []);
    }

    // Obtener datos de pagos
    const { data: pagosData, error: pagosError } = await supabase
      .from("PagoColegiatura")
      .select(`
        id_alumno,
        monto,
        fecha_pago
      `);

    if (pagosError) {
      console.error("Error al obtener pagos:", pagosError);
    } else {
      setPagos(pagosData || []);
    }

    setLoading(false);
  };

  // Buscar todos los pagos de un alumno
  const buscarPagosAlumno = (idAlumno: number) => {
    return pagos.filter((pago) => pago.id_alumno === idAlumno);
  };

  // Buscar el pago más reciente de un alumno
  const buscarPagoReciente = (idAlumno: number) => {
    const pagosAlumno = buscarPagosAlumno(idAlumno);
    
    if (pagosAlumno.length === 0) {
      return null;
    }

    return pagosAlumno.reduce(
      (a: Pago, b: Pago) =>
        new Date(a.fecha_pago) > new Date(b.fecha_pago) ? a : b,
      pagosAlumno[0]
    );
  };

  // Generar PDF de pagos
  const generarPDF = (alumno: Alumno) => {
    const pagosAlumno = buscarPagosAlumno(alumno.id_alumno);

    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.setTextColor("#000000"); 
    doc.text(
      `Reporte de Pagos - ${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`,
      10,
      20
    );

    // Info general
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Regresar a negro para el texto normal
    doc.text(`ID Alumno: ${alumno.id_alumno}`, 10, 30);
    doc.text(`Estado: ${alumno.estado}`, 10, 40);
    doc.text(
      `Fecha de reporte: ${new Date().toLocaleDateString("es-MX")}`,
      10,
      50
    );

    // Tabla de pagos
    const rows = pagosAlumno.map((pago: Pago) => [
      `$${pago.monto}`,
      pago.fecha_pago,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Monto", "Fecha de Pago"]],
      body: rows,
      headStyles: {
        fillColor: [255, 224, 227], // Color FFE0E3 en formato RGB
        textColor: 0, // Texto negro en cabecera
      },
      styles: {
        lineColor: [255, 224, 227], // Color FFE0E3 para líneas
        textColor: 0, // Texto negro en el cuerpo
      },
    });

    // Abrir el PDF en nueva pestaña
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return {
    alumnos,
    pagos,
    loading,
    buscarPagosAlumno,
    buscarPagoReciente,
    generarPDF,
    obtenerDatos
  };
}