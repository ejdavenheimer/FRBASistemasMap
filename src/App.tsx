import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  ConnectionLineType, 
  MarkerType,
  BackgroundVariant,
  Panel,
  type Node, 
  type Edge, 
  type NodeTypes 
} from 'reactflow';
import confetti from 'canvas-confetti';
import { Toaster, toast } from 'sonner';
import 'reactflow/dist/style.css';

import { useMateriasStore } from './store/useMateriasStore';
import { puedeCursar, getColorNodo } from './lib/validaciones';
import MateriaNode, { type MateriaNodeData } from './components/map/MateriaNode';

// Development warning suppression
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('nodeTypes')) return;
    originalWarn(...args);
  };
}

const ANCHO_COLUMNA = 250; 
const SEPARACION_VERTICAL = 130;

// Static definition to prevent re-renders
const nodeTypes: NodeTypes = {
  customMateria: MateriaNode,
};

const MATERIAS_TRONCALES = new Set([
  'sistemas-procesos-de-negocios', 
  'analisis-sistemas', 
  'diseno-sistemas', 
  'admin-sistemas', 
  'proyecto-final'
]);

// Icons
const GithubIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
const DiscordIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/></svg>;

const PlayIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const StopIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
const ResetIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const UploadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText: string;
  isDanger?: boolean;
}

const Modal = ({ isOpen, onClose, onConfirm, title, children, confirmText, isDanger }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">{title}</div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="btn-modal btn-cancel" onClick={onClose}>Cancelar</button>
          <button className={`btn-modal ${isDanger ? 'btn-danger' : 'btn-confirm'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { 
    materias, 
    isSimulationMode, 
    toggleSimulationMode, 
    reiniciarProgreso,
    importarDatos 
  } = useMateriasStore();
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showSimModal, setShowSimModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [verReferencias, setVerReferencias] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const total = materias.length;
    const aprobadas = materias.filter(m => m.estado === 'aprobada').length;
    const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
    
    const materiasConNota = materias.filter(m => m.estado === 'aprobada' && m.nota && m.nota > 0);
    const sumaNotas = materiasConNota.reduce((acc, curr) => acc + (curr.nota || 0), 0);
    const promedio = materiasConNota.length > 0 ? (sumaNotas / materiasConNota.length).toFixed(2) : '-';

    return { total, aprobadas, porcentaje, promedio };
  }, [materias]);

  useEffect(() => {
    if (stats.porcentaje === 100 && !isSimulationMode) {
      const duration = 3000;
      const end = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
      const interval: any = setInterval(function() {
        const timeLeft = end - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [stats.porcentaje, isSimulationMode]);

  const handleSimulacionClick = () => {
    if (!isSimulationMode) setShowSimModal(true);
    else toggleSimulationMode();
  };

  const confirmSimulacion = () => {
    setShowSimModal(false);
    toggleSimulationMode();
    toast.info("Modo Simulación activado");
  };

  const confirmReiniciar = () => {
    reiniciarProgreso();
    setShowResetModal(false);
    toast.success("Progreso reiniciado correctamente");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(materias, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-utn-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Archivo descargado");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            importarDatos(json);
            toast.success("Progreso cargado");
        } catch (error) {
            toast.error("Error al leer archivo JSON");
        }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const { nodes, edges } = useMemo(() => {
    const generatedNodes: Node<MateriaNodeData>[] = [];
    const generatedEdges: Edge[] = [];
    const posicionesY: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    const inputsCountMap: Record<string, number> = {};
    materias.forEach(m => {
        m.requerimientos.paraCursar.cursadas.forEach(() => { inputsCountMap[m.id] = (inputsCountMap[m.id] || 0) + 1; });
        m.requerimientos.paraCursar.finales.forEach(() => { inputsCountMap[m.id] = (inputsCountMap[m.id] || 0) + 1; });
    });

    const currentInputIndexMap: Record<string, number> = {};
    const connectedNodeIds = new Set<string>();
    const connectedEdgeIds = new Set<string>();
    
    if (selectedNodeId) {
      connectedNodeIds.add(selectedNodeId);
      materias.forEach((m) => {
        const reqs = m.requerimientos.paraCursar;
        const relacionada = m.id === selectedNodeId || reqs.cursadas.includes(selectedNodeId) || reqs.finales.includes(selectedNodeId);
        if (relacionada) {
             connectedNodeIds.add(m.id);
             [...reqs.cursadas, ...reqs.finales].forEach(reqId => {
                 if (m.id === selectedNodeId || reqId === selectedNodeId) {
                    const tipo = reqs.cursadas.includes(reqId) ? 'cursada' : 'final';
                    connectedEdgeIds.add(`e-${tipo}-${reqId}-${m.id}`);
                    connectedNodeIds.add(reqId);
                 }
             });
        }
      });
    }

    const materiasOrdenadas = [...materias].sort((a, b) => {
      const aEsTroncal = MATERIAS_TRONCALES.has(a.id);
      const bEsTroncal = MATERIAS_TRONCALES.has(b.id);
      if (aEsTroncal && !bEsTroncal) return -1;
      if (!aEsTroncal && bEsTroncal) return 1;
      return 0;
    });

    materiasOrdenadas.forEach((materia) => {
      const habilitada = puedeCursar(materia, materias);
      const posX = (materia.anio - 1) * ANCHO_COLUMNA;
      const posY = posicionesY[materia.anio] * SEPARACION_VERTICAL;
      posicionesY[materia.anio]++;

      const isSelected = materia.id === selectedNodeId;
      const isDimmed = selectedNodeId !== null && !isSelected && !connectedNodeIds.has(materia.id);

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
            toggleMenu: () => setSelectedNodeId(prev => prev === materia.id ? null : materia.id),
            styleInfo: {
                background: getColorNodo(materia, habilitada),
                color: (materia.estado === 'aprobada' || !habilitada) ? '#eee' : '#111',
                border: isSelected ? '2px solid #fff' : '1px solid #555',
                opacity: isDimmed ? 0.2 : (habilitada || materia.estado !== 'pendiente' ? 1 : 0.6),
                filter: isDimmed ? 'grayscale(100%)' : 'none',
                zIndex: isSelected ? 10 : (connectedNodeIds.has(materia.id) ? 5 : 1),
                width: 190, 
            }
        },
        style: { zIndex: isSelected ? 10 : 1 },
      });

      const crearArista = (reqId: string, tipo: 'cursada' | 'final') => {
        const edgeId = `e-${tipo}-${reqId}-${materia.id}`;
        const esActiva = connectedEdgeIds.has(edgeId);
        const totalInputs = inputsCountMap[materia.id] || 1;
        const indiceInput = currentInputIndexMap[materia.id] || 0;
        const targetHandle = `target-${indiceInput}`;
        currentInputIndexMap[materia.id] = (indiceInput + 1) % totalInputs;
        
        let stroke = '#444'; 
        let width = 1;
        let zIndex = 1;
        
        if (selectedNodeId) {
           if (esActiva) {
             width = 2.5;
             zIndex = 10;
             stroke = reqId === selectedNodeId ? '#3b82f6' : (tipo === 'final' ? '#ef4444' : '#fb923c');
           } else {
             stroke = '#222';
           }
        }

        generatedEdges.push({
          id: edgeId,
          source: reqId,
          target: materia.id,
          sourceHandle: 'source-right',
          targetHandle: targetHandle,
          type: 'default', 
          animated: esActiva,
          zIndex,
          style: { 
            stroke, 
            strokeWidth: width, 
            strokeDasharray: tipo === 'final' ? '5,5' : '0', 
            opacity: selectedNodeId && !esActiva ? 0.05 : 1,
            pointerEvents: 'none' 
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
        });
      };
      
      materia.requerimientos.paraCursar.cursadas.forEach((reqId: string) => crearArista(reqId, 'cursada'));
      materia.requerimientos.paraCursar.finales.forEach((reqId: string) => crearArista(reqId, 'final'));
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
    <div style={{ width: '100vw', height: '100vh', background: '#121212', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      <Toaster position="bottom-center" richColors theme="dark" />

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />

      <Modal isOpen={showSimModal} onClose={() => setShowSimModal(false)} onConfirm={confirmSimulacion} title="🧪 Modo Simulación" confirmText="Comenzar">
        <p>En este modo puedes probar marcar materias para ver correlativas.</p>
        <p style={{ marginTop: '10px', color: '#fb923c', fontWeight: 'bold' }}>⚠️ Al salir, los cambios se perderán.</p>
      </Modal>

      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} onConfirm={confirmReiniciar} title="🗑️ Reiniciar Progreso" confirmText="Sí, Borrar Todo" isDanger>
        <p>¿Estás seguro? Volverás al estado inicial. No se puede deshacer.</p>
      </Modal>

      <div className="toolbar">
        <div className="toolbar-group">
            <select className="plan-selector" defaultValue="sistemas-k23" id="plan-selector" name="plan-selector">
                <option value="sistemas-k23">Ing. Sistemas (K23)</option>
                <option value="disabled" disabled>Más carreras pronto...</option>
            </select>
            
            <a href="https://github.com/ejdavenheimer/Plan-UTN" target="_blank" rel="noopener noreferrer" className="social-icon" title="Repositorio GitHub"><GithubIcon /></a>
            <a href="https://discord.gg/S33rHrCZrn" target="_blank" rel="noopener noreferrer" className="social-icon" title="Unite al Discord"><DiscordIcon /></a>
        </div>

        <div className="toolbar-group" style={{ gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span style={{ color: '#aaa' }}>Progreso:</span>
                <strong style={{ color: isSimulationMode ? '#3b82f6' : '#10b981' }}>{stats.aprobadas}/{stats.total} ({stats.porcentaje}%)</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span style={{ color: '#aaa' }}>Promedio:</span>
                <strong style={{ color: '#fb923c' }}>{stats.promedio}</strong>
            </div>
        </div>

        <div className="toolbar-group">
             <button onClick={handleExport} className="btn-tool" title="Descargar"><DownloadIcon /></button>
             <button onClick={handleImportClick} className="btn-tool" title="Cargar"><UploadIcon /></button>
             
             <div style={{width: '1px', height: '24px', background: '#333', margin: '0 8px'}}></div>

             <button onClick={handleSimulacionClick} className={`btn-tool ${isSimulationMode ? 'active' : ''}`}>
                {isSimulationMode ? <StopIcon /> : <PlayIcon />} {isSimulationMode ? 'Terminar' : 'Simular'}
            </button>
            <button onClick={() => setShowResetModal(true)} className="btn-tool btn-reset"><ResetIcon /> Reiniciar</button>
            <button onClick={() => setVerReferencias(!verReferencias)} className={`btn-tool ${verReferencias ? 'active' : ''}`}><InfoIcon /> Referencias</button>
        </div>
      </div>

      <div style={{ width: '100%', height: '4px', background: '#222', zIndex: 40 }}>
         <div style={{ width: `${stats.porcentaje}%`, height: '100%', background: isSimulationMode ? '#3b82f6' : 'linear-gradient(90deg, #10b981, #34d399)', transition: 'width 0.8s' }}></div>
      </div>

      <div style={{ flex: 1, position: 'relative', border: isSimulationMode ? '4px solid #2563eb' : 'none', boxSizing: 'border-box', overflow: 'hidden' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes} 
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            connectionLineType={ConnectionLineType.Bezier}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
          >
            <Background color="#333" gap={25} size={1} variant={BackgroundVariant.Dots} />
            <Controls position="bottom-right" />
            
            {isSimulationMode && (
                <Panel position="top-center" style={{ marginTop: '10px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.9)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                        MODO SIMULACIÓN
                    </div>
                </Panel>
            )}

            {verReferencias && (
                <Panel position="top-right" style={{ marginTop: '10px' }}>
                    <div className="legend-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #555', paddingBottom: '4px' }}>
                            <strong>Referencias</strong>
                            <button onClick={() => setVerReferencias(false)} style={{ background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                            <div className="legend-item"><div className="dot" style={{ background:'#f3f4f6' }}></div> Habilitada</div>
                            <div className="legend-item"><div className="dot" style={{ background:'#3b82f6' }}></div> Cursando</div>
                            <div className="legend-item"><div className="dot" style={{ background:'#f59e0b' }}></div> Regularizada</div>
                            <div className="legend-item"><div className="dot" style={{ background:'#10b981' }}></div> Aprobada</div>
                            <div style={{ borderTop: '1px solid #555', margin: '2px 0' }}></div>
                            <div className="legend-item"><div className="line" style={{ background:'#fb923c' }}></div> Requiere Cursada</div>
                            <div className="legend-item"><div className="line" style={{ borderTop:'2px dashed #ef4444', background: 'transparent' }}></div> Requiere Final</div>
                            <div className="legend-item"><div className="line" style={{ background:'#3b82f6' }}></div> Habilita Cursada</div>
                            <div className="legend-item"><div className="line" style={{ borderTop:'2px dashed #3b82f6', background: 'transparent' }}></div> Habilita Final</div>
                        </div>
                    </div>
                </Panel>
            )}
          </ReactFlow>
      </div>
    </div>
  );
}

export default App;