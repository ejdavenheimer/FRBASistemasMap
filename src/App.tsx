import { useMemo, useCallback, useState } from 'react';

// 1. Valores de React Flow
import ReactFlow, { 
  Background, 
  Controls, 
  ConnectionLineType, 
  MarkerType,
  BackgroundVariant,
  Panel
} from 'reactflow';

// 2. Tipos de React Flow
import type { Node, Edge, NodeTypes } from 'reactflow';

import 'reactflow/dist/style.css';

import { useMateriasStore } from './store/useMateriasStore';
import { puedeCursar, getColorNodo } from './lib/validaciones';
import MateriaNode from './components/map/MateriaNode';
import type { MateriaNodeData } from './components/map/MateriaNode';

// --- CONFIGURACIÓN ---
const ANCHO_COLUMNA = 250; 
const SEPARACION_VERTICAL = 130;

const nodeTypes: NodeTypes = {
  customMateria: MateriaNode,
};

const MATERIAS_TRONCALES = [
  'sistemas-organizaciones', 
  'analisis-sistemas', 
  'diseno-sistemas', 
  'admin-sistemas', 
  'proyecto-final'
];

function App() {
  const { materias } = useMateriasStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [leyendaAbierta, setLeyendaAbierta] = useState(false);

  // --- CÁLCULOS DE ESTADÍSTICAS ---
  const stats = useMemo(() => {
    const total = materias.length;
    const aprobadas = materias.filter(m => m.estado === 'aprobada').length;
    const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
    
    // Cálculo de Promedio (solo notas cargadas > 0)
    const materiasConNota = materias.filter(m => m.estado === 'aprobada' && m.nota && m.nota > 0);
    const sumaNotas = materiasConNota.reduce((acc, curr) => acc + (curr.nota || 0), 0);
    const promedio = materiasConNota.length > 0 ? (sumaNotas / materiasConNota.length).toFixed(2) : '-';

    return { total, aprobadas, porcentaje, promedio };
  }, [materias]);

  // --- CÁLCULO DE NODOS Y ARISTAS ---
  const { nodes, edges } = useMemo(() => {
    const generatedNodes: Node<MateriaNodeData>[] = [];
    const generatedEdges: Edge[] = [];
    const posicionesY: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // 1. Contar inputs
    const inputsCountMap: Record<string, number> = {};
    materias.forEach(m => {
        m.requerimientos.paraCursar.cursadas.forEach(() => { inputsCountMap[m.id] = (inputsCountMap[m.id] || 0) + 1; });
        m.requerimientos.paraCursar.finales.forEach(() => { inputsCountMap[m.id] = (inputsCountMap[m.id] || 0) + 1; });
    });

    const currentInputIndexMap: Record<string, number> = {};
    const connectedNodeIds = new Set<string>();
    const connectedEdgeIds = new Set<string>();
    
    // 2. Lógica de selección
    if (selectedNodeId) {
      connectedNodeIds.add(selectedNodeId);
      materias.forEach((m) => {
        const reqsCursada = m.requerimientos.paraCursar.cursadas;
        const reqsFinal = m.requerimientos.paraCursar.finales;
        
        const tieneConexion = m.id === selectedNodeId || reqsCursada.includes(selectedNodeId) || reqsFinal.includes(selectedNodeId);

        if (tieneConexion) {
             connectedNodeIds.add(m.id);
             reqsCursada.forEach(reqId => {
                 if (m.id === selectedNodeId || reqId === selectedNodeId) {
                    connectedEdgeIds.add(`e-cursada-${reqId}-${m.id}`);
                    connectedNodeIds.add(reqId);
                 }
             });
             reqsFinal.forEach(reqId => {
                 if (m.id === selectedNodeId || reqId === selectedNodeId) {
                    connectedEdgeIds.add(`e-final-${reqId}-${m.id}`);
                    connectedNodeIds.add(reqId);
                 }
             });
        }
      });
    }

    // 3. Ordenar materias
    const materiasOrdenadas = [...materias].sort((a, b) => {
      const aEsTroncal = MATERIAS_TRONCALES.includes(a.id);
      const bEsTroncal = MATERIAS_TRONCALES.includes(b.id);
      if (aEsTroncal && !bEsTroncal) return -1;
      if (!aEsTroncal && bEsTroncal) return 1;
      return 0;
    });

    // 4. Generar NODOS
    materiasOrdenadas.forEach((materia) => {
      const habilitada = puedeCursar(materia, materias);
      const posX = (materia.anio - 1) * ANCHO_COLUMNA;
      const posY = posicionesY[materia.anio] * SEPARACION_VERTICAL;
      posicionesY[materia.anio]++;

      const isSelected = materia.id === selectedNodeId;
      const isConnected = connectedNodeIds.has(materia.id);
      const dimMode = selectedNodeId !== null;

      let opacity = 1;
      let filter = 'none';
      let border = '1px solid #555';
      let zIndex = 1;

      if (dimMode) {
        if (isSelected) {
          border = '2px solid #fff';
          zIndex = 10;
        } else if (isConnected) {
          zIndex = 5;
        } else {
          opacity = 0.2;
          filter = 'grayscale(100%)';
        }
      } else {
        opacity = habilitada || materia.estado !== 'pendiente' ? 1 : 0.6;
      }

      generatedNodes.push({
        id: materia.id,
        type: 'customMateria',
        position: { x: posX, y: posY },
        selected: isSelected,
        data: { 
            label: materia.nombre, 
            estado: materia.estado, 
            nota: materia.nota,
            habilitada,
            inputsCount: inputsCountMap[materia.id] || 0,
            isSelected, 
            styleInfo: {
                background: getColorNodo(materia, habilitada),
                color: materia.estado === 'aprobada' || !habilitada ? '#eee' : '#111',
                border,
                opacity,
                filter,
                zIndex,
                width: 190,
            }
        },
        style: { zIndex },
      });

      // Función auxiliar para flechas
      const crearFlecha = (reqId: string, tipo: 'cursada' | 'final') => {
        const edgeId = `e-${tipo}-${reqId}-${materia.id}`;
        const isEdgeConnected = connectedEdgeIds.has(edgeId);
        
        const targetInputCount = inputsCountMap[materia.id] || 1;
        const currentIndex = currentInputIndexMap[materia.id] || 0;
        const targetHandleId = `target-${currentIndex}`;
        currentInputIndexMap[materia.id] = (currentIndex + 1) % targetInputCount;
        
        let stroke = '#555';
        let strokeWidth = 1;
        let animated = false;
        const strokeDasharray = tipo === 'final' ? '5,5' : '0';

        if (dimMode) {
           if (isEdgeConnected) {
             strokeWidth = 2.5;
             animated = true;
             const colorFlecha = tipo === 'final' ? '#ef4444' : '#fb923c';
             if (reqId === selectedNodeId) {
                stroke = '#3b82f6'; 
             } else {
                stroke = colorFlecha;
             }
           } else {
             stroke = '#333';
             strokeWidth = 1;
           }
        }

        generatedEdges.push({
          id: edgeId,
          source: reqId,
          target: materia.id,
          sourceHandle: 'source-right',
          targetHandle: targetHandleId,
          type: 'default', 
          animated,
          style: { stroke, strokeWidth, strokeDasharray, opacity: dimMode && !isEdgeConnected ? 0.1 : 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
        });
      };

      materia.requerimientos.paraCursar.cursadas.forEach((reqId) => crearFlecha(reqId, 'cursada'));
      materia.requerimientos.paraCursar.finales.forEach((reqId) => crearFlecha(reqId, 'final'));
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [materias, selectedNodeId]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#121212' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} 
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        connectionLineType={ConnectionLineType.Bezier}
        fitView
        minZoom={0.2}
      >
        <Background color="#555" gap={25} size={1} variant={BackgroundVariant.Dots} style={{ opacity: 0.2 }} />
        <Controls />
        
        {/* --- NUEVO: PANEL DE ESTADÍSTICAS (ARRIBA DERECHA) --- */}
        <Panel position="top-right" style={{
            background: 'rgba(30,30,30,0.9)', padding: '15px', borderRadius: '12px',
            color: '#eee', border: '1px solid #444', minWidth: '200px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)'
        }}>
            <h3 style={{margin: '0 0 10px 0', fontSize:'16px', fontWeight:'600', borderBottom:'1px solid #555', paddingBottom:'8px'}}>
                Mi Progreso
            </h3>
            
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'14px'}}>
                <span>Aprobadas:</span>
                <strong style={{color:'#10b981'}}>{stats.aprobadas} / {stats.total}</strong>
            </div>

            {/* Barra de Progreso */}
            <div style={{width:'100%', height:'8px', background:'#444', borderRadius:'4px', overflow:'hidden', marginBottom:'15px'}}>
                <div style={{
                    width: `${stats.porcentaje}%`, 
                    height:'100%', 
                    background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                    transition: 'width 0.5s ease'
                }}></div>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'13px'}}>
                <span style={{color:'#aaa'}}>Promedio:</span>
                <span style={{fontSize:'18px', fontWeight:'bold', color:'#fb923c'}}>{stats.promedio}</span>
            </div>
        </Panel>

        {/* --- PANEL DE REFERENCIAS COLAPSABLE (ABAJO IZQUIERDA) --- */}
        <Panel position="bottom-left">
          {!leyendaAbierta ? (
             <button 
               onClick={() => setLeyendaAbierta(true)}
               style={{
                 background: 'rgba(50,50,50,0.8)', color: 'white', border: '1px solid #555',
                 padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px',
                 boxShadow: '0 2px 5px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '5px'
               }}
             >
               <span>ℹ️</span> Referencias
             </button>
          ) : (
             <div style={{ 
                 background: 'rgba(30,30,30,0.95)', padding: '12px', borderRadius: '8px', 
                 color: '#eee', border: '1px solid #444', minWidth: '200px',
                 boxShadow: '0 4px 15px rgba(0,0,0,0.5)', fontSize: '12px'
             }}>
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px', borderBottom:'1px solid #555', paddingBottom:'4px'}}>
                    <strong style={{fontSize:'12px'}}>Referencias</strong>
                    <button onClick={() => setLeyendaAbierta(false)} style={{background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize:'14px'}}>✕</button>
                 </div>

                 <div style={{display:'flex', flexDirection:'column', gap:'5px', marginBottom:'10px'}}>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#f3f4f6', borderRadius:'50%'}}></div> Habilitada</div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#3b82f6', borderRadius:'50%'}}></div> Cursando</div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#f59e0b', borderRadius:'50%'}}></div> Regularizada</div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#10b981', borderRadius:'50%'}}></div> Aprobada</div>
                 </div>

                 <div style={{borderTop:'1px solid #555', paddingTop:'8px', display:'flex', flexDirection:'column', gap:'5px'}}>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:25, height:2, background:'#fb923c'}}></div> <span>Requiere Cursada</span></div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:25, height:0, borderTop:'2px dashed #ef4444'}}></div> <span>Requiere Final</span></div>
                 </div>
                 
                 <div style={{marginTop:'8px', fontSize:'10px', color:'#999', fontStyle:'italic'}}>* Click en materia para editar</div>
             </div>
          )}
        </Panel>

      </ReactFlow>
    </div>
  );
}

export default App;