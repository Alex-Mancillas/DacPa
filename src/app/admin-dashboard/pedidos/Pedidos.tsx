"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseclient";
import TablaPedidos from "./TablaPedidos"; // ✅ Import correcto

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

const tabs = [
  { id: "Recibido", label: "Recibidos" },
  { id: "En proceso", label: "En Proceso" },
  { id: "Listo para entrega", label: "Listos para Entrega" },
  { id: "Entregado", label: "Entregados" },
];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [actualizado, setActualizado] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Recibido");

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data, error } = await supabase
        .from("Pedido")
        .select(`
          id_pedido,
          id_alumno,
          fecha,
          total,
          estado,
          Alumno (
            nombre
          ),
          articulos:PedidoArticulo (
            cantidad,
            Articulo (
              nombre,
              descripcion
            )
          )
        `);

      if (error) {
        console.error("Error al obtener pedidos:", error.message);
        return;
      }

      const pedidosFormateados = data.map((pedido: any): Pedido => ({
        ...pedido,
        Alumno: Array.isArray(pedido.Alumno) ? pedido.Alumno[0] : pedido.Alumno,
        articulos: Array.isArray(pedido.articulos)
          ? pedido.articulos.map((pa: any) => ({
              cantidad: pa.cantidad,
              Articulo: Array.isArray(pa.Articulo) ? pa.Articulo[0] : pa.Articulo,
            }))
          : [],
      }));

      setPedidos(pedidosFormateados);
    };

    fetchPedidos();
  }, []);

  const actualizarEstado = async (id_pedido: number, nuevoEstado: string) => {
    const { error } = await supabase
      .from("Pedido")
      .update({ estado: nuevoEstado })
      .eq("id_pedido", id_pedido);

    if (error) {
      console.error("Error al actualizar estado:", error.message);
      alert("❌ Ocurrió un error al actualizar el estado.");
      return;
    }

    setPedidos((prev) =>
      prev.map((p) => (p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p))
    );

    alert(`✅ Estado del pedido #${id_pedido} actualizado a "${nuevoEstado}".`);
    setActualizado(id_pedido);
    setTimeout(() => setActualizado(null), 2000);
  };

  const pedidosFiltrados = pedidos.filter((p) => p.estado === activeTab);

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">Gestión de Pedidos</h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full border transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-[#FFE0E3] border-[#ffccd4] text-black font-semibold"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TablaPedidos
        pedidos={pedidosFiltrados}
        actualizado={actualizado}
        actualizarEstado={actualizarEstado}
      />
    </div>
  );
}