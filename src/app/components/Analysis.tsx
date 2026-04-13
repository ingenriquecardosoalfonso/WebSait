import { useState, useMemo, useEffect } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const COLORS = ["#4CAF6E", "#E8383A"];

export default function Analysis() {
  const [dataset, setDataset] = useState<NetworkFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateMockDataset().then((data) => {
      setDataset(data);
      setLoading(false);
    });
  }, []);
  const normalData = useMemo(() => dataset.filter(f => f.Attack_grouped === 'Normal'), [dataset]);
  const attackData = useMemo(() => dataset.filter(f => f.Attack_grouped !== 'Normal'), [dataset]);
  
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
    type: f.Attack_grouped === 'Normal' ? 0 : 1,
    name: f.Attack_grouped,
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
        <h1 className="text-2xl font-semibold tracking-wide text-foreground">Comparative Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comparison between normal and malicious traffic</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Normal Traffic</h3>
          <div className="space-y-1 text-sm text-green-700">
            <p><span className="font-medium">Samples:</span> {normalData.length}</p>
            <p><span className="font-medium">Average duration:</span> {durationComparison[0].avgDuration.toFixed(2)}s</p>
            <p><span className="font-medium">Average packets/s:</span> {pktsComparison[0].avgPkts.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
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
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Flow Duration
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35"  />
              <XAxis dataKey="category" stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <YAxis stroke="#4A4A5A" label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#8A8A9A' }} tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px', 
                  color: 'var(--muted-foreground)' ,
                  fontSize: 12,
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--muted-foreground)' }}
              />
              <Bar dataKey="avgDuration" name="Average Duration (s)">
                {durationComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Packets per Second Comparison */}
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Packet Rate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pktsComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="category" stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <YAxis stroke="#4A4A5A" width={80}  label={{ value: 'Packets/s', angle: -90, position: 'insideLeft', fill: '#8A8A9A' }} tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px', 
                  color: 'var(--muted-foreground)',
                  fontSize: 12,
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--muted-foreground)' }}
              />
              <Bar dataKey="avgPkts" name="Average Packets/s">
                {pktsComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* TCP Flags Comparison */}
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            TCP Flags Patterns
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={flagsComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="flag" stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 12 }}/>
              <YAxis stroke="#4A4A5A" width={70}  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#8A8A9A' }} tick={{ fill: '#8A8A9A', fontSize: 12 }}  />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px', 
                  color: 'var(--muted-foreground)',
                  fontSize: 12,
                }} 
              />
              <Legend wrapperStyle={{ color: 'var(--muted-foreground)', fontSize: 12 }} />
              <Bar dataKey="Normal" fill="#10b981" />
              <Bar dataKey="Attack" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Down/Up Ratio */}
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Down/Up Ratio
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratioComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="category" stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <YAxis stroke="#4A4A5A" label={{ value: 'Ratio', angle: -90, position: 'insideLeft', fill: '#8A8A9A' }} tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '4px', 
                    color: 'var(--muted-foreground)', 
                    fontSize: 12 
                }}  
                labelStyle={{ color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--muted-foreground)' }}
              />
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
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Packets vs Duration (Colored by Type)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="duration" name="Duration" unit="s" stroke="#4A4A5A" height={50} label={{ value: 'Duration (s)', position: 'insideBottom', offset: 5, fill: '#8A8A9A', fontSize: 12 }} tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <YAxis dataKey="packets" name="Packets" stroke="#4A4A5A" width={80} label={{ value: 'Total Packets', angle: -90, position: 'insideLeft', fill: '#8A8A9A' }} tick={{ fill: '#8A8A9A', fontSize: 12 }}/>
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload as any;
                  return (
                    <div style={{
                      backgroundColor: 'var(--card)',
                      border: '0.5px solid var(--border)',
                      borderRadius: '4px',
                      fontSize: 12,
                      padding: '8px 12px',
                      color: 'var(--muted-foreground)',
                    }}>
                      <p className="font-semibold">{data.name}</p>
                      <p>Duration: {data.duration.toFixed(2)}s</p>
                      <p>Packets: {data.packets}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend wrapperStyle={{ color: '#8A8A9A', fontSize: 12 }} />
              <Scatter name="Normal" data={scatterData.filter(d => d.type === 0)} fill="#10b981" />
              <Scatter name="Attack" data={scatterData.filter(d => d.type === 1)} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Payload Comparison */}
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Payload Bytes per Second
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payloadComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35"/>
              <XAxis dataKey="category" stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 12 }} />
              <YAxis stroke="#6b7280" width={80} label={{ value: 'Bytes/s', angle: -90, position: 'insideLeft', fill: '#8A8A9A' }} tick={{ fill: '#8A8A9A', fontSize: 12 }}  />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '4px', 
                  color: 'var(--muted-foreground)' ,
                  fontSize: 12,
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--muted-foreground)' }}
              />
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