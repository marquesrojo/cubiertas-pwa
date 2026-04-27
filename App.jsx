import { useState, useEffect } from "react";

/* ─── GOOGLE FONTS ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Sora:wght@400;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html { font-size: 16px; }
    body { background: #07090f; color: #e2e8f0; font-family: 'Sora', sans-serif; overscroll-behavior: none; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0d1117; } ::-webkit-scrollbar-thumb { background: #1e2533; border-radius: 2px; }
    .mono { font-family: 'IBM Plex Mono', monospace; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.3} }
    :focus-visible { outline: 2px solid #f5a623; outline-offset: 2px; }
    button { cursor: pointer; font-family: inherit; }
  `}</style>
);

/* ─── TOKENS ───────────────────────────────────────────────────────────────── */
const C = {
  bg:"#07090f", surface:"#0d1117", surface2:"#111827", border:"#1e2533",
  amber:"#f5a623", amberDim:"#f5a62322",
  red:"#ef4444", green:"#22c55e", yellow:"#eab308", orange:"#f97316", blue:"#3b82f6",
  text:"#e2e8f0", muted:"#64748b", mutedLight:"#94a3b8",
};
const rciColor  = v => v>=70?C.green:v>=50?C.yellow:v>=30?C.orange:C.red;
const rciLabel  = v => v>=70?"EXCELENTE":v>=50?"REGULAR":v>=30?"POBRE":"CRÍTICO";
const rciRec    = v => v>=70?"Continuar programa semestral. Sin intervención estructural.":v>=50?"Reparaciones correctivas: masillas y microparches.":v>=30?"Presupuestar restauración con recubrimiento elastomérico. Ventana crítica.":"Suspender rutinario. Iniciar planificación de reemplazo total.";

/* ─── ATOMS ────────────────────────────────────────────────────────────────── */
const Badge = ({color,children,small})=>(
  <span className="mono" style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:3,padding:small?"1px 6px":"3px 8px",fontSize:small?9:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span>
);

const RciGauge = ({value,size=80})=>{
  const r=(size/2)-8, circ=2*Math.PI*r, color=rciColor(value);
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ*(1-value/100)} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1s ease,stroke 0.5s"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}
        fill={color} fontFamily="IBM Plex Mono" fontWeight="700" fontSize={size>70?18:13}>{value}</text>
    </svg>
  );
};

const Toggle = ({label,value,onChange,sub})=>(
  <div onClick={()=>onChange(!value)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer",minHeight:44,gap:12}}>
    <div style={{flex:1}}>
      <div style={{fontSize:13,color:value?C.text:C.mutedLight}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>{sub}</div>}
    </div>
    <div style={{width:42,height:24,borderRadius:12,background:value?C.green+"33":C.border,border:`1.5px solid ${value?C.green:C.border}`,position:"relative",transition:"all 0.2s",flexShrink:0}}>
      <div style={{width:18,height:18,borderRadius:9,background:value?C.green:C.muted,position:"absolute",top:2,left:value?20:2,transition:"all 0.2s"}}/>
    </div>
  </div>
);

const SeverityChips = ({value,onChange})=>{
  const levels=[{l:"Sin daño",c:C.green},{l:"Leve",c:C.yellow},{l:"Moderado",c:C.orange},{l:"Severo",c:C.red}];
  return(
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {levels.map(({l,c})=>(
        <button key={l} onClick={()=>onChange(l)} style={{background:value===l?c+"33":C.surface2,border:`1.5px solid ${value===l?c:C.border}`,borderRadius:6,padding:"8px 12px",color:value===l?c:C.muted,fontSize:12,fontFamily:"Sora,sans-serif",minHeight:44,transition:"all 0.15s"}}>{l}</button>
      ))}
    </div>
  );
};

const StatusDot = ({status})=>{
  const m={online:{color:C.green,label:"ONLINE",spin:false},offline:{color:C.amber,label:"OFFLINE",spin:false},syncing:{color:C.amber,label:"SYNC...",spin:true},error:{color:C.red,label:"ERROR",spin:false}};
  const s=m[status]||m.online;
  return(
    <div className="mono" style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:s.color,letterSpacing:"0.1em"}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:s.color,display:"inline-block",animation:s.spin?"spin 1s linear infinite":"pulseDot 2s infinite"}}/>
      {s.label}
    </div>
  );
};

const AlertBanner = ({color,icon,children})=>(
  <div style={{background:color+"11",border:`1px solid ${color}33`,borderRadius:6,padding:"8px 12px",display:"flex",gap:8,alignItems:"flex-start",marginBottom:14}}>
    {icon&&<span style={{color,fontSize:14,flexShrink:0}}>{icon}</span>}
    <span style={{fontSize:11,color}}>{children}</span>
  </div>
);

/* ─── MOCK DATA ─────────────────────────────────────────────────────────────── */
const PLANTS = [
  {id:"P01",name:"Planta Norte — Córdoba",      rci:78,area:4200,alerts:0,lastInsp:"14 Mar 2026",compliance:100,membrane:"TPO"},
  {id:"P02",name:"Nave Logística — Rosario",    rci:54,area:2800,alerts:2,lastInsp:"02 Feb 2026",compliance:75, membrane:"EPDM"},
  {id:"P03",name:"Planta Sur — Mendoza",        rci:31,area:6100,alerts:1,lastInsp:"15 Ene 2026",compliance:60, membrane:"PVC"},
  {id:"P04",name:"Centro Dist. — Buenos Aires", rci:22,area:3500,alerts:3,lastInsp:"20 Dic 2025",compliance:45, membrane:"Asfáltica"},
];
const TICKETS = [
  {id:"T-0041",plant:"Nave Logística — Rosario",     severity:"critico", desc:"Filtración activa en sector B-3, goteo sobre línea de producción",     status:"abierto",   daysOpen:3, sla:30},
  {id:"T-0039",plant:"Planta Sur — Mendoza",         severity:"moderado",desc:"Separación de costura en zona Este, longitud aprox. 4m",               status:"en_proceso",daysOpen:8, sla:null},
  {id:"T-0038",plant:"Centro Dist. — Buenos Aires",  severity:"critico", desc:"Múltiples perforaciones por granizo en sectores A-1 a A-4",            status:"abierto",   daysOpen:27,sla:30},
  {id:"T-0035",plant:"Centro Dist. — Buenos Aires",  severity:"leve",    desc:"Acumulación de hojas en embudo principal del sector Sur",              status:"resuelto",  daysOpen:0, sla:null},
];
const GRID = [[82,75,78,81,79],[68,54,62,71,77],[45,38,41,52,65],[28,22,31,38,44],[35,29,33,41,50]];
const JSA_LABELS = [
  "EPP completo (casco, arnés, línea de vida)",
  "Revisión estructural del techo antes de acceso",
  "Comunicación con supervisor aprobada",
  "Condiciones climáticas verificadas (sin lluvia, viento <40km/h)",
  "Señalización del área de trabajo activa",
  "Punto de anclaje certificado confirmado",
];

/* ─── LAYOUT SHELL ──────────────────────────────────────────────────────────── */
const TABS=[{id:"dashboard",icon:"▦",label:"DASHBOARD"},{id:"gemelo",icon:"◫",label:"GEMELO"},{id:"inspeccion",icon:"✓",label:"INSPECCIÓN"},{id:"tickets",icon:"◈",label:"TICKETS"}];

function Header({connectivity}){
  return(
    <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:24,height:24,background:C.amber,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:13,color:C.bg,fontWeight:900,fontFamily:"IBM Plex Mono"}}>G</span>
        </div>
        <div>
          <div className="mono" style={{fontSize:10,color:C.amber,letterSpacing:"0.12em",fontWeight:700}}>GRUPO AISLAR</div>
          <div className="mono" style={{fontSize:8,color:C.muted,letterSpacing:"0.1em"}}>CUBIERTAS INDUSTRIALES</div>
        </div>
      </div>
      <StatusDot status={connectivity}/>
    </header>
  );
}

function NavBar({active,onChange}){
  return(
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:200,maxWidth:430,margin:"0 auto"}}>
      {TABS.map(t=>{
        const on=active===t.id;
        return(
          <button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,background:"none",border:"none",borderBottom:on?`2px solid ${C.amber}`:"2px solid transparent",padding:"10px 4px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.15s",minHeight:56}}>
            <span style={{fontSize:18,color:on?C.amber:C.muted}}>{t.icon}</span>
            <span className="mono" style={{fontSize:8,letterSpacing:"0.1em",color:on?C.amber:C.muted,fontWeight:700}}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ─── SCREEN: DASHBOARD ─────────────────────────────────────────────────────── */
function KPICard({label,value,unit,color,sub}){
  return(
    <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 12px",animation:"fadeIn 0.4s ease"}}>
      <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:4}}>
        <span className="mono" style={{fontSize:26,fontWeight:700,color:color||C.text,lineHeight:1}}>{value}</span>
        {unit&&<span className="mono" style={{fontSize:11,color:C.muted}}>{unit}</span>}
      </div>
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function DistBar({label,count,total,color}){
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span className="mono" style={{fontSize:10,color:C.mutedLight,letterSpacing:"0.06em"}}>{label}</span>
        <span className="mono" style={{fontSize:10,color,fontWeight:700}}>{count}</span>
      </div>
      <div style={{height:6,background:C.border,borderRadius:3}}>
        <div style={{height:"100%",width:`${(count/total)*100}%`,background:color,borderRadius:3,transition:"width 0.8s ease"}}/>
      </div>
    </div>
  );
}

function DashboardScreen({onSelectPlant}){
  const avg  = Math.round(PLANTS.reduce((s,p)=>s+p.rci,0)/PLANTS.length);
  const comp = Math.round(PLANTS.reduce((s,p)=>s+p.compliance,0)/PLANTS.length);
  const open = TICKETS.filter(t=>t.status!=="resuelto").length;
  const crit = TICKETS.filter(t=>t.severity==="critico"&&t.status!=="resuelto").length;
  const dist = {
    excelente:PLANTS.filter(p=>p.rci>=70).length,
    regular:  PLANTS.filter(p=>p.rci>=50&&p.rci<70).length,
    pobre:    PLANTS.filter(p=>p.rci>=30&&p.rci<50).length,
    critico:  PLANTS.filter(p=>p.rci<30).length,
  };
  return(
    <div style={{padding:"16px 16px 80px",animation:"fadeIn 0.3s ease"}}>
      <div style={{marginBottom:16}}>
        <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase"}}>PORTAFOLIO — ABRIL 2026</div>
        <div style={{fontSize:20,fontWeight:600,marginTop:2}}>Dashboard Ejecutivo</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <KPICard label="RCI Promedio"   value={avg}  color={rciColor(avg)} sub={rciLabel(avg)}/>
        <KPICard label="PM Compliance"  value={comp} unit="%" color={comp>=90?C.green:comp>=70?C.yellow:C.red}/>
        <KPICard label="Alertas Activas" value={open} color={crit>0?C.red:C.amber} sub={crit>0?`${crit} críticos`:"Sin críticos"}/>
        <KPICard label="MTTR Promedio"  value="6.4"  unit="días" color={C.blue} sub="Últ. 30 días"/>
      </div>
      <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:14,marginBottom:12}}>
        <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Distribución por RCI</div>
        <DistBar label="EXCELENTE  70–100" count={dist.excelente} total={4} color={C.green}/>
        <DistBar label="REGULAR    50–69"  count={dist.regular}   total={4} color={C.yellow}/>
        <DistBar label="POBRE      30–49"  count={dist.pobre}     total={4} color={C.orange}/>
        <DistBar label="CRÍTICO     0–29"  count={dist.critico}   total={4} color={C.red}/>
      </div>
      <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:14,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Preventivo vs Reactivo</div>
          <Badge color={C.orange}>⚠ ATENCIÓN</Badge>
        </div>
        <div style={{height:10,borderRadius:5,overflow:"hidden",display:"flex"}}>
          <div style={{width:"58%",background:C.blue}}/>
          <div style={{flex:1,background:C.orange}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <span className="mono" style={{fontSize:10,color:C.blue}}>58% PREVENTIVO</span>
          <span className="mono" style={{fontSize:10,color:C.orange}}>42% REACTIVO</span>
        </div>
        <div style={{fontSize:11,color:C.muted,marginTop:6}}>Meta: 80/20. Plantas P03 y P04 requieren atención urgente.</div>
      </div>
      <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.12em",marginBottom:10,textTransform:"uppercase"}}>Instalaciones ({PLANTS.length})</div>
      {PLANTS.map((p,i)=>(
        <div key={p.id} onClick={()=>onSelectPlant(p)} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,animation:`fadeIn ${0.3+i*0.08}s ease`,transition:"border-color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.amber+"55"}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
          <RciGauge value={p.rci} size={52}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <Badge color={rciColor(p.rci)} small>{rciLabel(p.rci)}</Badge>
              <span className="mono" style={{fontSize:9,color:C.muted}}>{p.area.toLocaleString()} m²</span>
              <span className="mono" style={{fontSize:9,color:C.muted}}>{p.membrane}</span>
            </div>
          </div>
          {p.alerts>0&&<div style={{width:22,height:22,borderRadius:"50%",background:C.red+"22",border:`1px solid ${C.red}55`,display:"flex",alignItems:"center",justifyContent:"center"}}><span className="mono" style={{fontSize:10,color:C.red,fontWeight:700}}>{p.alerts}</span></div>}
          <span style={{color:C.muted,fontSize:16}}>›</span>
        </div>
      ))}
    </div>
  );
}

function PlantDetail({plant,onBack}){
  return(
    <div style={{padding:"16px 16px 80px",animation:"fadeIn 0.3s ease"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.amber,fontFamily:"IBM Plex Mono",fontSize:11,letterSpacing:"0.05em",marginBottom:16,padding:0}}>← VOLVER</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
        <RciGauge value={plant.rci} size={80}/>
        <div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>{plant.name}</div>
          <div className="mono" style={{fontSize:10,color:C.muted,marginBottom:6}}>{plant.area.toLocaleString()} m² · {plant.membrane}</div>
          <Badge color={rciColor(plant.rci)}>{rciLabel(plant.rci)}</Badge>
        </div>
      </div>
      <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:12}}>
        {[["Última inspección",plant.lastInsp],["PM Compliance",`${plant.compliance}%`],["Alertas activas",`${plant.alerts}`],["Tipo de membrana",plant.membrane],["Superficie",`${plant.area.toLocaleString()} m²`]].map(([k,v],i,arr)=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
            <span style={{fontSize:13,color:C.muted}}>{k}</span>
            <span style={{fontSize:13,fontWeight:600}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{background:rciColor(plant.rci)+"11",border:`1px solid ${rciColor(plant.rci)}33`,borderRadius:8,padding:14}}>
        <div className="mono" style={{fontSize:10,color:rciColor(plant.rci),letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Recomendación</div>
        <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{rciRec(plant.rci)}</div>
      </div>
    </div>
  );
}

/* ─── SCREEN: GEMELO DIGITAL ────────────────────────────────────────────────── */
function GemelScreen(){
  const [sel,setSel]=useState(PLANTS[0]);
  const [cell,setCell]=useState(null);
  const rows=["A","B","C","D","E"], cols=["1","2","3","4","5"];
  const hasTicket=(ri,ci)=>(ri===1&&ci===2)||(ri===3&&ci===0);
  return(
    <div style={{padding:"16px 16px 80px",animation:"fadeIn 0.3s ease"}}>
      <div style={{marginBottom:14}}>
        <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase"}}>REPRESENTACIÓN DIGITAL</div>
        <div style={{fontSize:20,fontWeight:600,marginTop:2}}>Gemelo Digital</div>
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
        {PLANTS.map(p=>(
          <button key={p.id} onClick={()=>{setSel(p);setCell(null);}} style={{background:sel.id===p.id?C.amberDim:C.surface2,border:`1px solid ${sel.id===p.id?C.amber:C.border}`,borderRadius:6,padding:"6px 12px",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s"}}>
            <span className="mono" style={{fontSize:9,color:sel.id===p.id?C.amber:C.mutedLight,letterSpacing:"0.08em"}}>{p.id}</span>
          </button>
        ))}
      </div>
      <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:13,fontWeight:600}}>{sel.name}</div>
          <div className="mono" style={{fontSize:10,color:C.muted,marginTop:2}}>{sel.area.toLocaleString()} m² · {sel.membrane}</div>
        </div>
        <RciGauge value={sel.rci} size={52}/>
      </div>
      <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:14,marginBottom:14}}>
        <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>MAPA DE SECTORES — GRILLA 5×5</div>
        <div style={{display:"grid",gridTemplateColumns:"22px repeat(5,1fr)",gap:4,marginBottom:4}}>
          <div/>
          {cols.map(c=><div key={c} className="mono" style={{textAlign:"center",fontSize:10,color:C.muted}}>{c}</div>)}
        </div>
        {rows.map((row,ri)=>(
          <div key={row} style={{display:"grid",gridTemplateColumns:"22px repeat(5,1fr)",gap:4,marginBottom:4}}>
            <div className="mono" style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.muted}}>{row}</div>
            {cols.map((col,ci)=>{
              const rci=GRID[ri][ci], color=rciColor(rci), sid=`${row}-${col}`, isSel=cell===sid;
              return(
                <div key={col} onClick={()=>setCell(isSel?null:sid)} style={{aspectRatio:"1",background:color+"22",border:`1.5px solid ${isSel?C.amber:color+"55"}`,borderRadius:4,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",transition:"all 0.15s"}}>
                  <span className="mono" style={{fontSize:10,fontWeight:700,color}}>{rci}</span>
                  {hasTicket(ri,ci)&&<div style={{position:"absolute",top:2,right:2,width:6,height:6,borderRadius:"50%",background:C.red}}/>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
          {[["EXCELENTE",C.green],["REGULAR",C.yellow],["POBRE",C.orange],["CRÍTICO",C.red]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,background:c+"44",border:`1.5px solid ${c}77`,borderRadius:2}}/>
              <span className="mono" style={{fontSize:8,color:C.muted,letterSpacing:"0.08em"}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      {cell&&(
        <div style={{background:C.surface2,border:`1px solid ${C.amber}44`,borderRadius:8,padding:14,animation:"slideUp 0.25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span className="mono" style={{fontSize:12,fontWeight:700,color:C.amber}}>SECTOR {cell}</span>
            <Badge color={rciColor(GRID[["A","B","C","D","E"].indexOf(cell[0])][parseInt(cell[2])-1])} small>
              RCI {GRID[["A","B","C","D","E"].indexOf(cell[0])][parseInt(cell[2])-1]}
            </Badge>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Última inspección","14 Mar 2026"],["Membrana",sel.membrane],["Tickets activos","0"],["Estado","Sin observaciones"]].map(([k,v])=>(
              <div key={k}>
                <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:12,color:C.text,marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SCREEN: INSPECCIÓN ────────────────────────────────────────────────────── */
const STEPS=[{id:1,label:"IDENTIFICACIÓN"},{id:2,label:"JSA"},{id:3,label:"MEMBRANA"},{id:4,label:"UNIONES"},{id:5,label:"DRENAJE"},{id:6,label:"EQUIPOS"},{id:7,label:"RCI FINAL"}];

function StepBar({step}){
  return(
    <div style={{padding:"10px 16px 0",background:C.surface,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
      <div style={{display:"flex",gap:0,minWidth:"max-content"}}>
        {STEPS.map((s,i)=>{
          const done=s.id<step, active=s.id===step;
          return(
            <div key={s.id} style={{display:"flex",alignItems:"center"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"0 8px 8px",borderBottom:active?`2px solid ${C.amber}`:"2px solid transparent"}}>
                <span style={{fontSize:15,color:done?C.green:active?C.amber:C.muted}}>{done?"✓":s.id}</span>
                <span className="mono" style={{fontSize:7,color:active?C.amber:C.muted,letterSpacing:"0.06em"}}>{s.label}</span>
              </div>
              {i<6&&<div style={{width:6,height:1,background:C.border,flexShrink:0}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InspeccionScreen(){
  const [step,setStep]=useState(1);
  const [plant,setPlant]=useState("");
  const [type,setType]=useState("");
  const [membrane,setMembrane]=useState("");
  const [jsa,setJsa]=useState(Array(6).fill(false));
  const [memb,setMemb]=useState({cuarteamiento:"",ampollas:"",granulos:"",perforaciones:"",uvDeg:""});
  const [drain,setDrain]=useState([false,false,false]);
  const [equip,setEquip]=useState([false,false,false]);
  const [showRCI,setShowRCI]=useState(false);

  const canNext=()=>{
    if(step===1)return !!(plant&&type&&membrane);
    if(step===2)return jsa.every(Boolean);
    if(step===3)return Object.values(memb).every(v=>v!=="");
    if(step===5)return drain.every(Boolean);
    if(step===6)return equip.every(Boolean);
    return true;
  };

  const calcRCI=()=>{
    const pen={"Sin daño":0,"Leve":0.25,"Moderado":0.6,"Severo":1};
    const w={perforaciones:18,ampollas:12,cuarteamiento:8,granulos:6,uvDeg:7};
    let t=0;
    Object.entries(w).forEach(([k,v])=>t+=(pen[memb[k]]||0)*v);
    if(!drain[1])t+=8;
    return Math.max(0,Math.round(100-t));
  };

  return(
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <StepBar step={step}/>
      <div style={{padding:"16px 16px 100px"}}>

        {/* STEP 1 */}
        {step===1&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:16}}>Identificación del Activo</div>
            <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",marginBottom:8,textTransform:"uppercase"}}>Planta</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
              {PLANTS.map(p=>(
                <button key={p.id} onClick={()=>setPlant(p.id)} style={{background:plant===p.id?C.amberDim:C.surface2,border:`1.5px solid ${plant===p.id?C.amber:C.border}`,borderRadius:8,padding:"12px 14px",cursor:"pointer",textAlign:"left",transition:"all 0.15s",minHeight:44}}>
                  <div style={{fontSize:13,color:plant===p.id?C.amber:C.text,fontFamily:"Sora,sans-serif"}}>{p.name}</div>
                  <div className="mono" style={{fontSize:9,color:C.muted,marginTop:2}}>{p.id} · {p.membrane}</div>
                </button>
              ))}
            </div>
            <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",marginBottom:8,textTransform:"uppercase"}}>Tipo de Inspección</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {["Primavera","Otoño","Post-Evento","Extraordinaria"].map(t=>(
                <button key={t} onClick={()=>setType(t)} style={{background:type===t?C.amberDim:C.surface2,border:`1.5px solid ${type===t?C.amber:C.border}`,borderRadius:6,padding:"10px 14px",cursor:"pointer",color:type===t?C.amber:C.text,fontSize:13,fontFamily:"Sora,sans-serif",minHeight:44,transition:"all 0.15s"}}>{t}</button>
              ))}
            </div>
            <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",marginBottom:8,textTransform:"uppercase"}}>Membrana</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["TPO","EPDM","PVC","Asfáltica"].map(m=>(
                <button key={m} onClick={()=>setMembrane(m)} style={{background:membrane===m?C.amberDim:C.surface2,border:`1.5px solid ${membrane===m?C.amber:C.border}`,borderRadius:6,padding:"10px 14px",cursor:"pointer",color:membrane===m?C.amber:C.text,fontSize:13,fontFamily:"Sora,sans-serif",minHeight:44,transition:"all 0.15s"}}>{m}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>JSA — Análisis de Seguridad</div>
            <AlertBanner color={C.amber} icon="⚠">Ley 19.587 / Decreto 911/96 — Todos los controles son obligatorios para avanzar</AlertBanner>
            {JSA_LABELS.map((l,i)=>(
              <Toggle key={i} label={l} value={jsa[i]} onChange={v=>{const a=[...jsa];a[i]=v;setJsa(a);}}/>
            ))}
            <div className="mono" style={{fontSize:10,color:jsa.every(Boolean)?C.green:C.red,marginTop:12,letterSpacing:"0.08em"}}>
              {jsa.every(Boolean)?"✓ TODOS LOS CONTROLES COMPLETADOS":`✗ ${jsa.filter(Boolean).length}/6 CONTROLES COMPLETADOS`}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>Superficie de Membrana</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Evaluá la severidad de cada indicador en el área inspeccionada.</div>
            {[["Cuarteamiento superficial","cuarteamiento"],["Ampollas (blistering)","ampollas"],["Pérdida de gránulos","granulos"],["Perforaciones / punzocortantes","perforaciones"],["Degradación UV","uvDeg"]].map(([label,key])=>(
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{label}</div>
                <SeverityChips value={memb[key]} onChange={v=>setMemb(p=>({...p,[key]:v}))}/>
              </div>
            ))}
            <div style={{background:C.surface2,border:`1.5px dashed ${C.border}`,borderRadius:8,padding:14,display:"flex",alignItems:"center",gap:10,cursor:"pointer",minHeight:56,marginTop:8}}>
              <span style={{fontSize:22}}>📷</span>
              <div><div style={{fontSize:13,fontWeight:600}}>Foto de membrana</div><div className="mono" style={{fontSize:9,color:C.red}}>OBLIGATORIO — demo omite cámara</div></div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step===4&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>Uniones y Costuras</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Evaluá el estado de las uniones y costuras de la membrana.</div>
            {[["Levantamiento por viento","levantamientoViento"],["Separación adhesiva","separacionAdhesiva"],["Estrés térmico","estresTérmico"]].map(([label,key])=>(
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{label}</div>
                <SeverityChips value={memb[key]||""} onChange={v=>setMemb(p=>({...p,[key]:v}))}/>
              </div>
            ))}
          </div>
        )}

        {/* STEP 5 */}
        {step===5&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>Sistema de Drenaje</div>
            <AlertBanner color={C.blue} icon="ℹ">El agua estancada por más de 48hs puede invalidar la garantía de la membrana.</AlertBanner>
            {["Embudos y rejillas sin escombros","Sin agua estancada por más de 48hs","Bajantes sin obstrucción verificada"].map((l,i)=>(
              <Toggle key={i} label={l} value={drain[i]} onChange={v=>{const a=[...drain];a[i]=v;setDrain(a);}}/>
            ))}
          </div>
        )}

        {/* STEP 6 */}
        {step===6&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>Equipos Montados</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Verificá el estado de los equipos instalados en el techo.</div>
            {["Soportes HVAC sin vibración","Sellos de claraboyas íntegros","Sin escorrentía de condensación"].map((l,i)=>(
              <Toggle key={i} label={l} value={equip[i]} onChange={v=>{const a=[...equip];a[i]=v;setEquip(a);}}/>
            ))}
          </div>
        )}

        {/* STEP 7 */}
        {step===7&&(
          <div style={{animation:"fadeIn 0.3s ease",textAlign:"center",paddingTop:8}}>
            <div style={{fontSize:16,fontWeight:600,marginBottom:20}}>RCI Final — Cierre</div>
            {!showRCI?(
              <button onClick={()=>setShowRCI(true)} style={{background:C.amber,color:C.bg,border:"none",borderRadius:10,padding:"14px 32px",fontFamily:"IBM Plex Mono",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:"0.1em"}}>CALCULAR RCI</button>
            ):(()=>{
              const rci=calcRCI();
              return(
                <div style={{animation:"slideUp 0.4s ease"}}>
                  <div style={{display:"inline-block",marginBottom:12}}><RciGauge value={rci} size={120}/></div>
                  <div style={{marginBottom:10}}><Badge color={rciColor(rci)}>{rciLabel(rci)}</Badge></div>
                  <div style={{fontSize:13,color:C.muted,maxWidth:280,margin:"0 auto 20px",lineHeight:1.6}}>{rciRec(rci)}</div>
                  <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:14,textAlign:"left",marginBottom:14}}>
                    <div className="mono" style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",marginBottom:8,textTransform:"uppercase"}}>Resumen</div>
                    {[["Planta",PLANTS.find(p=>p.id===plant)?.name||"—"],["Tipo",type],["Membrana",membrane],["Técnico","Operario Demo"]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                        <span style={{fontSize:12,color:C.muted}}>{k}</span>
                        <span style={{fontSize:12,color:C.text,fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>{setStep(1);setShowRCI(false);setPlant("");setType("");setMembrane("");setJsa(Array(6).fill(false));setMemb({cuarteamiento:"",ampollas:"",granulos:"",perforaciones:"",uvDeg:""});setDrain([false,false,false]);setEquip([false,false,false]);}} style={{background:C.green+"22",color:C.green,border:`1.5px solid ${C.green}55`,borderRadius:10,padding:"14px",fontFamily:"IBM Plex Mono",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:"0.1em",width:"100%"}}>
                    ✓ NUEVA INSPECCIÓN
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* NAV BUTTONS */}
        {step<7&&(
          <div style={{display:"flex",gap:10,marginTop:24}}>
            {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{flexShrink:0,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 20px",color:C.text,fontFamily:"IBM Plex Mono",fontSize:12,minHeight:44}}>← ATRÁS</button>}
            <button onClick={()=>canNext()&&setStep(s=>s+1)} disabled={!canNext()} style={{flex:1,background:canNext()?C.amber:C.border,color:canNext()?C.bg:C.muted,border:"none",borderRadius:10,padding:"14px",fontFamily:"IBM Plex Mono",fontSize:12,fontWeight:700,letterSpacing:"0.1em",transition:"all 0.2s",minHeight:44}}>
              SIGUIENTE PASO →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SCREEN: TICKETS ───────────────────────────────────────────────────────── */
const SEV={critico:{color:C.red,label:"CRÍTICO"},moderado:{color:C.orange,label:"MODERADO"},leve:{color:C.yellow,label:"LEVE"}};
const STAT={abierto:{color:C.red,label:"ABIERTO"},en_proceso:{color:C.blue,label:"EN PROCESO"},resuelto:{color:C.green,label:"RESUELTO"}};

function TicketsScreen(){
  const [filter,setFilter]=useState("todos");
  const [newOpen,setNewOpen]=useState(false);
  const [newSev,setNewSev]=useState("");
  const [newDesc,setNewDesc]=useState("");
  const [newPlant,setNewPlant]=useState("");
  const [tickets,setTickets]=useState(TICKETS);

  const filtered=filter==="todos"?tickets:filter==="abierto"?tickets.filter(t=>t.status!=="resuelto"):tickets.filter(t=>t.severity==="critico");

  const addTicket=()=>{
    if(!newSev||!newDesc||!newPlant)return;
    setTickets(prev=>[{id:`T-${String(prev.length+42).padStart(4,"0")}`,plant:PLANTS.find(p=>p.id===newPlant)?.name||newPlant,severity:newSev,desc:newDesc,status:"abierto",daysOpen:0,sla:newSev==="critico"?30:null},...prev]);
    setNewOpen(false);setNewSev("");setNewDesc("");setNewPlant("");
  };

  return(
    <div style={{padding:"16px 16px 80px",animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase"}}>INCIDENTES</div>
          <div style={{fontSize:20,fontWeight:600,marginTop:2}}>Filtraciones & Tickets</div>
        </div>
        <button onClick={()=>setNewOpen(!newOpen)} style={{background:C.amber,color:C.bg,border:"none",borderRadius:8,padding:"10px 14px",fontFamily:"IBM Plex Mono",fontSize:11,fontWeight:700,letterSpacing:"0.08em",minHeight:44}}>+ NUEVO</button>
      </div>

      {newOpen&&(
        <div style={{background:C.surface2,border:`1px solid ${C.amber}44`,borderRadius:8,padding:14,marginBottom:14,animation:"slideUp 0.25s ease"}}>
          <div className="mono" style={{fontSize:11,color:C.amber,letterSpacing:"0.1em",marginBottom:12,textTransform:"uppercase"}}>Nuevo Ticket</div>
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Planta</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {PLANTS.map(p=>(
                <button key={p.id} onClick={()=>setNewPlant(p.id)} style={{background:newPlant===p.id?C.amberDim:C.surface,border:`1.5px solid ${newPlant===p.id?C.amber:C.border}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",color:newPlant===p.id?C.amber:C.muted,fontSize:11,fontFamily:"IBM Plex Mono",minHeight:36,transition:"all 0.15s"}}>{p.id}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Severidad</div>
            <div style={{display:"flex",gap:6}}>
              {Object.entries(SEV).map(([k,v])=>(
                <button key={k} onClick={()=>setNewSev(k)} style={{background:newSev===k?v.color+"33":C.surface,border:`1.5px solid ${newSev===k?v.color:C.border}`,borderRadius:6,padding:"8px 12px",cursor:"pointer",color:newSev===k?v.color:C.muted,fontSize:11,fontFamily:"IBM Plex Mono",fontWeight:700,minHeight:44,transition:"all 0.15s"}}>{v.label}</button>
              ))}
            </div>
          </div>
          {newSev==="critico"&&<AlertBanner color={C.red} icon="🚨">Ticket Crítico inicia contador SLA de 30 días para notificación al proveedor.</AlertBanner>}
          <div style={{marginBottom:12}}>
            <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Descripción</div>
            <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Describí el incidente..." style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px",color:C.text,fontSize:13,fontFamily:"Sora,sans-serif",resize:"vertical",minHeight:80,outline:"none"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setNewOpen(false)} style={{flex:1,background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"12px",color:C.muted,fontFamily:"IBM Plex Mono",fontSize:11}}>CANCELAR</button>
            <button onClick={addTicket} disabled={!newSev||!newDesc||!newPlant} style={{flex:2,background:newSev&&newDesc&&newPlant?C.amber:C.border,color:newSev&&newDesc&&newPlant?C.bg:C.muted,border:"none",borderRadius:8,padding:"12px",fontFamily:"IBM Plex Mono",fontSize:11,fontWeight:700,transition:"all 0.2s"}}>CREAR TICKET</button>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["todos","TODOS"],["abierto","ABIERTOS"],["critico","CRÍTICOS"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{background:filter===k?C.amberDim:C.surface2,border:`1px solid ${filter===k?C.amber:C.border}`,borderRadius:6,padding:"7px 12px",fontFamily:"IBM Plex Mono",fontSize:9,fontWeight:700,color:filter===k?C.amber:C.muted,letterSpacing:"0.08em",minHeight:36,transition:"all 0.15s"}}>{l}</button>
        ))}
      </div>

      {filtered.map((t,i)=>{
        const sev=SEV[t.severity]||SEV.leve;
        const stat=STAT[t.status]||STAT.abierto;
        const urgent=t.severity==="critico"&&t.status!=="resuelto"&&t.daysOpen>=25;
        return(
          <div key={t.id} style={{background:C.surface2,border:`1px solid ${urgent?C.red+"66":C.border}`,borderRadius:8,padding:14,marginBottom:10,animation:`fadeIn ${0.3+i*0.07}s ease`,position:"relative"}}>
            {urgent&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${C.red},${C.orange})`,borderRadius:"8px 8px 0 0"}}/>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                <span className="mono" style={{fontSize:11,color:C.amber,fontWeight:700}}>{t.id}</span>
                <Badge color={sev.color} small>{sev.label}</Badge>
                <Badge color={stat.color} small>{stat.label}</Badge>
              </div>
              {urgent&&<Badge color={C.red}>⚠ SLA D+{t.daysOpen}</Badge>}
            </div>
            <div style={{fontSize:13,color:C.text,marginBottom:8,lineHeight:1.5}}>{t.desc}</div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:C.muted}}>{t.plant}</span>
              {t.status!=="resuelto"&&<span className="mono" style={{fontSize:10,color:C.muted}}>D+{t.daysOpen}</span>}
              {t.sla&&t.status!=="resuelto"&&<span className="mono" style={{fontSize:10,color:t.daysOpen>=25?C.red:C.muted}}>SLA: {t.sla-t.daysOpen}d restantes</span>}
            </div>
          </div>
        );
      })}
      {filtered.length===0&&<div style={{textAlign:"center",color:C.muted,padding:"40px 0",fontSize:13}}>No hay tickets en este filtro</div>}
    </div>
  );
}

/* ─── APP ROOT ──────────────────────────────────────────────────────────────── */
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [conn,setConn]=useState("online");
  const [selPlant,setSelPlant]=useState(null);

  useEffect(()=>{
    const cycle=["online","online","syncing","online","online","offline","syncing","online"];
    let i=0;
    const id=setInterval(()=>{i=(i+1)%cycle.length;setConn(cycle[i]);},5000);
    return()=>clearInterval(id);
  },[]);

  const changeTab=(t)=>{setTab(t);setSelPlant(null);};

  return(
    <>
      <FontLoader/>
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative"}}>
        <Header connectivity={conn}/>
        <div style={{overflowY:"auto",height:"calc(100vh - 57px)"}}>
          {tab==="dashboard"&&!selPlant&&<DashboardScreen onSelectPlant={setSelPlant}/>}
          {tab==="dashboard"&&selPlant&&<PlantDetail plant={selPlant} onBack={()=>setSelPlant(null)}/>}
          {tab==="gemelo"&&<GemelScreen/>}
          {tab==="inspeccion"&&<InspeccionScreen/>}
          {tab==="tickets"&&<TicketsScreen/>}
        </div>
        <NavBar active={tab} onChange={changeTab}/>
      </div>
    </>
  );
}
