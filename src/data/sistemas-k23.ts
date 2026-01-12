import type { Materia } from '../types';

export const PLAN_ESTUDIOS_INICIAL: Materia[] = [
  // --- PRIMER AÑO (8 Materias) ---
  {
    id: 'am1',
    nombre: 'Análisis Matemático I',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'aga',
    nombre: 'Álgebra y Geometría Analítica',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'fisica1',
    nombre: 'Física I',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'sistemas-organizaciones',
    nombre: 'Sistemas y Procesos de Negocio',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'algoritmos',
    nombre: 'Algoritmos y Estructuras de Datos',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'arquitectura',
    nombre: 'Arquitectura de Computadoras',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'logica',
    nombre: 'Lógica y Estructuras Discretas',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },
  {
    id: 'ingles1',
    nombre: 'Inglés I',
    anio: 1,
    estado: 'pendiente',
    requerimientos: { paraCursar: { cursadas: [], finales: [] }, paraRendir: { finales: [] } }
  },

  // --- SEGUNDO AÑO (9 Materias) ---
  {
    id: 'am2',
    nombre: 'Análisis Matemático II',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['am1', 'aga'], finales: [] }, 
      paraRendir: { finales: ['am1', 'aga'] } 
    }
  },
  {
    id: 'fisica2',
    nombre: 'Física II',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['fisica1', 'am1'], finales: [] }, 
      paraRendir: { finales: ['fisica1', 'am1'] } 
    }
  },
  {
    id: 'sintaxis',
    nombre: 'Sintaxis y Semántica de los Lenguajes',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['algoritmos', 'logica'], finales: [] }, 
      paraRendir: { finales: ['algoritmos', 'logica'] } 
    }
  },
  {
    id: 'paradigmas',
    nombre: 'Paradigmas de Programación',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['algoritmos', 'logica'], finales: [] }, 
      paraRendir: { finales: ['algoritmos', 'logica'] } 
    }
  },
  {
    id: 'analisis-sistemas',
    nombre: 'Análisis de Sistemas de Información',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['sistemas-organizaciones', 'algoritmos'], finales: [] }, 
      paraRendir: { finales: ['sistemas-organizaciones', 'algoritmos'] } 
    }
  },
  {
    id: 'so',
    nombre: 'Sistemas Operativos',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['arquitectura', 'algoritmos'], finales: [] }, 
      paraRendir: { finales: ['arquitectura', 'algoritmos'] } 
    }
  },
  {
    id: 'probabilidad',
    nombre: 'Probabilidad y Estadística',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['am1', 'aga'], finales: [] }, 
      paraRendir: { finales: ['am1', 'aga'] } 
    }
  },
  {
    id: 'ing-sociedad',
    nombre: 'Ingeniería y Sociedad',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: [], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'ingles2',
    nombre: 'Inglés II',
    anio: 2,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['ingles1'], finales: [] }, 
      paraRendir: { finales: ['ingles1'] } 
    }
  },

  // --- TERCER AÑO (6 Troncales + 1 Electiva) ---
  {
    id: 'diseno-sistemas',
    nombre: 'Diseño de Sistemas de Información',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      // Pide finales de las troncales de 1ero y cursadas de las de 2do
      paraCursar: { cursadas: ['analisis-sistemas', 'paradigmas'], finales: ['sistemas-organizaciones', 'algoritmos'] }, 
      paraRendir: { finales: ['analisis-sistemas', 'paradigmas'] } 
    }
  },
  {
    id: 'comunicaciones',
    nombre: 'Comunicaciones de Datos',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      // VALIDADO: Pide Final de Física 1 + Cursada de Física 2 y Arqui
      paraCursar: { cursadas: ['arquitectura', 'fisica2', 'am2'], finales: ['fisica1'] }, 
      paraRendir: { finales: ['arquitectura', 'fisica2', 'am2'] } 
    }
  },
  {
    id: 'analisis-numerico',
    nombre: 'Análisis Numérico',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['am2', 'algoritmos'], finales: [] }, 
      paraRendir: { finales: ['am2', 'algoritmos'] } 
    }
  },
  {
    id: 'bases-datos',
    nombre: 'Bases de Datos',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['diseno-sistemas', 'sintaxis'], finales: [] }, 
      paraRendir: { finales: ['diseno-sistemas', 'sintaxis'] } 
    }
  },
  {
    id: 'desarrollo-sw',
    nombre: 'Desarrollo de Software',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['paradigmas', 'diseno-sistemas'], finales: [] }, 
      paraRendir: { finales: ['paradigmas', 'diseno-sistemas'] } 
    }
  },
  {
    id: 'economia',
    nombre: 'Economía',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['analisis-sistemas'], finales: [] }, 
      paraRendir: { finales: ['analisis-sistemas'] } 
    }
  },
  // Electiva 3º (1 Materia)
  {
    id: 'electiva-3er-ano',
    nombre: 'Electiva I (3º Año)',
    anio: 3,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['paradigmas', 'analisis-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },

  // --- CUARTO AÑO (7 Troncales + 2 Electivas) ---
  {
    id: 'admin-sistemas',
    nombre: 'Admin. de Sistemas de Información',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['diseno-sistemas', 'economia'], finales: ['analisis-sistemas'] }, 
      paraRendir: { finales: ['diseno-sistemas', 'economia'] } 
    }
  },
  {
    id: 'redes',
    nombre: 'Redes de Datos',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['comunicaciones', 'so'], finales: [] }, 
      paraRendir: { finales: ['comunicaciones', 'so'] } 
    }
  },
  {
    id: 'operativa',
    nombre: 'Investigación Operativa',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      // VALIDADO: Pide Final de AM2 + Cursada de Probabilidad y Numérico
      paraCursar: { cursadas: ['probabilidad', 'analisis-numerico'], finales: ['am2'] }, 
      paraRendir: { finales: ['probabilidad', 'analisis-numerico'] } 
    }
  },
  {
    id: 'simulacion',
    nombre: 'Simulación',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['probabilidad', 'am2'], finales: [] }, 
      paraRendir: { finales: ['probabilidad'] } 
    }
  },
  {
    id: 'ing-sw',
    nombre: 'Ingeniería y Calidad de Software',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['diseno-sistemas', 'bases-datos', 'desarrollo-sw'], finales: [] }, 
      paraRendir: { finales: ['diseno-sistemas', 'bases-datos'] } 
    }
  },
  {
    id: 'automatizacion',
    nombre: 'Tecnologías para la Automatización',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['fisica2', 'analisis-numerico'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'legislacion',
    nombre: 'Legislación',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['ing-sociedad'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  // Electivas 4º (2 Materias)
  {
    id: 'electiva-4to-1',
    nombre: 'Electiva II (4º Año)',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['diseno-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'electiva-4to-2',
    nombre: 'Electiva III (4º Año)',
    anio: 4,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['diseno-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },

  // --- QUINTO AÑO (6 Troncales + 4 Electivas) ---
  {
    id: 'proyecto-final',
    nombre: 'Proyecto Final',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas', 'redes', 'ing-sw'], finales: ['diseno-sistemas', 'comunicaciones'] }, 
      paraRendir: { finales: ['admin-sistemas', 'redes'] } 
    }
  },
  {
    id: 'ia',
    nombre: 'Inteligencia Artificial',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['simulacion', 'operativa'], finales: [] }, 
      paraRendir: { finales: ['simulacion', 'operativa'] } 
    }
  },
  {
    id: 'ciencia-datos',
    nombre: 'Ciencia de Datos',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['simulacion', 'bases-datos'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'sistemas-gestion',
    nombre: 'Sistemas de Gestión',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas', 'operativa'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'gestion-gerencial',
    nombre: 'Gestión Gerencial',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas', 'legislacion'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'seguridad',
    nombre: 'Seguridad en los Sistemas',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['redes', 'ing-sw'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  // Electivas 5º (4 Materias)
  {
    id: 'electiva-5to-1',
    nombre: 'Electiva IV (5º Año)',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'electiva-5to-2',
    nombre: 'Electiva V (5º Año)',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'electiva-5to-3',
    nombre: 'Electiva VI (5º Año)',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  },
  {
    id: 'electiva-5to-4',
    nombre: 'Electiva VII (5º Año)',
    anio: 5,
    estado: 'pendiente',
    requerimientos: { 
      paraCursar: { cursadas: ['admin-sistemas'], finales: [] }, 
      paraRendir: { finales: [] } 
    }
  }
];