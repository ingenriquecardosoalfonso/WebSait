import { useState, useEffect, useRef } from 'react';
import { NetworkFlow } from '../types';
import { generateMockFlow } from '../mockData';
import { apiFetch } from '../../services/apiService';
import { Activity, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const MAX_FLOWS = 100;
const UPDATE_INTERVAL = 2000;

export default function LiveMonitor() {
  const [isRunning, setIsRunning] = useState(false);
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({
    totalFlows: 0,
    attacksDetected: 0,
    normalFlows: 0,
    packetsPerSec: [] as { time: string; value: number }[],
  });
  const flowCountRef = useRef(0);
  const realFlowsRef = useRef<NetworkFlow[]>([]);

  // Cargar datos reales de la API al montar
  useEffect(() => {
  apiFetch('/api/network-flows/').then((data: NetworkFlow[]) => {
    realFlowsRef.current = data;
    setLoadingData(false);
  });
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const realFlows = realFlowsRef.current;
      if (realFlows.length === 0) return;

      // Tomar una fila aleatoria de los datos reales
      const randomRow = realFlows[Math.floor(Math.random() * realFlows.length)];
      const newFlow = generateMockFlow(randomRow);

      setFlows(prevFlows => {
        const updated = [newFlow, ...prevFlows].slice(0, MAX_FLOWS);
        return updated;
      });

      setStats(prevStats => {
        const isAttack = newFlow.Attack_grouped !== 'Normal';
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const newPacketsData = [
          ...prevStats.packetsPerSec,
          { time: now, value: newFlow.flow_pkts_per_sec }
        ].slice(-20);

        return {
          totalFlows: prevStats.totalFlows + 1,
          attacksDetected: prevStats.attacksDetected + (isAttack ? 1 : 0),
          normalFlows: prevStats.normalFlows + (isAttack ? 0 : 1),
          packetsPerSec: newPacketsData,
        };
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setFlows([]);
    setStats({
      totalFlows: 0,
      attacksDetected: 0,
      normalFlows: 0,
      packetsPerSec: [],
    });
    flowCountRef.current = 0;
  };

  const detectionRate = stats.totalFlows > 0
    ? ((stats.attacksDetected / stats.totalFlows) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Monitor</h1>
          <p className="text-gray-600 mt-2">Real-time traffic capture simulation</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleToggle}
            disabled={loadingData}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              loadingData
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : isRunning
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loadingData ? (
              <>
                <Activity className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : isRunning ? (
              <>
                <PauseCircle className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Start
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`p-4 rounded-lg border-2 ${
        isRunning ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="font-semibold">
            {isRunning ? 'CAPTURING LIVE TRAFFIC' : 'MONITOR STOPPED'}
          </span>
          {isRunning && (
            <span className="text-sm text-gray-600 ml-auto">
              Update every {UPDATE_INTERVAL / 1000}s
            </span>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Flows</p>
              <p className="text-3xl font-bold mt-1">{stats.totalFlows}</p>
            </div>
            <Activity className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attacks Detected</p>
              <p className="text-3xl font-bold mt-1 text-red-600">{stats.attacksDetected}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Normal Traffic</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{stats.normalFlows}</p>
            </div>
            <Activity className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Detection Rate</p>
              <p className="text-3xl font-bold mt-1 text-purple-600">{detectionRate}%</p>
            </div>
            <AlertCircle className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Live Chart */}
      {stats.packetsPerSec.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Packets per Second (Real-Time)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.packetsPerSec}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} name="Packets/s" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Flow Stream */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Flow Stream (Last {MAX_FLOWS})</h2>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {flows.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No flows captured. Click "Start" to begin capture.</p>
            </div>
          ) : (
            <div className="divide-y">
              {flows.map((flow) => {
                const isAttack = flow.Attack_grouped !== 'Normal';
                return (
                  <div
                    key={flow.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      isAttack ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs block">ID</span>
                          <span className="font-mono">{flow.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Protocol</span>
                          <span className="font-semibold uppercase">{flow.proto}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Service</span>
                          <span>{flow.service}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Packets/s</span>
                          <span>{flow.flow_pkts_per_sec.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Duration</span>
                          <span>{flow.flow_duration.toFixed(2)}s</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">Classification</span>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            isAttack ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {flow.Attack_grouped}
                          </span>
                        </div>
                      </div>
                      {isAttack && (
                        <div className="ml-4">
                          <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}