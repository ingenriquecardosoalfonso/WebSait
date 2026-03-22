import { useState, useMemo } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const COLORS = ['#10b981', '#ef4444'];

export default function Analysis() {
  const [dataset] = useState<NetworkFlow[]>(() => generateMockDataset(800));
  
  const normalData = useMemo(() => dataset.filter(f => f.Attack_type === 'Normal'), [dataset]);
  const attackData = useMemo(() => dataset.filter(f => f.Attack_type !== 'Normal'), [dataset]);
  
  // Duration comparison
  const durationComparison = [
    {
      category: 'Normal',
      avgDuration: normalData.reduce((sum, f) => sum + f.flow_duration, 0) / normalData.length,
      count: normalData.length,
    },
    {
      category: 'Attack',
      avgDuration: attackData.reduce((sum, f) => sum + f.flow_duration, 0) / attackData.length,
      count: attackData.length,
    },
  ];
  
  // Packets per second comparison
  const pktsComparison = [
    {
      category: 'Normal',
      avgPkts: normalData.reduce((sum, f) => sum + f.flow_pkts_per_sec, 0) / normalData.length,
    },
    {
      category: 'Attack',
      avgPkts: attackData.reduce((sum, f) => sum + f.flow_pkts_per_sec, 0) / attackData.length,
    },
  ];
  
  // TCP Flags comparison
  const flagsComparison = [
    {
      flag: 'SYN',
      Normal: normalData.reduce((sum, f) => sum + f.flow_SYN_flag_count, 0) / normalData.length,
      Attack: attackData.reduce((sum, f) => sum + f.flow_SYN_flag_count, 0) / attackData.length,
    },
    {
      flag: 'ACK',
      Normal: normalData.reduce((sum, f) => sum + f.flow_ACK_flag_count, 0) / normalData.length,
      Attack: attackData.reduce((sum, f) => sum + f.flow_ACK_flag_count, 0) / attackData.length,
    },
    {
      flag: 'RST',
      Normal: normalData.reduce((sum, f) => sum + f.flow_RST_flag_count, 0) / normalData.length,
      Attack: attackData.reduce((sum, f) => sum + f.flow_RST_flag_count, 0) / attackData.length,
    },
    {
      flag: 'FIN',
      Normal: normalData.reduce((sum, f) => sum + f.flow_FIN_flag_count, 0) / normalData.length,
      Attack: attackData.reduce((sum, f) => sum + f.flow_FIN_flag_count, 0) / attackData.length,
    },
  ];
  
  // Scatter plot data (packets vs duration)
  const scatterData = dataset.slice(0, 200).map(f => ({
    duration: f.flow_duration,
    packets: f.fwd_pkts_tot + f.bwd_pkts_tot,
    type: f.Attack_type === 'Normal' ? 0 : 1,
    name: f.Attack_type,
  }));
  
  // Down/Up ratio comparison
  const ratioComparison = [
    {
      category: 'Normal',
      avgRatio: normalData.reduce((sum, f) => sum + f.down_up_ratio, 0) / normalData.length,
    },
    {
      category: 'Attack',
      avgRatio: attackData.reduce((sum, f) => sum + f.down_up_ratio, 0) / attackData.length,
    },
  ];
  
  // Payload comparison
  const payloadComparison = [
    {
      category: 'Normal',
      avgPayload: normalData.reduce((sum, f) => sum + f.payload_bytes_per_second, 0) / normalData.length,
    },
    {
      category: 'Attack',
      avgPayload: attackData.reduce((sum, f) => sum + f.payload_bytes_per_second, 0) / attackData.length,
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white underline decoration-2 decoration-sky-800">Comparative Analysis</h1>
        <p className="text-xl dark:text-sky-200">Comparison between normal and malicious traffic</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Normal Traffic</h3>
          <div className="space-y-1 text-sm text-green-700">
            <p><span className="font-medium">Samples:</span> {normalData.length}</p>
            <p><span className="font-medium">Average duration:</span> {durationComparison[0].avgDuration.toFixed(2)}s</p>
            <p><span className="font-medium">Average packets/s:</span> {pktsComparison[0].avgPkts.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Malicious Traffic</h3>
          <div className="space-y-1 text-sm text-red-700">
            <p><span className="font-medium">Samples:</span> {attackData.length}</p>
            <p><span className="font-medium">Average duration:</span> {durationComparison[1].avgDuration.toFixed(2)}s</p>
            <p><span className="font-medium">Average packets/s:</span> {pktsComparison[1].avgPkts.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration Comparison */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flow Duration</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }} />
              <Bar dataKey="avgDuration" name="Average Duration (s)">
                {durationComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Packets per Second Comparison */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Packet Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pktsComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" width={80}  label={{ value: 'Packets/s', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }} />
              <Bar dataKey="avgPkts" name="Average Packets/s">
                {pktsComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* TCP Flags Comparison */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">TCP Flags Patterns</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={flagsComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="flag" stroke="#6b7280" />
              <YAxis stroke="#6b7280" width={70}  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#6b7280' }}  />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }} />
              <Legend wrapperStyle={{ color: '#1f2937' }} />
              <Bar dataKey="Normal" fill="#10b981" />
              <Bar dataKey="Attack" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Down/Up Ratio */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Down/Up Ratio</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratioComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" label={{ value: 'Ratio', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }} />
              <Bar dataKey="avgRatio" name="Down/Up Ratio">
                {ratioComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Large Charts */}
      <div className="space-y-6">
        {/* Scatter Plot */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Packets vs Duration (Colored by Type)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="duration" name="Duration" unit="s" stroke="#6b7280" height={50} label={{ value: 'Duration (s)', position: 'insideBottom', offset: -5, fill: '#6b7280' }} />
              <YAxis dataKey="packets" name="Packets" stroke="#6b7280" width={80} label={{ value: 'Total Packets', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload as any;
                  return (
                    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                      <p className="font-semibold text-gray-800">{data.name}</p>
                      <p className="text-sm text-gray-700">Duration: {data.duration.toFixed(2)}s</p>
                      <p className="text-sm text-gray-700">Packets: {data.packets}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend wrapperStyle={{ color: '#1f2937' }} />
              <Scatter name="Normal" data={scatterData.filter(d => d.type === 0)} fill="#10b981" />
              <Scatter name="Attack" data={scatterData.filter(d => d.type === 1)} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Payload Comparison */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Payload Bytes per Second</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payloadComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" width={80} label={{ value: 'Bytes/s', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }} />
              <Bar dataKey="avgPayload" name="Average Payload (Bytes/s)">
                {payloadComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} /* This is Analysis component that provides a comprehensive comparative analysis between normal and malicious network traffic using various charts and metrics. It includes summary cards, bar charts for different features, and a scatter plot to visualize the relationship between packets and duration. The data is generated using a mock dataset for demonstration purposes. */