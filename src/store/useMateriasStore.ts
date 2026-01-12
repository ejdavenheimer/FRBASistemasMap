import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // <--- Importamos esto
import type { Materia, EstadoMateria } from '../types';
import { PLAN_ESTUDIOS_INICIAL } from '../data/sistemas-k23';

interface MateriasState {
  materias: Materia[];
  cambiarEstado: (id: string, nuevoEstado: EstadoMateria) => void;
  cambiarNota: (id: string, nuevaNota: number) => void;
  reiniciarProgreso: () => void; // Agregamos un botón de pánico por si quieren borrar todo
}

export const useMateriasStore = create<MateriasState>()(
  persist(
    (set) => ({
      materias: PLAN_ESTUDIOS_INICIAL,
      
      cambiarEstado: (id, nuevoEstado) => 
        set((state) => ({
          materias: state.materias.map((m) => 
            m.id === id ? { ...m, estado: nuevoEstado } : m
          )
        })),

      cambiarNota: (id, nuevaNota) =>
        set((state) => ({
          materias: state.materias.map((m) =>
            m.id === id ? { ...m, nota: nuevaNota } : m
          )
        })),

      reiniciarProgreso: () => set({ materias: PLAN_ESTUDIOS_INICIAL }),
    }),
    {
      name: 'progreso-sistemas-utn', // Nombre clave para guardar en el navegador
      storage: createJSONStorage(() => localStorage), // Usamos LocalStorage
    }
  )
);