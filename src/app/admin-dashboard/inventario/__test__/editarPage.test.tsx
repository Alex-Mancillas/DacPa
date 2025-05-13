import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import EditarArticuloPage from '@/app/admin-dashboard/inventario/articulos/editar/[id]/page'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseclient'
import { useToast } from '@/app/components/ui/use-toast'

// Mock de las dependencias externas
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

jest.mock('@/app/lib/supabaseclient', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

jest.mock('@/app/components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))

// Datos de prueba mock
const mockArticulo = {
  id_articulo: 1,
  nombre: 'Artículo de prueba',
  categoria: 'Uniformes',
  descripcion: 'Descripción de prueba',
  sku: 'TEST123',
  codigo_barras: '123456789',
  precio_venta: 100,
  precio_adquisicion: 50,
  stock_actual: 10,
  stock_minimo: 2,
  stock_inicial: 10,
  proveedor: 'Proveedor de prueba',
  imagen_url: 'https://example.com/image.jpg',
  ultima_actualizacion: '2023-01-01T00:00:00Z',
}

// Funciones auxiliares para reducir la anidación
const mockSingle = (data: any, error: any) => () => ({ data, error })
const mockEq = (data: any, error: any) => () => ({ single: mockSingle(data, error) })
const mockSelect = (data: any, error: any) => () => ({ eq: mockEq(data, error) })

describe('EditarArticuloPage', () => {
  const mockPush = jest.fn()
  const mockToast = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('debe mostrar el estado de carga inicial', () => {
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect(null, null),
    })

    render(<EditarArticuloPage />)
    expect(screen.getByText('Cargando artículo...')).toBeInTheDocument()
  })

  it('debe manejar errores al cargar el artículo', async () => {
    const errorMessage = 'Error de prueba al cargar'
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect(null, { message: errorMessage }),
    })

    render(<EditarArticuloPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No se pudo cargar el artículo',
        variant: 'destructive',
      })
      expect(mockPush).toHaveBeenCalledWith('/admin-dashboard/inventario/articulos')
    })
  })

  it('debe mostrar el mensaje de artículo no encontrado', async () => {
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect(null, null),
    })

    render(<EditarArticuloPage />)

    await waitFor(() => {
      expect(screen.getByText('Artículo no encontrado')).toBeInTheDocument()
    })
  })
})
