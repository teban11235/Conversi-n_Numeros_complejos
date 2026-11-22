import React, { useState, useEffect, useRef } from 'react';
import { Info, AlertTriangle, ArrowRightLeft, Zap, MousePointer2, Keyboard } from 'lucide-react';

const App = () => {
  // Estado principal: siempre guardamos las coordenadas cartesianas internamente
  const [point, setPoint] = useState({ x: 3, y: 4 });
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState('rectangular'); // 'rectangular' o 'polar'
  const svgRef = useRef(null);

  // Variables calculadas
  const a = point.x;
  const b = point.y;
  const r = Math.sqrt(a ** 2 + b ** 2);
  const thetaRad = Math.atan2(b, a);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  // Manejo de cambios manuales en Rectangular
  const handleRectChange = (coords) => {
    const nextPoint = { ...point, ...coords };
    setPoint(nextPoint);
  };

  // Manejo de cambios manuales en Polar
  const handlePolarChange = (values) => {
    const currentR = values.r !== undefined ? values.r : r;
    const currentThetaDeg = values.theta !== undefined ? values.theta : thetaDeg;
    const currentThetaRad = (currentThetaDeg * Math.PI) / 180;

    setPoint({
      x: parseFloat((currentR * Math.cos(currentThetaRad)).toFixed(2)),
      y: parseFloat((currentR * Math.sin(currentThetaRad)).toFixed(2))
    });
  };

  const updatePointFromEvent = (clientX, clientY) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return;
    
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const cursorPt = pt.matrixTransform(CTM.inverse());
    
    const newX = (cursorPt.x - 150) / 15;
    const newY = (150 - cursorPt.y) / 15;
    
    setPoint({
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Números Complejos</h1>
              <p className="text-slate-500"> </p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setInputMode('rectangular')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'rectangular' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Rectangular
            </button>
            <button 
              onClick={() => setInputMode('polar')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${inputMode === 'polar' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Polar
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel Izquierdo: Visualización */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-blue-500" />
                Plano Complejo
              </h2>
              <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-500">
                Escala 1:15
              </div>
            </div>

            <div className="relative aspect-square w-full max-w-[480px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner touch-none">
              <svg 
                ref={svgRef}
                viewBox="0 0 300 300" 
                className="w-full h-full cursor-crosshair"
                onMouseMove={(e) => isDragging && updatePointFromEvent(e.clientX, e.clientY)}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => { e.preventDefault(); setIsDragging(true); }}
                onTouchMove={(e) => isDragging && updatePointFromEvent(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={() => setIsDragging(false)}
              >
                {/* Cuadrícula */}
                {[...Array(21)].map((_, i) => (
                  <React.Fragment key={`grid-${i}`}>
                    <line x1={i * 15} y1="0" x2={i * 15} y2="300" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray={i === 10 ? "0" : "1,4"} />
                    <line x1="0" y1={i * 15} x2="300" y2={i * 15} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray={i === 10 ? "0" : "1,4"} />
                  </React.Fragment>
                ))}

                {/* Ejes Principales */}
                <line x1="0" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="2" />
                <line x1="150" y1="0" x2="150" y2="300" stroke="#475569" strokeWidth="2" />
                
                {/* Flechas de ejes */}
                <path d="M 295 147 L 300 150 L 295 153" fill="none" stroke="#475569" strokeWidth="2" />
                <path d="M 147 5 L 150 0 L 153 5" fill="none" stroke="#475569" strokeWidth="2" />

                <text x="280" y="140" fontSize="10" fill="#1e293b" fontWeight="bold">Re</text>
                <text x="158" y="15" fontSize="10" fill="#1e293b" fontWeight="bold">Im (j)</text>

                {/* Vector Visual */}
                <line 
                  x1="150" y1="150" 
                  x2={150 + a * 15} 
                  y2={150 - b * 15} 
                  stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
                />

                {/* Arco de Fase */}
                {r > 1 && (
                  <path 
                    d={`M 180 150 A 30 30 0 ${Math.abs(thetaDeg) > 180 ? 1 : 0} ${b > 0 ? 0 : 1} ${150 + 30 * Math.cos(thetaRad)} ${150 - 30 * Math.sin(thetaRad)}`}
                    fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="2,2"
                  />
                )}

                {/* Punto Activo */}
                <circle 
                  cx={150 + a * 15} cy={150 - b * 15} r="10" 
                  fill="#3b82f6" className="cursor-grab active:cursor-grabbing"
                  filter="drop-shadow(0 4px 3px rgb(0 0 0 / 0.3))"
                />
              </svg>
            </div>
          </div>

          {/* Panel Derecho: Controles Manuales y Conversión */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Entrada Manual */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
                <Keyboard className="w-5 h-5 text-slate-400" />
                Entrada Manual
              </h3>

              {inputMode === 'rectangular' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Parte Real (a)</label>
                      <input 
                        type="number" step="0.1" value={a}
                        onChange={(e) => handleRectChange({ x: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Parte Imag (b)</label>
                      <input 
                        type="number" step="0.1" value={b}
                        onChange={(e) => handleRectChange({ y: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-600 rounded-xl text-white text-center shadow-md">
                    <span className="text-sm opacity-80 block mb-1">Forma Rectangular</span>
                    <span className="text-2xl font-mono font-bold">z = {a} + {b}j</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Magnitud (r)</label>
                      <input 
                        type="number" step="0.1" min="0" value={r.toFixed(2)}
                        onChange={(e) => handlePolarChange({ r: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Ángulo (θ°)</label>
                      <input 
                        type="number" step="1" value={Math.round(thetaDeg)}
                        onChange={(e) => handlePolarChange({ theta: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-purple-600 rounded-xl text-white text-center shadow-md">
                    <span className="text-sm opacity-80 block mb-1">Forma Polar</span>
                    <span className="text-2xl font-mono font-bold">z = {r.toFixed(2)} ∠ {Math.round(thetaDeg)}°</span>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen de Conversión Dinámico */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-blue-400">
                <ArrowRightLeft className="w-5 h-5" />
                {inputMode === 'rectangular' ? 'Conversión a Polar' : 'Conversión a Rectangular'}
              </h3>
              
              <div className="space-y-6">
                {inputMode === 'rectangular' ? (
                  <>
                    {/* Rectangular -> Polar */}
                    <div className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Magnitud</div>
                        <div className="text-xl font-light">
                          r = √(a² + b²) = <span className="text-blue-400 font-medium">{r.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                        <span className="text-xs font-bold text-blue-400 group-hover:text-white">Mag</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fase</div>
                        <div className="text-xl font-light">
                          θ = tan⁻¹(b/a) = <span className="text-purple-400 font-medium">{Math.round(thetaDeg)}°</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-purple-600 transition-colors shrink-0">
                        <span className="text-xs font-bold text-purple-400 group-hover:text-white">Ang</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Polar -> Rectangular */}
                    <div className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Parte Real</div>
                        <div className="text-xl font-light">
                          a = r · cos(θ) = <span className="text-blue-400 font-medium">{a.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                        <span className="text-xs font-bold text-blue-400 group-hover:text-white">Re</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Parte Imaginaria</div>
                        <div className="text-xl font-light">
                          b = r · sin(θ) = <span className="text-purple-400 font-medium">{b.toFixed(2)}j</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-purple-600 transition-colors shrink-0">
                        <span className="text-xs font-bold text-purple-400 group-hover:text-white">Im</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-slate-800 pt-4 flex gap-4 text-[11px] text-slate-500 italic">
                  <span>* Valores calculados en tiempo real según la entrada.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nota de Cuadrantes */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-amber-500 w-6 h-6 shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-900 font-bold mb-1 uppercase tracking-tight text-sm">Validación de Cuadrante</h4>
              <p className="text-amber-800 text-sm leading-relaxed max-w-3xl">
                Al realizar la conversión manual de rectangular a polar, recuerda que la función arcotangente usualmente devuelve valores entre -90° y 90°. Si tu número complejo tiene una <strong>parte real negativa</strong> (Cuadrantes II y III), debes sumar 180° para obtener el ángulo correcto.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Informativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fasores</div>
              <div className="text-sm font-medium text-slate-700">Representan ondas senoidales en el dominio de la frecuencia.</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Impedancia</div>
              <div className="text-sm font-medium text-slate-700">La forma rectangular es ideal para sumar impedancias en serie.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;