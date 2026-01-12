import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Materia, EstadoMateria } from '../types';
import { PLAN_ESTUDIOS_INICIAL } from '../data/sistemas-k23';

interface MateriasState {
  materias: Materia[];
  isSimulationMode: boolean;
  materiasBackup: Materia[] | null; // Para guardar el progreso real
  
  cambiarEstado: (id: string, nuevoEstado: EstadoMateria) => void;
  cambiarNota: (id: string, nuevaNota: number) => void;
  reiniciarProgreso: () => void;
  
  // Acciones de Simulación
  toggleSimulationMode: () => void;
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
        if (window.confirm("¿Estás seguro de que quieres borrar todo tu progreso real? Esta acción no se puede deshacer.")) {
          set({ materias: PLAN_ESTUDIOS_INICIAL, isSimulationMode: false, materiasBackup: null });
        }
      },

      toggleSimulationMode: () => {
        const { isSimulationMode, materias, materiasBackup } = get();
        
        if (!isSimulationMode) {
          // ENTRAR EN SIMULACIÓN: Guardamos copia de lo real
          set({ 
            materiasBackup: [...materias], 
            isSimulationMode: true 
          });
        } else {
          // SALIR DE SIMULACIÓN: Restauramos lo real
          if (materiasBackup) {
            set({ 
              materias: [...materiasBackup], 
              materiasBackup: null, 
              isSimulationMode: false 
            });
          }
        }
      },
    }),
    {
      name: 'progreso-sistemas-utn',
      storage: createJSONStorage(() => localStorage),
      // IMPORTANTE: No queremos guardar el backup ni el estado de simulación en el disco
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