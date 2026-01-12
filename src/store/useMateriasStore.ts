import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import type { Materia, EstadoMateria } from '../types';
import { PLAN_ESTUDIOS_INICIAL } from '../data/sistemas-k23';

interface MateriasState {
  materias: Materia[];
  cambiarEstado: (id: string, nuevoEstado: EstadoMateria) => void;
  cambiarNota: (id: string, nuevaNota: number) => void;
  reiniciarProgreso: () => void;
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
      name: 'progreso-sistemas-utn', 
      storage: createJSONStorage(() => localStorage),
      
      // --- ESTA ES LA MAGIA QUE ARREGLA TU PROBLEMA ---
      // Cuando la app carga, mezcla la estructura NUEVA con los datos VIEJOS del usuario.
      merge: (persistedState: any, currentState) => {
        // 1. Obtenemos lo que el usuario tenía guardado
        const materiasGuardadas = persistedState.materias || [];

        // 2. Tomamos el Plan Nuevo (con las flechas corregidas)
        const materiasFusionadas = PLAN_ESTUDIOS_INICIAL.map((materiaNueva) => {
          // Buscamos si el usuario ya había tocado esta materia
          const materiaVieja = materiasGuardadas.find((m: Materia) => m.id === materiaNueva.id);

          return {
            ...materiaNueva, // Usamos la estructura NUEVA (flechas, nombres, reqs)
            // Pero recuperamos SOLO el estado y la nota del usuario
            estado: materiaVieja?.estado || 'pendiente',
            nota: materiaVieja?.nota,
          };
        });

        return { ...currentState, materias: materiasFusionadas };
      },
    }
  )
);