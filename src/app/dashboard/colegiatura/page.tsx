"use client" // Indica que este componente se ejecuta en el lado del cliente

import { SetStateAction, useState } from "react"; // Importa el hook useState de React
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"; // Importa componentes de tarjeta
import { Button } from "@/app/components/ui/button"; // Importa el componente de botón
import { Label } from "@/app/components/ui/label"; // Importa el componente de etiqueta
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"; // Importa componentes de selección
import { CreditCard, CheckCircle2 } from "lucide-react"; // Importa íconos de lucide-react
import { createCheckoutSession } from '@/app/actions'


// Componente principal para la página de colegiatura
export default function ColegiaturaPage() {
  // Estados para manejar la información del formulario
  const [estudiante, setEstudiante] = useState(""); // Estado para el estudiante seleccionado
  const [monto, setMonto] = useState("1500.00"); // Estado para el monto a pagar
  const [pagando, setPagando] = useState(false); // Estado para indicar si se está procesando el pago
  const [pagado, setPagado] = useState(false); // Estado para indicar si el pago ha sido realizado

  // Datos de ejemplo de estudiantes
  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A", monto: "1500.00" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B", monto: "1500.00" },
  ];

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const amount = 1500.00

      const url = await createCheckoutSession(Number.parseFloat(amount))


      if (url) {
        window.location.href = url
      } else {
        throw new Error('No se pudo crear la sesion de pago.')
      }
    } catch (error) {
      console.error('Error al procesar el pago: ', error)
      toast({
        title: 'Error',
        description: 'Ocurrio un error al procesar el pago. Intente nuevamente.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false);
    }

  }

  // Función para manejar el proceso de pago
  const handlePagar = () => {
    setPagando(true); // Cambia el estado a "pagando"
    // Simulación de proceso de pago
    setTimeout(() => {
      setPagando(false); // Cambia el estado a "no pagando"
      setPagado(true); // Cambia el estado a "pagado"
      // Resetear después de mostrar confirmación
      setTimeout(() => {
        setPagado(false); // Resetea el estado de "pagado" después de 3 segundos
      }, 3000);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen"> {/* Contenedor principal con padding y fondo gris */}
      <h1 className="text-2xl font-bold mb-6">Pago de Colegiatura</h1> {/* Título de la página */}

      {pagado ? ( // Si el pago ha sido realizado
        <Card className="max-w-md mx-auto"> {/* Tarjeta de confirmación */}
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" /> {/* Icono de éxito */}
            <h2 className="text-xl font-bold text-center">¡Pago Realizado con Éxito!</h2> {/* Mensaje de éxito */}
            <p className="text-center mt-2">El pago de colegiatura por ${monto} ha sido procesado correctamente.</p> {/* Detalle del pago */}
            <Button className="mt-6" onClick={() => setPagado(false)}> {/* Botón para realizar otro pago */}
              Realizar otro pago
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Realizar Pago de Colegiatura</CardTitle>
            <CardDescription>Seleccione el estudiante y complete la información de pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selección de estudiante */}
            <div className="space-y-2">
              <Label htmlFor="estudiante">Seleccione Estudiante</Label>
              <Select
                value={estudiante}
                onValueChange={(value: SetStateAction<string>) => {
                  setEstudiante(value)
                  const est = estudiantes.find((e) => e.id === value)
                  if (est) setMonto(est.monto)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estudiante" />
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

            {estudiante && (
              <>
                {/* Detalles del pago */}
                <div className="space-y-2">
                  <Label>Detalles del Pago</Label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between py-2">
                      <span>Concepto:</span>
                      <span className="font-medium">Colegiatura Mensual</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Mes:</span>
                      <span className="font-medium">Mayo 2024</span>
                    </div>
                    <div className="flex justify-between py-2 border-t">
                      <span>Total a pagar:</span>
                      <span className="font-bold">${monto}</span>
                    </div>
                  </div>
                </div>

                
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!estudiante || pagando} onClick={handlePayment}>
              {pagando ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Realizar Pago
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
