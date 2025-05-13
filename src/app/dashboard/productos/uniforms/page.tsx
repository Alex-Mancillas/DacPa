"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Badge } from "@/app/components/ui/badge"
import { ShoppingCart, Check, Plus, Minus, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"

// Define TypeScript interface for uniform items
interface UniformeStock {
  [key: string]: number;
}

interface Uniforme {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  tallas: string[];
  stock: UniformeStock;
  descripcion: string;
}

export default function UniformesPage() {
  const { toast } = useToast()
  const [uniformes, setUniformes] = useState<Uniforme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [carrito, setCarrito] = useState<{ [key: string]: boolean }>({})
  const [pedidos, setPedidos] = useState<{ [key: string]: boolean }>({})
  const [tallas, setTallas] = useState<{ [key: string]: string }>({})
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({})
  const [carritoCount, setCarritoCount] = useState(0)

  // Fetch uniformes data when component mounts
  useEffect(() => {
    const fetchUniformes = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const response = await fetch('/api/uniformes')
        
        if (!response.ok) {
          throw new Error('Failed to fetch uniformes data')
        }
        
        const data = await response.json()
        setUniformes(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
        toast({
          title: "Error al cargar uniformes",
          description: "No pudimos cargar el catálogo de uniformes. Por favor, intenta más tarde.",
          variant: "destructive",
        })
      }
    }

    fetchUniformes()

    // Load cart data from localStorage if available
    const loadStoredCartData = () => {
      try {
        const storedCarrito = localStorage.getItem('carrito')
        const storedTallas = localStorage.getItem('tallas')
        const storedCantidades = localStorage.getItem('cantidades')
        const storedCarritoCount = localStorage.getItem('carritoCount')
        
        if (storedCarrito) setCarrito(JSON.parse(storedCarrito))
        if (storedTallas) setTallas(JSON.parse(storedTallas))
        if (storedCantidades) setCantidades(JSON.parse(storedCantidades))
        if (storedCarritoCount) setCarritoCount(parseInt(storedCarritoCount, 10))
      } catch (err) {
        console.error('Error loading cart data from localStorage', err)
      }
    }
    
    loadStoredCartData()
  }, [toast])

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(carrito))
      localStorage.setItem('tallas', JSON.stringify(tallas))
      localStorage.setItem('cantidades', JSON.stringify(cantidades))
      localStorage.setItem('carritoCount', carritoCount.toString())
    } catch (err) {
      console.error('Error saving cart data to localStorage', err)
    }
  }, [carrito, tallas, cantidades, carritoCount])

  const handleTallaChange = (id: string, talla: string) => {
    setTallas({ ...tallas, [id]: talla })
    // Inicializar cantidad en 1 si no existe
    if (!cantidades[id]) {
      setCantidades({ ...cantidades, [id]: 1 })
    }
  }

  const incrementarCantidad = (id: string) => {
    setCantidades({ ...cantidades, [id]: (cantidades[id] || 0) + 1 })
  }

  const decrementarCantidad = (id: string) => {
    if (cantidades[id] > 1) {
      setCantidades({ ...cantidades, [id]: cantidades[id] - 1 })
    }
  }

  const agregarAlCarrito = async (id: string) => {
    if (!tallas[id]) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de agregar al carrito",
        variant: "destructive",
      })
      return
    }

    try {
      const uniforme = uniformes.find((u) => u.id === id)
      
      setCarrito({ ...carrito, [id]: true })
      setCarritoCount(carritoCount + 1)
      
      toast({
        title: "Producto agregado al carrito",
        description: `${uniforme?.nombre} (Talla: ${tallas[id]}, Cantidad: ${cantidades[id] || 1}) ha sido agregado al carrito.`,
        duration: 3000,
      })
    } catch (err) {
      toast({
        title: "Error al agregar al carrito",
        description: "Hubo un problema al agregar el producto al carrito.",
        variant: "destructive",
      })
    }
  }

  const solicitarPedido = async (id: string) => {
    if (!tallas[id]) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de solicitar un pedido",
        variant: "destructive",
      })
      return
    }

    try {
      const uniforme = uniformes.find((u) => u.id === id)
      
      setPedidos({ ...pedidos, [id]: true })
      
      toast({
        title: "Pedido solicitado",
        description: `Se ha solicitado ${uniforme?.nombre} (Talla: ${tallas[id]}). Te notificaremos cuando esté disponible.`,
        duration: 3000,
      })
    } catch (err) {
      toast({
        title: "Error al solicitar pedido",
        description: "Hubo un problema al procesar tu solicitud.",
        variant: "destructive",
      })
    }
  }

  // Función para renderizar el badge de stock según la talla seleccionada
  const renderStockBadge = (uniforme: Uniforme, talla: string) => {
    if (!talla) return null

    const stockTalla = uniforme.stock[talla]

    if (stockTalla === 0) {
      return <Badge variant="destructive">Sin existencias</Badge>
    } else if (stockTalla <= 3) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          Pocas existencias
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          En existencia
        </Badge>
      )
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">No pudimos cargar el catálogo</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Uniformes Escolares</h1>

        <Link href="/dashboard/carrito">
          <Button variant="outline" className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ver carrito
            {carritoCount > 0 && (
              <Badge variant="default" className="ml-2">
                {carritoCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {uniformes.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-2">No hay uniformes disponibles</h2>
          <p className="text-gray-600">No se encontraron uniformes en el catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uniformes.map((uniforme) => {
            const tallaSeleccionada = tallas[uniforme.id]
            const sinStock = tallaSeleccionada ? uniforme.stock[tallaSeleccionada] === 0 : false
            const isPedido = pedidos[uniforme.id]

            return (
              <Card key={uniforme.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{uniforme.nombre}</CardTitle>
                      <CardDescription>{uniforme.descripcion}</CardDescription>
                    </div>
                    <div>{tallaSeleccionada && renderStockBadge(uniforme, tallaSeleccionada)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative h-64 w-full md:w-1/2 flex items-center justify-center">
                      <Image
                        src="/uniformeNormalNina.jpg"
                        alt={uniforme.nombre}
                        width={250}
                        height={300}
                        className="object-contain"
                      />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <p className="text-2xl font-bold text-pink-600">${uniforme.precio.toFixed(2)}</p>

                      <div className="space-y-2">
                        <Label htmlFor={`talla-${uniforme.id}`}>Talla</Label>
                        <Select
                          value={tallas[uniforme.id] || ""}
                          onValueChange={(value) => handleTallaChange(uniforme.id, value)}
                        >
                          <SelectTrigger id={`talla-${uniforme.id}`}>
                            <SelectValue placeholder="Seleccionar talla" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniforme.tallas.map((talla) => (
                              <SelectItem key={talla} value={talla}>
                                {talla} {uniforme.stock[talla] === 0 ? " - Sin existencias" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {tallaSeleccionada && sinStock && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-amber-700 text-sm">
                                Esta talla no está disponible actualmente. Puedes solicitar un pedido y te notificaremos
                                cuando esté disponible.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {tallaSeleccionada && (
                        <div className="space-y-2">
                          <Label htmlFor={`cantidad-${uniforme.id}`}>Cantidad</Label>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => decrementarCantidad(uniforme.id)}
                              disabled={!cantidades[uniforme.id] || cantidades[uniforme.id] <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id={`cantidad-${uniforme.id}`}
                              type="number"
                              className="w-16 mx-2 text-center"
                              value={cantidades[uniforme.id] || 1}
                              onChange={(e) => {
                                const val = Number.parseInt(e.target.value)
                                if (val > 0) {
                                  setCantidades({ ...cantidades, [uniforme.id]: val })
                                }
                              }}
                              min={1}
                            />
                            <Button variant="outline" size="icon" onClick={() => incrementarCantidad(uniforme.id)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {tallaSeleccionada && (
                    <>
                      {sinStock ? (
                        <>
                          <Button
                            onClick={() => solicitarPedido(uniforme.id)}
                            disabled={isPedido}
                            variant={isPedido ? "outline" : "default"}
                          >
                            {isPedido ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Pedido solicitado
                              </>
                            ) : (
                              <>
                                <Clock className="mr-2 h-4 w-4" />
                                Solicitar pedido
                              </>
                            )}
                          </Button>
                          {isPedido && (
                            <Link href="/dashboard/pedidos">
                              <Button variant="outline">Ver mis pedidos</Button>
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          <Button onClick={() => agregarAlCarrito(uniforme.id)} disabled={carrito[uniforme.id]}>
                            {carrito[uniforme.id] ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Agregado
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Agregar al carrito
                              </>
                            )}
                          </Button>
                          {carrito[uniforme.id] && (
                            <Link href="/dashboard/carrito">
                              <Button variant="outline">Ver carrito</Button>
                            </Link>
                          )}
                        </>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
      <Toaster />
    </div>
  )
}
