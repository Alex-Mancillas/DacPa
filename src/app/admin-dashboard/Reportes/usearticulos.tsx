// hooks/useComprasArticulos.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from '../../lib/supabaseclient';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Declarar para TypeScript que autoTable existe
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const useComprasArticulos = () => {
  const [compras, setCompras] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    // 1. Traer compras
    const { data: comprasData } = await supabase.from("CompraArticulo").select(`
        id_compra,
        id_articulo,
        cantidad,
        precio_unitario
      `);

    setCompras(comprasData || []);

    // 2. Traer artículos
    const { data: articulosData } = await supabase.from("Articulo").select(`
        id_articulo,
        nombre,
        categoria,
        proveedor
      `);

    setArticulos(articulosData || []);
  };

  // Buscar artículo completo
  const buscarArticuloCompleto = (idArticulo: number) => {
    return articulos.find((a) => a.id_articulo === idArticulo);
  };

  // Generar PDF
  const generarPDF = (compra: any) => {
    const articulo = buscarArticuloCompleto(compra.id_articulo);

    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setTextColor("#000000");
    doc.text(
      `Reporte de Compra - ${articulo?.nombre || "No encontrado"}`,
      10,
      20
    );

    // Texto general
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Cálculo de total
    const cantidad = compra.cantidad || 0;
    const precioUnitario = compra.precio_unitario || 0;
    const total = cantidad * precioUnitario;

    // Tabla de resumen
    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Nombre", articulo?.nombre || "No registrado"],
        ["ID Compra", compra.id_compra],
        ["ID Artículo", compra.id_articulo],
        ["Categoría", articulo?.categoria || "No registrado"],
        ["Proveedor", articulo?.proveedor || "No registrado"],
        ["Cantidad", cantidad],
        ["Precio Unitario", `$${precioUnitario}`],
        ["Total", `$${total}`],
      ],
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

    // Abrir el PDF
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return {
    compras,
    articulos,
    buscarArticuloCompleto,
    generarPDF
  };
};

export default useComprasArticulos;