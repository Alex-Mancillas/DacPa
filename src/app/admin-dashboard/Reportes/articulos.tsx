// components/ComprasArticulosTable.tsx
"use client";

import React from "react";
import { useComprasArticulos } from "./usearticulos";

const ComprasArticulosTable = () => {
  // Usamos el hook que contiene toda la lógica
  const { compras, buscarArticuloCompleto, generarPDF } = useComprasArticulos();

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border rounded-xl overflow-hidden">
          <thead className="bg-[#f9f9f9] border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Nombre del Artículo</th>
              <th className="px-6 py-4 font-semibold">ID Artículo</th>
              <th className="px-6 py-4 font-semibold">ID Compra</th>
              <th className="px-6 py-4 font-semibold">Reporte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {compras.map((compra) => {
              const articulo = buscarArticuloCompleto(compra.id_articulo);
              return (
                <tr
                  key={`${compra.id_compra}-${compra.id_articulo}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {articulo?.nombre || "No encontrado"}
                  </td>
                  <td className="px-6 py-4">{compra.id_articulo}</td>
                  <td className="px-6 py-4">{compra.id_compra}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => generarPDF(compra)}
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
    </div>
  );
};

export default ComprasArticulosTable;