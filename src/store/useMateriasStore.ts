import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Materia, EstadoMateria } from '../types';
import { PLAN_ESTUDIOS_INICIAL } from '../data/sistemas-k23';

interface MateriasState {
  materias: Materia[];
  isSimulationMode: boolean;
  materiasBackup: Materia[] | null;
  
  cambiarEstado: (id: string, nuevoEstado: EstadoMateria) => void;
  // Permitimos undefined para limpiar la nota
  cambiarNota: (id: string, nuevaNota: number | undefined) => void; 
  reiniciarProgreso: () => void;
  toggleSimulationMode: () => void;
  importarDatos: (datosNuevos: Materia[]) => void;
}

export const useMateriasStore = create<MateriasState>()(
  persist(
    (set, get) => ({
      materias: PLAN_ESTUDIOS_INICIAL,
      isSimulationMode: false,
      materiasBackup: null,

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

      reiniciarProgreso: () => {
        set({ materias: PLAN_ESTUDIOS_INICIAL, isSimulationMode: false, materiasBackup: null });
      },

      toggleSimulationMode: () => {
        const { isSimulationMode, materias, materiasBackup } = get();
        
        if (!isSimulationMode) {
          set({ materiasBackup: [...materias], isSimulationMode: true });
        } else {
          if (materiasBackup) {
            set({ materias: [...materiasBackup], materiasBackup: null, isSimulationMode: false });
          }
        }
      },

      importarDatos: (datosNuevos) => {
        if (Array.isArray(datosNuevos)) {
            set({ materias: datosNuevos, isSimulationMode: false, materiasBackup: null });
        }
      }
    }),
    {
      name: 'progreso-sistemas-utn',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ materias: state.materias }), 
      merge: (persistedState: any, currentState) => {
        const materiasGuardadas = persistedState.materias || [];
        const materiasFusionadas = PLAN_ESTUDIOS_INICIAL.map((materiaNueva) => {
          const materiaVieja = materiasGuardadas.find((m: any) => m.id === materiaNueva.id);
          return {
            ...materiaNueva,
            estado: materiaVieja?.estado || 'pendiente',
            nota: materiaVieja?.nota,
          };
        });
        return { ...currentState, materias: materiasFusionadas };
      },
    }
  )
);