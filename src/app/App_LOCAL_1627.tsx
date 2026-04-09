import { useState, useEffect } from "react";
import { ModuleType } from "./types";
import { Sun, Moon } from 'lucide-react';
import {
  Target,
  Database,
  LineChart,
  ShieldCheck,
  LayoutGrid,
  Info
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Detector from "./components/Detector";
import DataExplorer from "./components/DataExplorer";
import Analysis from "./components/Analysis";
import About from "./components/About";

const MODULES = [
  { id: "DASHBOARD" as ModuleType, name: "Home",          icon: LayoutGrid },
  { id: "DETECTOR"  as ModuleType, name: "Detector",      icon: Target     },
  { id: "DATA_EXPLORER" as ModuleType, name: "Data Explorer", icon: Database },
  { id: "ANALYSIS"  as ModuleType, name: "Analysis",      icon: LineChart  },
  { id: "ABOUT"     as ModuleType, name: "About",         icon: Info       },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>("DASHBOARD");

  // ── Activar dark mode (Velocity TDIR siempre oscuro) ──
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderModule = () => {
    switch (activeModule) {
      case "DASHBOARD":    return <Dashboard />;
      case "DETECTOR":     return <Detector />;
      case "DATA_EXPLORER": return <DataExplorer />;
      case "ANALYSIS":     return <Analysis />;
      case "ABOUT":        return <About />;
      default:             return <Dashboard />;
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col flex-shrink-0 outline-none sticky top-0 h-screen transition-all duration-200 ${isCollapsed ? 'w-20' : 'w-56'}`}
        style={{
          backgroundColor: "#060608",
          borderRight: "0.5px solid #1A1A22",
        }}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {/* Logo */}
        <div
          className="p-6 flex flex-col items-center gap-3"
          style={{ borderBottom: "0.5px solid #1A1A22" }}
        >
          <ShieldCheck className="w-10 h-10" style={{ color: "#C9B86C" }} />
          <h1
            className={`text-base font-semibold tracking-widest uppercase ${isCollapsed ? 'hidden' : 'block'}`}
            style={{ color: "#C9B86C" }}
          >
            NetSieveX.io
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <p
            className={`text-xs font-medium tracking-widest uppercase mb-4 px-2 ${isCollapsed ? "hidden" : "block"}`} 
            style={{ color: "rgb(255, 255, 255)" }}
          >
            Modules
          </p>
          <div className="flex flex-col gap-1">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded transition-all text-sm font-medium w-full text-left"
                  style={{
                    backgroundColor: isActive ? "rgba(201,184,108,0.12)" : "transparent",
                    color:           isActive ? "#C9B86C" : "#8A8A9A",
                    borderLeft:      isActive ? "2px solid #C9B86C" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "#C8CDD8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#8A8A9A";
                    }
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className={isCollapsed ? "hidden" : "block"}>{module.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer sidebar 123*/}
        <div className="p-3 flex flex-col items-center gap-2" style={{ borderTop: "0.5px solid #2A2A35" }}>
          <p className="text-xs text-center" style={{ color: "#4A4A5A" }}>
            The X-Stack v.1.0
          </p>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center rounded-full transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor: isDark ? "#1C1C22" : "#C9B86C",
              border: `0.5px solid ${isDark ? "#2A2A35" : "#8B7340"}`,
              width: isCollapsed ? "36px" : "fit-content",
              height: "36px",
              padding: isCollapsed ? "4px" : isDark ? "4px 14px 4px 4px" : "4px 4px 4px 14px",
              gap: "10px",
              flexDirection: isDark ? "row" : "row-reverse",
              justifyContent: "center",
            }}
          >
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: isDark ? "#2A2A35" : "#FFFFFF",
              }}
            >
              {isDark
                ? <Moon className="w-3.5 h-3.5" style={{ color: "#C9B86C" }} />
                : <Sun  className="w-3.5 h-3.5" style={{ color: "#C9B86C" }} />
              }
            </div>
            {!isCollapsed && (
              <span
                className="text-xs font-medium tracking-widest uppercase whitespace-nowrap"
                style={{ color: isDark ? "#8A8A9A" : "#141418" }}
              >
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col">
        {/* Top navbar */}
        {/* <header
          className="top-0 z-20 flex items-center justify-between px-6 h-14 flex-shrink-0"
          style={{
            backgroundColor: "#252530",
            borderBottom: "0.5px solid #2A2A35",
          }}
        >      
          <div
            className="text-xs font-mono px-2 py-1 rounded"
            style={{ backgroundColor: "#252530", color: "#ffffff" }}
          >
            {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
          </div> 

          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center justify-center w-7 h-7 rounded transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#8A8A9A',
            }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>  */}

        {/* Content */}
        <div className="flex-1 p-6 bg-background">
          {renderModule()}
        </div>

        {/* Footer */}
        <footer
          className="px-6 py-4 text-center text-xs text-muted-foreground"
          style={{
            borderTop: "0.5px solid #2A2A35",
          }}
        >
          IoT Security Analytics Platform · Machine Learning for Attack Detection ·{" "}
          <span className = "text-muted-foreground">Simulated data for demonstration</span>
        </footer>
      </main>
    </div>
  );
}

// ── Helper component ──
function NavChip({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-xs" style={{ color }}>
      {label}
    </span>
  );
}