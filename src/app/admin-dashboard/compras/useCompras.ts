"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/app/components/ui/use-toast"
import { supabase } from "@/app/lib/supabaseclient"

// Tipos
export type CompraProveedor = {
  id_compra_proveedor: number;
  proveedor: number;
  fecha: string;
  total: number;
  estado: "Pendiente" | "Recibido";
};

export type NuevaCompra = {
  proveedor: string;
  total: string;
};

export function useCompras() {
  const { toast } = useToast()
  const [filtroStatus, setFiltro] = useState("todos")
  const [valorBusqueda, setBusqueda] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [compras, setCompras] = useState<CompraProveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nuevaCompra, setNuevaCompra] = useState<NuevaCompra>({
    proveedor: "",
    total: "",
  })

  // Cargar compras al iniciar
  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('CompraProveedor')
          .select('*')
          .order('fecha', { ascending: false })

        if (error) throw error
        
        console.log("Datos cargados:", data) // Para debug
        setCompras(data || [])
      } catch (error) {
        console.error('Error cargando compras:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las compras",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchCompras()
  }, [])

  // Filtrar compras
  const comprasFiltradas = compras.filter(compra => {
    const porEstado = filtroStatus === "todos" || compra.estado === filtroStatus
    const porBusqueda = compra.proveedor.toString().includes(valorBusqueda)
    return porEstado && porBusqueda
  })

  // Marcar como recibido
  const marcarRecibido = async (id: number) => {
    try {
      const { error } = await supabase
        .from('CompraProveedor')
        .update({ estado: 'Recibido' })
        .eq('id_compra_proveedor', id)

      if (error) throw error

      setCompras(compras.map(c => 
        c.id_compra_proveedor === id ? { ...c, estado: 'Recibido' } : c
      ))

      toast({
        title: "Actualizado",
        description: `Compra #${id} marcada como recibida`,
      })
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      })
    }
  }

  const crearNuevaCompra = async () => {
    try {
      setSaving(true);
      
      // Validación mejorada
      if (!nuevaCompra.proveedor.trim() || !nuevaCompra.total.trim()) {
        throw new Error("Todos los campos son requeridos");
      }
  
      const proveedorNum = parseInt(nuevaCompra.proveedor);
      const totalNum = parseFloat(nuevaCompra.total);
  
      if (isNaN(proveedorNum) || proveedorNum <= 0) {
        throw new Error("ID de proveedor debe ser un número válido");
      }
  
      if (isNaN(totalNum) || totalNum <= 0) {
        throw new Error("Total debe ser un número válido mayor a 0");
      }
  
      // 1. Primero verifica la conexión
      console.log("Intentando conectar con Supabase...");
  
      // 2. Intenta una inserción mínima
      const { data, error, status, statusText } = await supabase
        .from('CompraProveedor')
        .insert([{
          proveedor: proveedorNum,
          total: totalNum,
          fecha: new Date().toISOString(),
          estado: 'Pendiente'
        }])
        .select('*');  // Asegúrate de incluir .select() para obtener la respuesta
  
      console.log("Respuesta de Supabase:", {
        status,
        statusText,
        data,
        error
      });
  
      if (error) {
        console.error("Detalles completos del error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
  
      if (!data || data.length === 0) {
        throw new Error("No se recibieron datos de la inserción");
      }
  
      // Actualizar estado local
      setCompras([data[0], ...compras]);
      
      toast({
        title: "✅ Compra creada",
        description: `Compra #${data[0].id_compra_proveedor} registrada`,
      });
  
      // Resetear formulario
      setNuevaCompra({ proveedor: "", total: "" });
      setIsDialogOpen(false);
  
    } catch (error: any) {
      console.error("Error completo:", JSON.stringify(error, null, 2));
      
      toast({
        title: "❌ Error al crear compra",
        description: error.message || "Error desconocido al crear la compra",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Calcular totales
  const totalCompras = compras.length;
  const sumaTotal = compras.reduce((sum, c) => sum + c.total, 0);

  return {
    // Estados
    filtroStatus,
    valorBusqueda,
    isDialogOpen,
    compras,
    comprasFiltradas,
    loading,
    saving,
    nuevaCompra,
    totalCompras,
    sumaTotal,

    // Acciones
    setFiltro,
    setBusqueda,
    setIsDialogOpen,
    setNuevaCompra,
    marcarRecibido,
    crearNuevaCompra
  }
}