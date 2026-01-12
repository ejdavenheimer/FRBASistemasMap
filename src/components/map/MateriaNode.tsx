import React, { memo } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useMateriasStore } from '../../store/useMateriasStore';
import type { EstadoMateria } from '../../types';

export interface MateriaNodeData {
  label: string;
  estado: EstadoMateria;
  nota?: number; // Recibimos la nota
  habilitada: boolean;
  inputsCount: number; 
  isSelected: boolean; 
  styleInfo: {
    background: string;
    color: string;
    border: string;
    opacity: number;
    filter: string;
    zIndex: number;
    width: number | string;
  };
}

const MateriaNode = ({ id, data, isConnectable }: NodeProps<MateriaNodeData>) => {
  const { label, inputsCount, styleInfo, isSelected, estado, nota } = data;
  const { cambiarEstado, cambiarNota } = useMateriasStore();

  // Generación de handles (igual que siempre)
  const targetHandles = [];
  const count = inputsCount || 1;
  for (let i = 0; i < count; i++) {
    const topPosition = (100 / (count + 1)) * (i + 1);
    targetHandles.push(
      <Handle
        key={`target-${i}`} type="target" position={Position.Left} id={`target-${i}`}
        style={{ top: `${topPosition}%`, background: '#555', width: '8px', height: '8px', border: '2px solid #222', zIndex: 10 }}
        isConnectable={isConnectable}
      />
    );
  }

  const BotonEstado = ({ st, color, title }: { st: EstadoMateria, color: string, title: string }) => (
    <button
      onClick={(e) => { e.stopPropagation(); cambiarEstado(id, st); }}
      title={title}
      style={{
        background: color,
        width: '28px', height: '28px',
        borderRadius: '50%',
        border: estado === st ? '3px solid white' : '1px solid #555',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 'bold', color: '#333'
      }}
    >
      {estado === st && '✓'}
    </button>
  );

  return (
    <div style={{ position: 'relative' }}>
      
      {/* TOOLBAR: Aparece al seleccionar */}
      <NodeToolbar isVisible={isSelected} position={Position.Top} align="center" offset={10}>
        <div style={{ 
            display: 'flex', gap: '8px', background: '#222', padding: '8px', 
            borderRadius: '12px', border: '1px solid #666',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)', alignItems: 'center'
        }}>
            <BotonEstado st="pendiente" color="#f3f4f6" title="Pendiente" />
            <BotonEstado st="cursando" color="#3b82f6" title="Cursando" />
            <BotonEstado st="regularizada" color="#f59e0b" title="Regularizada" />
            <BotonEstado st="aprobada" color="#10b981" title="Aprobada" />

            {/* INPUT DE NOTA: Solo si está aprobada */}
            {estado === 'aprobada' && (
              <div style={{ marginLeft: '5px', borderLeft: '1px solid #555', paddingLeft: '8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#aaa', marginRight: '4px' }}>Nota:</span>
                <input 
                  type="number" 
                  min="4" max="10" 
                  value={nota || ''}
                  onChange={(e) => cambiarNota(id, parseInt(e.target.value))}
                  onClick={(e) => e.stopPropagation()} // Para que no seleccione/deseleccione al escribir
                  style={{
                    width: '40px', padding: '4px', borderRadius: '4px', border: '1px solid #555',
                    background: '#333', color: 'white', textAlign: 'center'
                  }}
                />
              </div>
            )}
        </div>
      </NodeToolbar>

      {targetHandles}

      {/* CAJA DE LA MATERIA */}
      <div
        style={{
          background: styleInfo.background,
          color: styleInfo.color,
          border: styleInfo.border,
          width: styleInfo.width,
          minHeight: '60px',
          height: 'auto',
          whiteSpace: 'normal',
          lineHeight: '1.3',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          borderRadius: '8px', padding: '12px 15px', fontSize: '13px',
          opacity: styleInfo.opacity, filter: styleInfo.filter, transition: 'all 0.3s ease',
          boxShadow: isSelected ? '0 0 0 3px rgba(255, 255, 255, 0.3)' : 'none',
        }}
      >
        <div>{label}</div>
        {/* Mostrar nota pequeña en la caja si existe */}
        {estado === 'aprobada' && nota && (
          <div style={{ marginTop: '4px', fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
            Nota: <strong>{nota}</strong>
          </div>
        )}
      </div>

      <Handle
        type="source" position={Position.Right} id="source-right"
        style={{ background: '#555', width: '8px', height: '8px', border: '2px solid #222', zIndex: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(MateriaNode);