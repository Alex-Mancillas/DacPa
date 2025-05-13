"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function HistoriaDesarrolloMiniForm() {
  const [formData, setFormData] = useState({
    talla: "",
    peso: "",
    tieneMalformacion: "",
    malformaciones: "",
    enfermedades: "",
    alergias: "",
    vacunas: [] as string[],
    tieneServicioMedico: "",
    servicio_medico: "",
    control_esfinteres_diurno: "",
    control_esfinteres_nocturno: "",
    horas_sueño: "",
    tipo_sueño: "",
    comparteCama: "",
    tipo_cama: "", // ahora se guarda en tipo_cama
    desayuno: "",
    comida: "",
    cena: "",
    edad_camino: "",
    edad_hablo: "",
    lateralidad: "",
    lenguaje: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, checked } = e.target as HTMLInputElement;

    if (name === "vacunas") {
      setFormData(prev => {
        const vacunasSet = new Set(prev.vacunas);
        if (checked) vacunasSet.add(value);
        else vacunasSet.delete(value);
        return { ...prev, vacunas: Array.from(vacunasSet) };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const datosAGuardar = {
      id_alumno: 3,
      talla: formData.talla,
      peso: formData.peso,
      malformaciones: formData.tieneMalformacion === "Sí" ? formData.malformaciones : "",
      enfermedades: formData.enfermedades,
      alergias: formData.alergias,
      vacunas: formData.vacunas.join(", "),
      servicio_medico: formData.tieneServicioMedico === "Sí" ? formData.servicio_medico : "",
      control_esfinteres_diurno: formData.control_esfinteres_diurno,
      control_esfinteres_nocturno: formData.control_esfinteres_nocturno,
      horas_sueño: parseInt(formData.horas_sueño, 10),
      tipo_sueño: formData.tipo_sueño,
      tipo_cama: formData.comparteCama === "Sí" ? formData.tipo_cama : "Duerme solo",
      desayuno: formData.desayuno,
      comida: formData.comida,
      cena: formData.cena,
      edad_camino: formData.edad_camino,
      edad_hablo: formData.edad_hablo,
      lateralidad: formData.lateralidad,
      lenguaje: formData.lenguaje,    
    };

    console.log("🚀 Datos a guardar:", datosAGuardar);

    try {
      const { error } = await supabase
        .from("HistoriaDesarrollo")
        .insert([datosAGuardar]);

      if (error) throw error;

      alert("✅ Registro exitoso");
    } catch (err: any) {
      console.error("Error:", err);
      alert(`❌ Error: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">
        Historia de Desarrollo (Simulación)
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Talla */}
        <Input label="Talla" name="talla" value={formData.talla} onChange={handleChange} />

        {/* Peso */}
        <Input label="Peso" name="peso" value={formData.peso} onChange={handleChange} />
         {/* Malformaciones */}
         <fieldset>
          <legend className="font-medium mb-2">¿Presenta alguna malformación aparente?</legend>
          {["Sí", "No"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="tieneMalformacion"
                value={opt}
                checked={formData.tieneMalformacion === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {formData.tieneMalformacion === "Sí" && (
          <div>
            <label className="font-medium">Describe la malformación:</label>
            <input
              type="text"
              name="malformaciones"
              value={formData.malformaciones}
              onChange={handleChange}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: Labio leporino, pie plano..."
            />
          </div>
        )}

        {/* Enfermedades */}
        <div>
          <label className="font-medium">Enfermedades que padece</label>
          <textarea
            name="enfermedades"
            value={formData.enfermedades}
            onChange={handleChange}
            rows={3}
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: Asma, bronquitis, etc."
          />
        </div>

        {/* Alergias */}
        <div>
          <label className="font-medium">Alergias que padece</label>
          <textarea
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            rows={3}
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: Alergia al polen, alimentos, medicamentos..."
          />
        </div>
         {/* Vacunas */}
         <fieldset>
          <legend className="font-medium mb-2">Vacunas y refuerzos recibidos</legend>
          {["Triple", "Sarampión", "Polio", "Tuberculosis"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="checkbox"
                name="vacunas"
                value={opt}
                checked={formData.vacunas.includes(opt)}
                onChange={handleChange}
                className="form-checkbox mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>
        {/* Servicio médico */}
        <fieldset>
          <legend className="font-medium mb-2">¿Cuenta con servicio médico?</legend>
          {["Sí", "No"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="tieneServicioMedico"
                value={opt}
                checked={formData.tieneServicioMedico === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {formData.tieneServicioMedico === "Sí" && (
          <div>
            <label className="font-medium">¿Cuál servicio médico?</label>
            <input
              type="text"
              name="servicio_medico"
              value={formData.servicio_medico}
              onChange={handleChange}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: IMSS, ISSSTE, Seguro Privado..."
            />
          </div>
        )}

        {/* Control de esfínteres */}
        <div>
          <label className="font-medium">Edad del control de esfínteres diurno</label>
          <input
            type="text"
            name="control_esfinteres_diurno"
            value={formData.control_esfinteres_diurno}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: 2 años"
          />
        </div>

        <div>
          <label className="font-medium">Edad del control de esfínteres nocturno</label>
          <input
            type="text"
            name="control_esfinteres_nocturno"
            value={formData.control_esfinteres_nocturno}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: 3 años"
          />
        </div>
        {/* Horas de sueño */}
        <div>
          <label className="font-medium">¿Cuántas horas duerme?</label>
          <input
            type="number"
            name="horas_sueño"
            value={formData.horas_sueño}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: 8"
          />
        </div>

        {/* Tipo de sueño */}
        <fieldset>
          <legend className="font-medium mb-2">Tipo de sueño</legend>
          {["Tranquilo", "Intranquilo"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="tipo_sueño"
                value={opt}
                checked={formData.tipo_sueño === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Comparte cama */}
        <fieldset>
          <legend className="font-medium mb-2">¿Comparte cama?</legend>
          {["Sí", "No"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="comparteCama"
                value={opt}
                checked={formData.comparteCama === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Si comparte cama, ¿con quién? */}
        {formData.comparteCama === "Sí" && (
          <div>
            <label className="font-medium">¿Con quién comparte cama?</label>
            <input
              type="text"
              name="tipo_cama"
              value={formData.tipo_cama}
              onChange={handleChange}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: Mamá, Papá, Hermano..."
            />
          </div>
        )}
        {/* Alimentación */}
        <Input label="¿Qué desayuna normalmente?" name="desayuno" value={formData.desayuno} onChange={handleChange} />
        <Input label="¿Qué come normalmente?" name="comida" value={formData.comida} onChange={handleChange} />
        <Input label="¿Qué cena normalmente?" name="cena" value={formData.cena} onChange={handleChange} />

        {/* Edad en que caminó */}
        <Input label="¿A qué edad caminó?" name="edad_camino" value={formData.edad_camino} onChange={handleChange} />

        {/* Edad en que habló */}
        <Input label="¿A qué edad habló?" name="edad_hablo" value={formData.edad_hablo} onChange={handleChange} />

        {/* Lateridad */}
        <fieldset>
          <legend className="font-medium mb-2">Lateridad</legend>
          {["Diestro", "Zurdo", "No definido"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="lateralidad"
                value={opt}
                checked={formData.lateralidad === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Descripción del lenguaje */}
        <div>
          <label className="font-medium">Describe brevemente el lenguaje del niño</label>
          <textarea
            name="lenguaje"
            value={formData.lenguaje}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: Habla claramente, usa frases cortas, aún balbucea, etc."
          />
        </div>
        {/* Botón */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white font-bold px-6 py-2 rounded hover:bg-pink-700 transition"
          >
            {loading ? "Guardando…" : "Registrar"}
          </button>
        </div>

      </form>
    </div>
  );
}

// Componente Input
function Input({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
        required
      />
    </div>
  );
}
