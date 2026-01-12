import { memo } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';
import { useMateriasStore } from '../../store/useMateriasStore';

// Definimos la interfaz de las props que recibe el nodo
export interface MateriaNodeData {
  label: string;
  estado: 'pendiente' | 'cursando' | 'regularizada' | 'aprobada';
  nota?: number;
  habilitada: boolean;
  inputsCount: number;
  isSelected: boolean;
  toggleMenu: () => void; 
  styleInfo: {
    background: string;
    color: string;
    border: string;
    opacity: number;
    filter: string;
    zIndex: number;
    width: number;
  };
}

const MateriaNode = ({ id, data }: { id: string, data: MateriaNodeData }) => {
  const { cambiarEstado, cambiarNota } = useMateriasStore();
  
  const inputsArray = Array.from({ length: data.inputsCount || 1 });

  return (
    <div style={{
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: data.isSelected ? '0 0 15px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.3s ease',
        ...data.styleInfo
    }}>
      {/* BARRA DE HERRAMIENTAS FLOTANTE (MENÚ) */}
      <NodeToolbar 
        isVisible={data.isSelected} 
        position={Position.Top} 
        offset={10}
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: '#1f2937',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #374151',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            minWidth: '180px',
            color: 'white'
        }}
      >
        {/* Cabecera con Botón CERRAR (X) */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #374151', paddingBottom: '8px', marginBottom: '4px'}}>
            <span style={{fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase'}}>Editar Estado</span>
            <button 
                onClick={(e) => {
                    e.stopPropagation(); 
                    data.toggleMenu();
                }}
                style={{
                    background: 'transparent', border: 'none', color: '#9ca3af', 
                    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '0 4px'
                }}
            >
                ✕
            </button>
        </div>

        {/* Botones de Estado - CORREGIDOS (Sin prop border duplicada) */}
        <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
            <button onClick={() => cambiarEstado(id, 'pendiente')} 
                style={{
                    flex: 1, padding: '6px', fontSize: '10px', background: '#374151', 
                    border: 'none', // Pendiente no lleva borde condicional
                    borderRadius: '4px', color: 'white', cursor: 'pointer', 
                    opacity: data.estado === 'pendiente' ? 1 : 0.6
                }}>
                Pendiente
            </button>
            <button onClick={() => cambiarEstado(id, 'cursando')} 
                style={{
                    flex: 1, padding: '6px', fontSize: '10px', background: '#3b82f6', 
                    borderRadius: '4px', color: 'white', cursor: 'pointer', 
                    border: data.estado === 'cursando' ? '2px solid white' : 'none' // Solo dejamos esta
                }}>
                Cursando
            </button>
        </div>
        <div style={{display: 'flex', gap: '5px'}}>
            <button onClick={() => cambiarEstado(id, 'regularizada')} 
                style={{
                    flex: 1, padding: '6px', fontSize: '10px', background: '#f59e0b', 
                    borderRadius: '4px', color: 'white', cursor: 'pointer', 
                    border: data.estado === 'regularizada' ? '2px solid white' : 'none' // Solo dejamos esta
                }}>
                Regular
            </button>
            <button onClick={() => cambiarEstado(id, 'aprobada')} 
                style={{
                    flex: 1, padding: '6px', fontSize: '10px', background: '#10b981', 
                    borderRadius: '4px', color: 'white', cursor: 'pointer', 
                    border: data.estado === 'aprobada' ? '2px solid white' : 'none' // Solo dejamos esta
                }}>
                Aprobada
            </button>
        </div>

        {/* Selector de Nota */}
        {data.estado === 'aprobada' && (
            <div style={{marginTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', padding: '5px', borderRadius: '4px'}}>
                <span style={{fontSize: '11px', color: '#ccc'}}>Nota:</span>
                <input 
                    type="number" 
                    min="4" max="10" 
                    value={data.nota || ''} 
                    onChange={(e) => cambiarNota(id, parseInt(e.target.value))}
                    placeholder="-"
                    style={{width: '40px', background: '#333', border: 'none', color: 'white', textAlign: 'center', borderRadius: '3px', fontSize: '12px'}}
                />
            </div>
        )}
      </NodeToolbar>

      {/* PUERTOS DE CONEXIÓN */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {inputsArray.map((_, index) => (
            <Handle
                key={`target-${index}`}
                type="target"
                position={Position.Left}
                id={`target-${index}`}
                style={{ 
                    top: `${((index + 1) / (inputsArray.length + 1)) * 100}%`,
                    background: 'transparent', border: 'none' 
                }}
            />
        ))}
      </div>
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: 'transparent', border: 'none' }} />

      {/* CONTENIDO DEL NODO */}
      <div>
        <div style={{ marginBottom: '4px' }}>{data.label}</div>
        {data.nota && data.nota > 0 && data.estado === 'aprobada' && (
            <div style={{ fontSize: '10px', color: '#fb923c', marginTop: '2px' }}>Nota: {data.nota}</div>
        )}
      </div>
    </div>
  );
};

export default memo(MateriaNode);