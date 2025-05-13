"use client";

import React from "react";
import { useAlumnos, Alumno } from "./usealumnos";

const AlumnosTable = () => {
  const { 
    alumnos, 
    loading, 
    buscarPagoReciente, 
    generarPDF 
  } = useAlumnos();

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Cargando datos de alumnos...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-6 rounded-xl border border-gray-300 shadow-sm bg-white-lg shadow-md">
      <table className="min-w-full bg-min-w-full text-sm text-left border rounded-xl overflow-hidden rounded-lg overflow-hidden">
        <thead className="bg-bg-[#f9f9f9] border-b-1">
          <tr>
            <th className="px-6 py-4 font-semibold">Nombre Completo</th>
            <th className="px-6 py-4 font-semibold">ID Alumno</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold">Monto Último</th>
            <th className="px-6 py-4 font-semibold2">Último Pago</th>
            <th className="px-6 py-4 font-semibold">Reporte</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {alumnos.map((alumno: Alumno) => {
            const pagoReciente = buscarPagoReciente(alumno.id_alumno);

            return (
              <tr key={alumno.id_alumno} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`}
                </td>
                <td className="px-6 py-4">{alumno.id_alumno}</td>
                <td className="px-6 py-4"> {alumno.estado}</td>
                <td className="px-6 py-4">
                  {pagoReciente ? `$${pagoReciente.monto}` : "No registrado"}
                </td>
                <td className="px-6 py-4">
                  {pagoReciente ? pagoReciente.fecha_pago : "No registrado"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => generarPDF(alumno)}
                    className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold px-4 py-1 rounded-lg"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlumnosTable;