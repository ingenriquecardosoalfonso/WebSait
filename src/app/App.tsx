import { useState } from "react";
import { ModuleType } from "./types";
import {
  BarChart3,
  Target,
  Database,
  LineChart,
  Activity,
  ShieldCheck,
  LayoutGrid,
  Info
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Detector from "./components/Detector";
import DataExplorer from "./components/DataExplorer";
import Analysis from "./components/Analysis";
import LiveMonitor from "./components/LiveMonitor";
import About from "./components/About";

const MODULES = [
  {
    id: "DASHBOARD" as ModuleType,
    name: "Home",
    icon: LayoutGrid
  },
  {
    id: "DETECTOR" as ModuleType,
    name: "Detector",
    icon: Target
  },
  {
    id: "DATA_EXPLORER" as ModuleType,
    name: "Data Explorer",
    icon: Database
  },
  {
    id: "ANALYSIS" as ModuleType,
    name: "Analysis",
    icon: LineChart
  },
  {
    id: "ABOUT" as ModuleType,
    name: "About",
    icon: Info
  },
];

export default function App() {
  const [activeModule, setActiveModule] =
    useState<ModuleType>("DASHBOARD");

  const renderModule = () => {
    switch (activeModule) {
      case "DASHBOARD":
        return <Dashboard />;
      case "DETECTOR":
        return <Detector />;
      case "DATA_EXPLORER":
        return <DataExplorer />;
      case "ANALYSIS":
        return <Analysis />;
      case "ABOUT":
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] border-r border-gray-200 shadow-lg flex flex-col">
        {/* Logo Section (alineado a la izquierda) */}
        <div className="p-6 border-b bg-[var(--background)] ">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-[var(--color-sidebar-foreground)]" />
            <h1 className="text-lg font-bold text-[var(--color-sidebar-foreground)]">
              NetSieveX.io
            </h1>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 bg-[var(--background)]" >
          <div className="flex flex-col gap-2">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{module.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {renderModule()}
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="container mx-auto px-6 py-6 text-center bg-[var(--background)] text-[var(--foreground)] ">
            <p>
              IoT Security Analytics Platform - Machine Learning
              for Attack Detection
            </p>
            <p className="mt-1 text-[var(--foreground)]">
              Simulated data for demonstration purposes
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}