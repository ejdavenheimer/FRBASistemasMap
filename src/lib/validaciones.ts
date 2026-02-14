import type { Materia } from '../types';

// Función que nos dice si podemos cursar una materia
export const puedeCursar = (materia: Materia, historial: Materia[]): boolean => {
  const { paraCursar } = materia.requerimientos;
  
  //Verificar cursadas necesarias (deben estar regular o aprobada)
  const cursadasOk = paraCursar.cursadas.every(reqId => {
    const req = historial.find(m => m.id === reqId);
    return req && (req.estado === 'regularizada' || req.estado === 'aprobada');
  });

  //Verificar finales necesarios (deben estar aprobada)
  const finalesOk = paraCursar.finales.every(reqId => {
    const req = historial.find(m => m.id === reqId);
    return req && req.estado === 'aprobada';
  });

  return cursadasOk && finalesOk;
};

// Función para determinar el color del nodo según su estado
export const getColorNodo = (materia: Materia, habilitada: boolean) => {
  if (materia.estado === 'aprobada') return '#10b981'; // Verde (Final)
  if (materia.estado === 'regularizada') return '#f59e0b'; // Naranja (Regular)
  if (materia.estado === 'cursando') return '#3b82f6'; // Azul (Cursando)
  if (!habilitada) return '#4b5563'; // Gris Oscuro (Bloqueada)
  return '#f3f4f6'; // Blanco/Gris Claro (Habilitada para cursar)
};