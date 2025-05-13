// Importa componentes necesarios
import InfoRow from '@/app/components/InfoRow'; // Componente para mostrar una fila de información
import InformationSection from '@/app/components/InformationSection'; // Componente para agrupar secciones de información

// Define la interfaz para los datos del padre
interface ParentData {
  fullName: string; // Nombre completo del padre
  email: string; // Correo electrónico del padre
  phone: string; // Teléfono del padre
  address: string; // Dirección del padre
  city: string; // Ciudad del padre
  postalCode: string; // Código postal del padre
}

// Define la interfaz para los datos del estudiante
interface StudentData {
  fullName: string; // Nombre completo del estudiante
  enrollmentId: string; // Matrícula del estudiante
  grade: string; // Grado del estudiante
  group: string; // Grupo del estudiante
  birthDate: string; // Fecha de nacimiento del estudiante
  father: string; // Nombre del padre del estudiante
  mother: string; // Nombre de la madre del estudiante
}

// Componente principal para la página de perfil
export default function ProfilePage() {
  // Datos del padre
  const parentData: ParentData = {
    fullName: 'Juan Pérez Rodriguez',
    email: 'juan.perez@gmail.com',
    phone: '555-123-4567',
    address: 'Calle Principal #123, Colonia Centro',
    city: 'Ciudad de México',
    postalCode: '01234'
  };

  // Datos del estudiante
  const studentData: StudentData = {
    fullName: 'Carlos Pérez González',
    enrollmentId: 'EST2024-002',
    grade: '3°',
    group: 'B',
    birthDate: '22/08/2014',
    father: 'Juan Pérez Rodriguez',
    mother: 'Maria González López'
  };


  return (
    <div className="bg-white p-6"> {/* Contenedor principal con fondo blanco y padding */}
      <h1 className="text-xl font-bold mb-6">Perfil</h1> {/* Título de la página */}

      <div className="grid grid-cols-2 gap-6"> {/* Contenedor de cuadrícula para secciones de información */}
        {/* Sección de Información del Padre */}
        <InformationSection title="Información del Padre">
          <InfoRow label="Nombre completo" value={parentData.fullName} /> {/* Fila de información para el nombre completo */}
          <InfoRow label="Correo electrónico" value={parentData.email} /> {/* Fila de información para el correo electrónico */}
          <InfoRow label="Teléfono" value={parentData.phone} /> {/* Fila de información para el teléfono */}
          <InfoRow label="Dirección" value={parentData.address} /> {/* Fila de información para la dirección */}
          <InfoRow label="Ciudad" value={parentData.city} /> {/* Fila de información para la ciudad */}
          <InfoRow label="Código Postal" value={parentData.postalCode} /> {/* Fila de información para el código postal */}
        </InformationSection>

        {/* Sección de Información del Estudiante */}
        <InformationSection title="Información del Estudiante">
          <InfoRow label="Nombre completo" value={studentData.fullName} /> {/* Fila de información para el nombre completo del estudiante */}
          <InfoRow label="Matrícula" value={studentData.enrollmentId} /> {/* Fila de información para la matrícula */}
          <InfoRow label="Grado" value={studentData.grade} /> {/* Fila de información para el grado */}
          <InfoRow label="Grupo" value={studentData.group} /> {/* Fila de información para el grupo */}
          <InfoRow label="Fecha de nacimiento" value={studentData.birthDate} /> {/* Fila de información para la fecha de nacimiento */}
          <InfoRow label="Padre" value={studentData.father} /> {/* Fila de información para el padre */}
          <InfoRow label="Madre" value={studentData.mother} /> {/* Fila de información para la madre */}
        </InformationSection>
      </div>
    </div>
  );
}
