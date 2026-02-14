export type EstadoMateria = 'pendiente' | 'cursando' | 'regularizada' | 'aprobada';

export interface Requisitos {
  paraCursar: {
    cursadas: string[];
    finales: string[];
  };
  paraRendir: {
    finales: string[];
  };
}

export interface Materia {
  id: string;
  nombre: string;
  anio: number;
  cuatrimestre?: 1 | 2 | 'anual';
  estado: EstadoMateria;
  nota?: number; 
  requerimientos: Requisitos;
}