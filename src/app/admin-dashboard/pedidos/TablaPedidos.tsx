"use client";
import React from "react";

interface Articulo {
  nombre: string;
  descripcion: string;
}

interface PedidoArticulo {
  cantidad: number;
  Articulo?: Articulo;
}

interface Alumno {
  nombre: string;
}

interface Pedido {
  id_pedido: number;
  id_alumno: number;
  fecha: string;
  total: number;
  estado: string;
  Alumno?: Alumno;
  articulos?: PedidoArticulo[];
}

interface TablaPedidosProps {
  pedidos: Pedido[];
  actualizado: number | null;
  actualizarEstado: (id_pedido: number, nuevoEstado: string) => void;
}

const opcionesEstado = ["Recibido", "En proceso", "Listo para entrega", "Entregado"];

export default function TablaPedidos({
  pedidos,
  actualizado,
  actualizarEstado,
}: TablaPedidosProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#FFE0E3] text-pink-800 text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">ID Pedido</th>
              <th className="px-6 py-3 text-left">Alumno</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Artículo</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {pedidos.map((pedido) => (
              <tr
                key={pedido.id_pedido}
                className="hover:bg-pink-50 transition duration-200"
              >
                <td className="px-6 py-4">{pedido.id_pedido}</td>
                <td className="px-6 py-4">{pedido.Alumno?.nombre ?? "Sin nombre"}</td>
                <td className="px-6 py-4">{pedido.fecha}</td>
                <td className="px-6 py-4">
                  {(pedido.articulos ?? []).length > 0
                    ? pedido.articulos!
                        .map(
                          (pa) =>
                            `${pa.Articulo?.nombre ?? "?"} x${pa.cantidad}${
                              pa.Articulo?.descripcion
                                ? ` (${pa.Articulo.descripcion})`
                                : ""
                            }`
                        )
                        .join(", ")
                    : "Sin artículos"}
                </td>
                <td className="px-6 py-4">${pedido.total}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={pedido.estado}
                      onChange={(e) =>
                        actualizarEstado(pedido.id_pedido, e.target.value)
                      }
                      className={`border rounded-md px-2 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                        actualizado === pedido.id_pedido
                          ? "bg-green-100 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {opcionesEstado.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                    {actualizado === pedido.id_pedido && (
                      <span className="text-green-600 font-medium">✓</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No hay pedidos en esta sección.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}