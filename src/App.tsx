import { useMemo, useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  ConnectionLineType, 
  MarkerType,
  BackgroundVariant,
  Panel
} from 'reactflow';
import type { Node, Edge, NodeTypes } from 'reactflow';

import 'reactflow/dist/style.css';

import { useMateriasStore } from './store/useMateriasStore';
import { puedeCursar, getColorNodo } from './lib/validaciones';
import MateriaNode from './components/map/MateriaNode';
import type { MateriaNodeData } from './components/map/MateriaNode';

// --- CONFIGURACIÓN DE LAYOUT ---
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
  // Store con persistencia y simulación
  const { 
    materias, 
    isSimulationMode, 
    toggleSimulationMode, 
    reiniciarProgreso 
  } = useMateriasStore();
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [leyendaAbierta, setLeyendaAbierta] = useState(false);

  // --- CÁLCULOS DE ESTADÍSTICAS ---
  const stats = useMemo(() => {
    const total = materias.length;
    const aprobadas = materias.filter(m => m.estado === 'aprobada').length;
    const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
    
    const materiasConNota = materias.filter(m => m.estado === 'aprobada' && m.nota && m.nota > 0);
    const sumaNotas = materiasConNota.reduce((acc, curr) => acc + (curr.nota || 0), 0);
    const promedio = materiasConNota.length > 0 ? (sumaNotas / materiasConNota.length).toFixed(2) : '-';

    return { total, aprobadas, porcentaje, promedio };
  }, [materias]);

  // --- GENERACIÓN DINÁMICA DE NODOS Y ARISTAS ---
  const { nodes, edges } = useMemo(() => {
    const generatedNodes: Node<MateriaNodeData>[] = [];
    const generatedEdges: Edge[] = [];
    const posicionesY: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // 1. Mapa de puertos (handles)
    const inputsCountMap: Record<string, number> = {};
    materias.forEach(m => {
        m.requerimientos.paraCursar.cursadas.forEach(() => { inputsCountMap[m.id] = (inputsCountMap[m.id] || 0) + 1; });
        m.requerimientos.paraCursar.finales.forEach(() => { inputsCountMap[m.id] = (inputsCountMap[m.id] || 0) + 1; });
    });

    const currentInputIndexMap: Record<string, number> = {};
    const connectedNodeIds = new Set<string>();
    const connectedEdgeIds = new Set<string>();
    
    // 2. Lógica de resaltado (Focus)
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

    // 3. Ordenar materias por importancia
    const materiasOrdenadas = [...materias].sort((a, b) => {
      const aEsTroncal = MATERIAS_TRONCALES.includes(a.id);
      const bEsTroncal = MATERIAS_TRONCALES.includes(b.id);
      if (aEsTroncal && !bEsTroncal) return -1;
      if (!aEsTroncal && bEsTroncal) return 1;
      return 0;
    });

    // 4. Construir Nodos
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
        if (isSelected) { border = '2px solid #fff'; zIndex = 10; }
        else if (isConnected) { zIndex = 5; }
        else { opacity = 0.2; filter = 'grayscale(100%)'; }
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
                color: (materia.estado === 'aprobada' || !habilitada) ? '#eee' : '#111',
                border,
                opacity,
                filter,
                zIndex,
                width: 190,
            }
        },
        style: { zIndex },
      });

      // 5. Construir Aristas
      const crearFlecha = (reqId: string, tipo: 'cursada' | 'final') => {
        const edgeId = `e-${tipo}-${reqId}-${materia.id}`;
        const isEdgeConnected = connectedEdgeIds.has(edgeId);
        const targetInputCount = inputsCountMap[materia.id] || 1;
        const currentIndex = currentInputIndexMap[materia.id] || 0;
        const targetHandleId = `target-${currentIndex}`;
        currentInputIndexMap[materia.id] = (currentIndex + 1) % targetInputCount;
        
        let stroke = tipo === 'final' ? '#7f1d1d' : '#444';
        let strokeWidth = 1;
        let edgeZIndex = tipo === 'final' ? 2 : 1;
        let animated = false;
        const strokeDasharray = tipo === 'final' ? '6,4' : '0';

        if (dimMode) {
           if (isEdgeConnected) {
             strokeWidth = 2.5;
             animated = true;
             edgeZIndex = 10;
             const colorFlecha = tipo === 'final' ? '#ef4444' : '#fb923c';
             stroke = reqId === selectedNodeId ? '#3b82f6' : colorFlecha;
           } else {
             stroke = '#222';
             opacity: 0.1;
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
          zIndex: edgeZIndex,
          style: { stroke, strokeWidth, strokeDasharray, opacity: dimMode && !isEdgeConnected ? 0.05 : 1 },
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
    <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: '#121212',
        border: isSimulationMode ? '4px solid #3b82f6' : 'none',
        boxSizing: 'border-box',
        transition: 'border 0.3s ease'
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} 
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        connectionLineType={ConnectionLineType.Bezier}
        fitView
        minZoom={0.1}
      >
        <Background color="#333" gap={25} size={1} variant={BackgroundVariant.Dots} />
        <Controls />
        
        {/* PANEL DE HERRAMIENTAS (SIMULACIÓN / RESET) */}
        <Panel position="top-left" style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={toggleSimulationMode}
                style={{
                    padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontWeight: 'bold', background: isSimulationMode ? '#ef4444' : '#3b82f6',
                    color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px'
                }}
            >
                {isSimulationMode ? '🛑 Salir de Simulación' : '🧪 Modo Simulación'}
            </button>

            <button 
                onClick={reiniciarProgreso}
                style={{
                    padding: '10px 16px', borderRadius: '8px', border: '1px solid #444',
                    cursor: 'pointer', background: '#222', color: '#999', fontSize: '12px'
                }}
            >
                🗑️ Reset
            </button>
        </Panel>

        {/* INDICADOR VISUAL DE SIMULACIÓN */}
        {isSimulationMode && (
            <Panel position="top-center" style={{ 
                background: '#3b82f6', color: 'white', padding: '6px 24px', 
                borderRadius: '0 0 12px 12px', fontWeight: 'bold', fontSize: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                SIMULACIÓN ACTIVA: Los cambios se perderán al salir.
            </Panel>
        )}

        {/* PANEL DE ESTADÍSTICAS */}
        <Panel position="top-right" style={{
            background: 'rgba(25,25,25,0.9)', padding: '15px', borderRadius: '12px',
            color: '#eee', border: '1px solid #444', minWidth: '200px',
            backdropFilter: 'blur(8px)'
        }}>
            <h3 style={{margin: '0 0 10px 0', fontSize:'15px', borderBottom:'1px solid #444', paddingBottom:'8px'}}>Estadísticas</h3>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'13px'}}>
                <span>Aprobadas:</span>
                <strong style={{color:'#10b981'}}>{stats.aprobadas} / {stats.total}</strong>
            </div>
            <div style={{width:'100%', height:'6px', background:'#333', borderRadius:'3px', overflow:'hidden', marginBottom:'12px'}}>
                <div style={{ width: `${stats.porcentaje}%`, height:'100%', background: '#10b981', transition: 'width 0.5s ease' }}></div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{color:'#aaa', fontSize:'13px'}}>Promedio:</span>
                <span style={{fontSize:'20px', fontWeight:'bold', color:'#fb923c'}}>{stats.promedio}</span>
            </div>
        </Panel>

        {/* PANEL DE REFERENCIAS COLAPSABLE */}
        <Panel position="bottom-left">
          {!leyendaAbierta ? (
             <button onClick={() => setLeyendaAbierta(true)} style={{ background: 'rgba(40,40,40,0.9)', color: 'white', border: '1px solid #555', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>
               ℹ️ Ver Referencias
             </button>
          ) : (
             <div style={{ background: 'rgba(20,20,20,0.95)', padding: '12px', borderRadius: '10px', color: '#eee', border: '1px solid #444', minWidth: '210px', fontSize: '12px' }}>
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px', borderBottom:'1px solid #444', paddingBottom:'5px'}}>
                    <strong>Referencias</strong>
                    <button onClick={() => setLeyendaAbierta(false)} style={{background:'none', border:'none', color:'#888', cursor:'pointer'}}>✕</button>
                 </div>
                 <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#f3f4f6', borderRadius:'50%'}}></div> Habilitada</div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#3b82f6', borderRadius:'50%'}}></div> Cursando</div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#f59e0b', borderRadius:'50%'}}></div> Regularizada</div>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:10, height:10, background:'#10b981', borderRadius:'50%'}}></div> Aprobada</div>
                    <div style={{marginTop:'5px', borderTop:'1px solid #444', paddingTop:'8px'}}>
                        <div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'4px'}}><div style={{width:20, height:2, background:'#fb923c'}}></div> Req. Cursada</div>
                        <div style={{display:'flex', gap:'8px', alignItems:'center'}}><div style={{width:20, height:0, borderTop:'2px dashed #ef4444'}}></div> Req. Final</div>
                    </div>
                 </div>
             </div>
          )}
        </Panel>

      </ReactFlow>
    </div>
  );
}

export default App;