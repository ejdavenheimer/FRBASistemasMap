import type { Materia } from '../types';

export const PLAN_ESTUDIOS_INICIAL: Materia[] = [
  // --- 1º AÑO ---
  { id: 'am1', nombre: 'Análisis Matemático I', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'aga', nombre: 'Álgebra y Geometría Analítica', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'fisica1', nombre: 'Física I', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'sistemas-procesos-de-negocios', nombre: 'Sistemas y Procesos de Negocio', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'algoritmos', nombre: 'Algoritmos y Estructuras de Datos', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'arquitectura', nombre: 'Arquitectura de Computadoras', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'logica', nombre: 'Lógica y Estructuras Discretas', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'ingles1', nombre: 'Inglés I', anio: 1, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },

  // --- 2º AÑO ---
  { id: 'am2', nombre: 'Análisis Matemático II', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['am1', 'aga'], finales: [] }, paraRendir: { finales: ['am1', 'aga'] } } },
  { id: 'fisica2', nombre: 'Física II', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['am1', 'fisica1'], finales: [] }, paraRendir: { finales: ['am1', 'fisica1'] } } },
  { id: 'sintaxis', nombre: 'Sintaxis y Semántica de los Lenguajes', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['algoritmos', 'logica'], finales: [] }, paraRendir: { finales: ['algoritmos', 'logica'] } } },
  { id: 'paradigmas', nombre: 'Paradigmas de Programación', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['algoritmos', 'logica'], finales: [] }, paraRendir: { finales: ['algoritmos', 'logica'] } } },
  { id: 'analisis-sistemas', nombre: 'Análisis de Sistemas de Información', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['sistemas-procesos-de-negocios', 'algoritmos'], finales: [] }, paraRendir: { finales: ['sistemas-procesos-de-negocios', 'algoritmos'] } } },
  { id: 'so', nombre: 'Sistemas Operativos', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['arquitectura'], finales: [] }, paraRendir: { finales: ['arquitectura'] } } },
  { id: 'probabilidad', nombre: 'Probabilidad y Estadística', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['am1', 'aga'], finales: [] }, paraRendir: { finales: ['am1', 'aga'] } } },
  { id: 'ing-sociedad', nombre: 'Ingeniería y Sociedad', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'ingles2', nombre: 'Inglés II', anio: 2, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['ingles1'], finales: [] }, paraRendir: { finales: ['ingles1'] } } },

  // --- 3º AÑO ---
  { id: 'economia', nombre: 'Economía', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['analisis-sistemas'], finales: ['am1', 'aga'] }, paraRendir: { finales: [] } } },
  { id: 'bases-datos', nombre: 'Bases de Datos', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['sintaxis', 'analisis-sistemas'], finales: ['algoritmos', 'logica'] }, paraRendir: { finales: [] } } },
  { id: 'desarrollo-sw', nombre: 'Desarrollo de Software', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['paradigmas', 'analisis-sistemas'], finales: ['algoritmos', 'logica'] }, paraRendir: { finales: [] } } },
  { id: 'comunicaciones', nombre: 'Comunicación de Datos', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: [], finales: ['fisica1', 'arquitectura'] }, paraRendir: { finales: [] } } },
  { id: 'analisis-numerico', nombre: 'Análisis Numérico', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['am2'], finales: ['am1', 'aga'] }, paraRendir: { finales: [] } } },
  { id: 'diseno-sistemas', nombre: 'Diseño de Sistemas de Información', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['paradigmas', 'analisis-sistemas'], finales: ['sistemas-procesos-de-negocios', 'algoritmos'] }, paraRendir: { finales: [] } } },
  { id: 'electiva-3-1', nombre: 'Electiva I', anio: 3, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['paradigmas', 'analisis-sistemas'], finales: [] }, paraRendir: { finales: [] } } },

  // --- 4º AÑO ---
  { id: 'legislacion', nombre: 'Legislación', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['ing-sociedad'], finales: ['ingles1'] }, paraRendir: { finales: [] } } },
  { id: 'ing-calidad-sw', nombre: 'Ingeniería y Calidad de Software', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['bases-datos', 'desarrollo-sw', 'diseno-sistemas'], finales: ['sintaxis', 'paradigmas'] }, paraRendir: { finales: [] } } },
  { id: 'redes', nombre: 'Redes de Datos', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['comunicaciones', 'so'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'operativa', nombre: 'Investigación Operativa', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['probabilidad', 'analisis-numerico'], finales: ['am2'] }, paraRendir: { finales: [] } } },
  { id: 'simulacion', nombre: 'Simulación', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['probabilidad'], finales: ['am2'] }, paraRendir: { finales: [] } } },
  { id: 'automatizacion', nombre: 'Tecnologías para la Automatización', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['fisica2', 'analisis-numerico'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'admin-sistemas', nombre: 'Administración de Sistemas de Información', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['economia', 'diseno-sistemas'], finales: ['analisis-sistemas'] }, paraRendir: { finales: [] } } },
  { id: 'electiva-4-1', nombre: 'Electiva II', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['diseno-sistemas'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'electiva-4-2', nombre: 'Electiva III', anio: 4, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['diseno-sistemas'], finales: [] }, paraRendir: { finales: [] } } },

  // --- 5º AÑO ---
  { id: 'ia', nombre: 'Inteligencia Artificial', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['simulacion', 'operativa'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'ciencia-datos', nombre: 'Ciencia de Datos', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['simulacion', 'bases-datos'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'sistemas-gestion', nombre: 'Sistemas de Gestión', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['economia', 'operativa'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'gestion-gerencial', nombre: 'Gestión Gerencial', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['admin-sistemas', 'legislacion'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'seguridad-info', nombre: 'Seguridad en los Sistemas de Información', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['redes', 'ing-calidad-sw'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'proyecto-final', nombre: 'Proyecto Final', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['admin-sistemas', 'redes', 'ing-calidad-sw', 'automatizacion'], finales: ['diseno-sistemas', 'comunicaciones', 'economia', 'am2', 'fisica2', 'sintaxis', 'paradigmas', 'so', 'probabilidad'] }, paraRendir: { finales: [] } } },
  { id: 'electiva-5-1', nombre: 'Electiva IV', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'electiva-5-2', nombre: 'Electiva V', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'electiva-5-3', nombre: 'Electiva VI', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, paraRendir: { finales: [] } } },
  { id: 'electiva-5-4', nombre: 'Electiva VII', anio: 5, estado: 'pendiente', requerimientos: { paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, paraRendir: { finales: [] } } },
];