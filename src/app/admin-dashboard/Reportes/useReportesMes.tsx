// hooks/useReportesMensuales.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from '../../lib/supabaseclient';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Definimos el array de meses como una constante exportable
export const meses = [
  { nombre: "Enero", numero: 1 },
  { nombre: "Febrero", numero: 2 },
  { nombre: "Marzo", numero: 3 },
  { nombre: "Abril", numero: 4 },
  { nombre: "Mayo", numero: 5 },
  { nombre: "Junio", numero: 6 },
  { nombre: "Julio", numero: 7 },
  { nombre: "Agosto", numero: 8 },
  { nombre: "Septiembre", numero: 9 },
  { nombre: "Octubre", numero: 10 },
  { nombre: "Noviembre", numero: 11 },
  { nombre: "Diciembre", numero: 12 },
];

// Definimos las interfaces para tipado
interface Alumno {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

interface Pago {
  id_alumno: number;
  monto: number;
  fecha_pago: string;
  estado: string;
  Alumno?: Alumno;
}

export const useReportesMensuales = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState(1);
  const [pagos, setPagos] = useState<Pago[]>([]);

  // Cargamos los datos al iniciar
  useEffect(() => {
    obtenerPagos();
  }, []);

  // Función para obtener pagos de Supabase
  const obtenerPagos = async () => {
    const { data, error } = await supabase
      .from("PagoColegiatura")
      .select(`
        id_alumno,
        monto,
        fecha_pago,
        estado,  
        Alumno:PagoColegiaturaa_id_alumno_fkey (
          nombre,
          apellido_paterno,
          apellido_materno
        )
      `);

    if (error) {
      console.error("❌ Error al cargar pagos:", error.message);
      return;
    }

    // ✅ Corregimos el tipo de Alumno si viene como array
    const pagosFormateados = (data || []).map((pago: any) => ({
      ...pago,
      Alumno: Array.isArray(pago.Alumno) ? pago.Alumno[0] : pago.Alumno ?? null,
    }));

    setPagos(pagosFormateados);
  };

  // Filtramos los pagos por mes seleccionado
  const pagosFiltrados = pagos.filter((pago) => {
    if (!pago.fecha_pago) return false;
    const fecha = new Date(pago.fecha_pago);
    return fecha.getMonth() + 1 === mesSeleccionado;
  });

  // Generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor("#000000");
    const nombreMes =
      meses.find((mes) => mes.numero === mesSeleccionado)?.nombre || "";
    doc.text(`Reporte de Colegiaturas - ${nombreMes}`, 10, 20);

    const rows = pagosFiltrados.map((pago) => [
      `${pago.Alumno?.nombre || ""} ${pago.Alumno?.apellido_paterno || ""} ${
        pago.Alumno?.apellido_materno || ""
      }`,
      pago.id_alumno,
      pago.estado || "No registrado",
      `$${pago.monto}`,
      pago.fecha_pago,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        ["Nombre Completo", "ID Alumno", "Estado", "Monto", "Fecha de Pago"],
      ],
      body: rows,
      headStyles: {
        fillColor: [255, 224, 227],
        textColor: 0,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: 0,
        halign: "center",
      },
      styles: {
        lineColor: [255, 224, 227],
        fontSize: 11,
      },
      theme: "striped",
      tableLineColor: [255, 224, 227],
      tableLineWidth: 0.1,
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return {
    mesSeleccionado,
    setMesSeleccionado,
    pagosFiltrados,
    generarPDF,
    meses
  };
};

export default useReportesMensuales;
