"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Separator } from "@/app/components/ui/separator"
import { ShoppingCart, CreditCard, Trash2, CheckCircle2, ArrowLeft } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"

// Simulación de un contexto de carrito (en una aplicación real usaríamos Context API o Redux)
const useCarritoSimulado = () => {
  // Recuperar carrito del localStorage si existe
  const [items, setItems] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Simulamos productos en el carrito (en una app real, esto vendría de localStorage o una API)
    const carritoGuardado = [
      {
        id: "paq-1",
        tipo: "paquete",
        nombre: "Paquete de Libros - 1er Grado",
        precio: 2500,
        cantidad: 1,
        imagen: "/placeholder.svg?height=100&width=80",
      },
      {
        id: "unif-3",
        tipo: "uniforme",
        nombre: "Uniforme Deportivo",
        precio: 850,
        talla: "8",
        cantidad: 1,
        imagen: "/placeholder.svg?height=100&width=80",
      },
      {
        id: "unif-1",
        tipo: "uniforme",
        nombre: "Uniforme de Diario (Niña)",
        precio: 950,
        talla: "6",
        cantidad: 1,
        imagen: "/placeholder.svg?height=100&width=80",
      },
    ]

    setItems(carritoGuardado)
    setCargando(false)
  }, [])

  const eliminarItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const actualizarCantidad = (id: string, cantidad: number) => {
    if (cantidad < 1) return

    setItems(items.map((item) => (item.id === id ? { ...item, cantidad } : item)))
  }

  const vaciarCarrito = () => {
    setItems([])
  }

  const calcularTotal = () => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  return {
    items,
    cargando,
    eliminarItem,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
  }
}

export default function CarritoPage() {
  const { toast } = useToast()
  const { items, cargando, eliminarItem, actualizarCantidad, vaciarCarrito, calcularTotal } = useCarritoSimulado()
  const [ setMetodo] = useState("tarjeta")
  const [estudiante, setEstudiante] = useState("")
  const [procesando, setProcesando] = useState(false)
  const [completado, setCompletado] = useState(false)

  // Datos de ejemplo
  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B" },
  ]

  const handlePagar = () => {
    if (!estudiante) {
      toast({
        title: "Selecciona un estudiante",
        description: "Por favor selecciona un estudiante para continuar con el pago",
        variant: "destructive",
      })
      return
    }

    setProcesando(true)
    // Simulación de proceso de pago
    setTimeout(() => {
      setProcesando(false)
      setCompletado(true)
      // En una app real, aquí vaciaríamos el carrito después de un pago exitoso
    }, 2000)
  }

  if (cargando) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (completado) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-center">¡Compra Realizada con Éxito!</h2>
            <p className="text-center mt-2">
              Tu pedido ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
              <Link href="/dashboard/estado-cuenta">
                <Button>Ver mis compras</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-center">Tu carrito está vacío</h2>
            <p className="text-center mt-2 text-gray-500">No tienes productos en tu carrito de compras.</p>
            <div className="mt-6 flex gap-4">
              <Link href="/dashboard/productos/libros">
                <Button variant="outline">Ver libros</Button>
              </Link>
              <Link href="/dashboard/productos/uniformes">
                <Button>Ver uniformes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({items.length})</CardTitle>
                <CardDescription>Revisa los productos en tu carrito antes de continuar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.imagen || "/placeholder.svg"}
                          alt={item.nombre}
                          width={80}
                          height={100}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{item.nombre}</h3>
                        {item.talla && <p className="text-sm text-gray-500">Talla: {item.talla}</p>}
                        <p className="font-bold">${item.precio.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => eliminarItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={vaciarCarrito}>
                  Vaciar carrito
                </Button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-2xl font-bold">${calcularTotal().toFixed(2)}</p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Resumen y pago */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estudiante">Asignar a estudiante</Label>
                  <Select value={estudiante} onValueChange={setEstudiante}>
                    <SelectTrigger id="estudiante">
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {estudiantes.map((est) => (
                        <SelectItem key={est.id} value={est.id}>
                          {est.nombre} - {est.grado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Método de Pago</Label>
                  <Tabs defaultValue="tarjeta" onValueChange={setMetodo}>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="tarjeta">Tarjeta de Crédito</TabsTrigger>
                      <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tarjeta" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Fecha de Expiración</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input id="cardName" placeholder="Juan Pérez" />
                      </div>
                    </TabsContent>

                    <TabsContent value="transferencia" className="space-y-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-md space-y-2">
                        <p className="font-medium">Datos para Transferencia:</p>
                        <p>Banco: Banco Nacional</p>
                        <p>Cuenta: 0123 4567 8901 2345</p>
                        <p>CLABE: 012 345 6789012345678</p>
                        <p>Beneficiario: Colegio Ejemplo</p>
                        <p>Referencia: {estudiante || "Seleccione estudiante"}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comprobante">Subir Comprobante</Label>
                        <Input id="comprobante" type="file" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handlePagar} disabled={procesando}>
                  {procesando ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagar ${calcularTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}


