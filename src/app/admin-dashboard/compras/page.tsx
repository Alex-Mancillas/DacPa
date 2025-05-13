"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { ChevronDown, FileText, Search, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { useToast } from "@/app/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { supabase } from "@/app/lib/supabaseclient"

type CompraProveedor = {
  id_compra_proveedor: number;
  proveedor: number; // Cambiado a número
  fecha: string;
  total: number;
  estado: "Pendiente" | "Recibido";
};

export default function ComprasPage() {
  const { toast } = useToast()
  const [filtroStatus, setFiltro] = useState("todos")
  const [valorBusqueda, setBusqueda] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [compras, setCompras] = useState<CompraProveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nuevaCompra, setNuevaCompra] = useState({
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compras a Proveedores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-300 hover:bg-pink-400">
              <ShoppingCart className="mr-2 h-4 w-4" /> Nueva Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-50">
            <DialogHeader>
              <DialogTitle>Nueva Orden de Compra</DialogTitle>
              <DialogDescription>Registra una nueva compra a proveedor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor">ID Proveedor (Número)*</Label>
                <Input 
                  id="proveedor" 
                  type="number"
                  value={nuevaCompra.proveedor}
                  onChange={(e) => setNuevaCompra({...nuevaCompra, proveedor: e.target.value})}
                  placeholder="Ej: 12345" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total*</Label>
                <Input 
                  id="total" 
                  type="number"
                  step="0.01"
                  value={nuevaCompra.total}
                  onChange={(e) => setNuevaCompra({...nuevaCompra, total: e.target.value})}
                  placeholder="Ej: 1500.00" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={crearNuevaCompra}
                className="bg-pink-300 hover:bg-pink-400"
                disabled={saving || !nuevaCompra.proveedor || !nuevaCompra.total}
              >
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compras.length}</div>
            <p className="text-xs text-muted-foreground">
              ${compras.reduce((sum, c) => sum + c.total, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID proveedor..."
            className="pl-8"
            value={valorBusqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-50">
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Pendiente">Pendientes</SelectItem>
            <SelectItem value="Recibido">Recibidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Compras</CardTitle>
          <CardDescription>
            {compras.length} compras registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Compra</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Cargando compras...
                  </TableCell>
                </TableRow>
              ) : comprasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No se encontraron compras
                  </TableCell>
                </TableRow>
              ) : (
                comprasFiltradas.map(compra => (
                  <TableRow key={compra.id_compra_proveedor}>
                    <TableCell className="font-medium">#{compra.id_compra_proveedor}</TableCell>
                    <TableCell>{compra.proveedor}</TableCell>
                    <TableCell>{new Date(compra.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>${compra.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          compra.estado === "Recibido" 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {compra.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {compra.estado === "Pendiente" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => marcarRecibido(compra.id_compra_proveedor)}
                              className="bg-neutral-50 text-green-600"
                            >
                              Marcar como recibido
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}