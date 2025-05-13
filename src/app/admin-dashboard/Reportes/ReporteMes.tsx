// components/ReportesMensualesColegiaturas.tsx
"use client";

import React from "react";
import { useReportesMensuales } from "./useReportesMes";

const ReportesMensualesColegiaturas = () => {
  // Usamos nuestro hook personalizado que contiene toda la lógica
  const { 
    mesSeleccionado, 
    setMesSeleccionado, 
    pagosFiltrados, 
    generarPDF, 
    meses 
  } = useReportesMensuales();

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">
          Reportes Mensuales de Colegiaturas
        </h1>

        {/* Selector de Mes */}
        <div className="flex items-center justify-between mb-6">
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            {meses.map((mes) => (
              <option key={mes.numero} value={mes.numero}>
                {mes.nombre}
              </option>
            ))}
          </select>

          {/* Botón Generar PDF */}
          <button
            onClick={generarPDF}
            className="ml-4 bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-4 rounded-lg"
          >
            Generar PDF
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border rounded-xl overflow-hidden">
            <thead className="bg-[#f9f9f9] border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre Completo</th>
                <th className="px-6 py-4 font-semibold">ID Alumno</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold">Fecha de Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagosFiltrados.map((pago) => (
                <tr key={`${pago.id_alumno}-${pago.fecha_pago}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {`${pago.Alumno?.nombre || ""} ${
                      pago.Alumno?.apellido_paterno || ""
                    } ${pago.Alumno?.apellido_materno || ""}`}
                  </td>
                  <td className="px-6 py-4">{pago.id_alumno}</td>
                  <td className="px-6 py-4">
                    {pago.estado || "No registrado"}
                  </td>
                  <td className="px-6 py-4">${pago.monto}</td>
                  <td className="px-6 py-4">{pago.fecha_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportesMensualesColegiaturas;