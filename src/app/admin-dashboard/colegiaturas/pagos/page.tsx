'use client'
import React from 'react';
import { usePagos, Pago } from './usepagos';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import {
  Label
} from '@/app/components/ui/label'

export default function PagosPage() {
  const {
    pagosFiltrados,
    mesSeleccionado,
    setMesSeleccionado,
    añoSeleccionado,
    setAñoSeleccionado,
    alumnosDeudores,
    generarPDF,
    obtenerUltimoPagoAlumno
  } = usePagos();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Tabs defaultValue="recientes">
        <TabsList className="mb-6">
          <TabsTrigger value="recientes">Pagos Recientes</TabsTrigger>
          <TabsTrigger value="deudores">Deudores</TabsTrigger>
        </TabsList>

        {/* Pagos Recientes */}
        <TabsContent value="recientes">
          <h1 className="text-2xl font-bold mb-4">Pagos Recientes de Colegiaturas</h1>
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <Label>Mes</Label>
              <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)} className="border px-3 py-1 rounded">
                <option value="">Todos</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {new Date(0, i).toLocaleString('es-MX', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Año</Label>
              <select value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(e.target.value)} className="border px-3 py-1 rounded">
                <option value="">Todos</option>
                {[2025, 2024, 2023].map((a) => (
                  <option key={a} value={String(a)}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm text-sm">
              <thead className="bg-pink-200 text-left font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Fecha de Pago</th>
                  <th className="px-4 py-2 border">Concepto</th>
                  <th className="px-4 py-2 border">ID Estudiante</th>
                  <th className="px-4 py-2 border">Monto</th>
                  <th className="px-4 py-2 border">Método de Pago</th>
                  <th className="px-4 py-2 border">Estado</th>
                  <th className="px-4 py-2 border">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.length > 0 ? pagosFiltrados.map((pago: Pago, index: number) => (
                  <tr key={index} className="text-gray-800">
                    <td className="px-4 py-2 border">{pago.fecha_pago}</td>
                    <td className="px-4 py-2 border">{pago.concepto}</td>
                    <td className="px-4 py-2 border">{pago.id_alumno}</td>
                    <td className="px-4 py-2 border">${pago.monto?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2 border">{pago.metodo_pago}</td>
                    <td className="px-4 py-2 border text-green-600 font-semibold">{pago.estado}</td>
                    <td className="px-4 py-2 border">
                      <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded" onClick={() => generarPDF(pago)}>Descargar PDF</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">No hay pagos en este mes y año seleccionados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Deudores */}
        <TabsContent value="deudores">
          <h1 className="text-2xl font-bold mb-4">Deudores</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm">
              <thead className="bg-pink-200">
                <tr>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Último pago</th>
                  <th className="px-4 py-2 border">Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDeudores.map((alumno, index) => {
                  const ultimoPago = obtenerUltimoPagoAlumno(alumno.id);
                  return (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{alumno.nombre}</td>
                      <td className="px-4 py-2 border">{ultimoPago ? ultimoPago.fecha_pago : 'Sin pagos registrados'}</td>
                      <td className="px-4 py-2 border">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded">Enviar correo</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}