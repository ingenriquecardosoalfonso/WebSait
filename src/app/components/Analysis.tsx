import { useState, useMemo, useEffect } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts';

interface DataExplorerProps {
  dataset: NetworkFlow[];
  loading: boolean;
}

export default function Analysis({ dataset, loading }: DataExplorerProps) {
  //const [dataset, setDataset] = useState<NetworkFlow[]>([]);
  //const [loading, setLoading] = useState(true);

  /* useEffect(() => {
    generateMockDataset().then((data) => {
      setDataset(data);
      setLoading(false);
    });
  }, []); */
  
  const attackTypeData = useMemo(() => {
    if (dataset.length === 0) return [];
    const groups = dataset.reduce((acc, curr) => {
      const name = curr.Attack_grouped;
      if (!acc[name]) {
        acc[name] = { sum: 0, count: 0 };
      }
      acc[name].sum += curr.flow_pkts_per_sec;
      acc[name].count += 1;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    return Object.keys(groups)
      .map(key => ({
        category: key,
        value: groups[key].sum / groups[key].count
      }))
      .sort((a, b) => b.value - a.value);
  }, [dataset]);

  const ATTACK_COLORS: Record<string, string> = {
    'Normal': '#00B8CC',
    'DOS_SYN_Hping': '#E67E22',
    'ARP_poisioning': '#1A5276',
    'NMAP': '#1D8348',
  };
  
  const payloadByAttackData = useMemo(() => {
  if (dataset.length === 0) return [];

  const groups = dataset.reduce((acc, curr) => {
    const name = curr.Attack_grouped;
    if (!acc[name]) {
      acc[name] = { sum: 0, count: 0 };
    }
    acc[name].sum += curr.payload_bytes_per_second;
    acc[name].count += 1;
    return acc;
  }, {} as Record<string, { sum: number; count: number }>);

  return Object.keys(groups)
    .map(key => ({
      category: key,
      avgPayload: groups[key].sum / groups[key].count
    }))
    .sort((a, b) => b.avgPayload - a.avgPayload);
    }, [dataset]);

  const dataDistributionByAttackType = useMemo(() => {
  if (dataset.length === 0) return [];

  const groups = dataset.reduce((acc, curr) => {
    const attack = curr.Attack_grouped;
    const proto = curr.proto?.toLowerCase(); // Aseguramos que coincida con icmp, tcp, udp

    if (!acc[attack]) {
      acc[attack] = { category: attack, total: 0, tcp: 0, udp: 0, icmp: 0 };
    }

    if (proto === 'tcp' || proto === 'udp' || proto === 'icmp') {
      acc[attack][proto] += 1;
      acc[attack].total += 1;
    }

    return acc;
  }, {} as Record<string, any>);

  return Object.values(groups).map((group: any) => ({
    category: group.category,
    tcp: parseFloat(((group.tcp / group.total) * 100).toFixed(2)),
    udp: parseFloat(((group.udp / group.total) * 100).toFixed(2)),
    icmp: parseFloat(((group.icmp / group.total) * 100).toFixed(2)),
  }));
  }, [dataset]);
  
  const tcpFlagsByAttackData = useMemo(() => {
  if (dataset.length === 0) return [];
    const flags = [
      { key: 'flow_SYN_flag_count', label: 'SYN' },
      { key: 'flow_ACK_flag_count', label: 'ACK' },
      { key: 'flow_FIN_flag_count', label: 'FIN' },
      { key: 'flow_RST_flag_count', label: 'RST' }
    ];

    const attackGroups = Array.from(new Set(dataset.map(d => d.Attack_grouped)));
    return flags.map(flag => {
      const dataPoint: any = { flag: flag.label };
      let rowTotal = 0;

      attackGroups.forEach(groupName => {
      const groupRows = dataset.filter(d => d.Attack_grouped === groupName);
      const avg = groupRows.reduce((sum, curr: any) => sum + (curr[flag.key] || 0), 0) / groupRows.length;
      dataPoint[groupName] = avg;
      rowTotal += avg;
    });
    attackGroups.forEach(groupName => {
      dataPoint[groupName] = rowTotal > 0 ? dataPoint[groupName] / rowTotal : 0;
    });

    return dataPoint;
    });
    }, [dataset]);
  
  const flowDurationData = useMemo(() => {
  if (dataset.length === 0) return [];

  const groups = dataset.reduce((acc, curr) => {
    const name = curr.Attack_grouped;
    if (!acc[name]) {
      acc[name] = { sum: 0, count: 0 };
    }
    acc[name].sum += curr.flow_duration;
    acc[name].count += 1;
    return acc;
  }, {} as Record<string, { sum: number; count: number }>);

  return Object.keys(groups)
    .map(key => ({
      category: key,
      avgDuration: groups[key].sum / groups[key].count
    }))
    .sort((a, b) => a.avgDuration - b.avgDuration);
  }, [dataset]);
  
  const serviceDistributionData = useMemo(() => {
  if (dataset.length === 0) return [];

  const groups = dataset.reduce((acc, curr) => {
    const attack = curr.Attack_grouped;
    const service = curr.service || 'Unidentified';

    if (!acc[attack]) {
      acc[attack] = { category: attack, total: 0 };
    }
    
    acc[attack][service] = (acc[attack][service] || 0) + 1;
    acc[attack].total += 1;
    return acc;
  }, {} as Record<string, any>);

  return Object.values(groups).map((group: any) => {
    const formatted: any = { category: group.category };
    Object.keys(group).forEach(key => {
      if (key !== 'category' && key !== 'total') {
        formatted[key] = group[key] / group.total;
      }
    });
    return formatted;
    });
  }, [dataset]);

  const SERVICE_COLORS: Record<string, string> = {
    'dhcp': '#2e7d32',
    'dns': '#ed7d31',
    'http': '#1b5e20',
    'irc': '#0288d1',
    'mqtt': '#9c27b0',
    'ntp': '#4caf50',
    'radius': '#01579b',
    'ssl': '#a14214',
    'Unidentified': '#0a330c'
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ color: 'var(--vt-text-muted)' }}>
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
            style={{ borderColor: 'var(--border)', borderTopColor: '#00B8CC' }} />
          <p className="text-sm">Loading dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-wide text-foreground">Comparative Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comparison between normal and malicious traffic</p>
      </div>      
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Average Packets per Second by Attack Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={attackTypeData} 
              layout="vertical" 
              margin={{ left: 30, right: 30 }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" horizontal={false} />
              <XAxis 
                type="number" 
                scale="log" 
                domain={[1, 1000000]} 
                allowDataOverflow
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 12 }}
              />
              
              <YAxis 
                dataKey="category" 
                type="category" 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 11 }} 
                width={100}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {attackTypeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ATTACK_COLORS[entry.category] || '#8884d8'} 
                  />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="insideRight" 
                  fill="#ffffff" 
                  fontSize={11}
                  fontWeight="bold"
                  offset={10}
                  formatter={(value: number) => 
                    value.toLocaleString(undefined, { maximumFractionDigits: 1 })
                  } 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Average Payload Bytes per Second by Attack Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={payloadByAttackData} 
              layout="vertical" 
              margin={{ left: 40, right: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" horizontal={false} />
              <XAxis 
                type="number" 
                scale="log" 
                domain={[1, 100000000]} 
                allowDataOverflow
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 11 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                dataKey="category" 
                type="category" 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
                width={120}
              />
              <Bar dataKey="avgPayload" radius={[0, 4, 4, 0]}>
                {payloadByAttackData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ATTACK_COLORS[entry.category] || '#8884d8'} 
                  />
                ))}
                <LabelList 
                  dataKey="avgPayload" 
                  position="insideRight" 
                  fill="#ffffff" 
                  fontSize={11}
                  fontWeight="bold"
                  offset={10}
                  formatter={(avgPayload: number) => 
                    avgPayload.toLocaleString(undefined, { maximumFractionDigits: 1 })
                  } 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Protocol Distribution by Attack Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataDistributionByAttackType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
              />
              <YAxis 
                stroke="#4A4A5A" 
                tickFormatter={(value) => `${value}%`} 
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
              />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
              <Bar dataKey="tcp" stackId="a" fill="#ed7d31" name="tcp">
                <LabelList 
                  dataKey="tcp" 
                  position="center" 
                  fill="#fff" 
                  fontSize={10} 
                  formatter={(tcp: number) => tcp > 0 ? `${tcp}%` : ''} 
                />
              </Bar>
              <Bar dataKey="udp" stackId="a" fill="#2e7d32" name="udp">
                <LabelList 
                  dataKey="udp" 
                  position="center" 
                  fill="#fff" 
                  fontSize={10} 
                  formatter={(udp: number) => udp > 0 ? `${udp}%` : ''} 
                />
              </Bar>
              <Bar dataKey="icmp" stackId="a" fill="#1f4e79" name="icmp">
                <LabelList dataKey="icmp" position="center" fill="#fff" fontSize={10} formatter={(icmp: number) => icmp > 0 ? `${icmp}%` : ''} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Average Flow Duration by Attack Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={flowDurationData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 11 }} 
              />
              <YAxis 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 11 }}
                label={{ 
                  value: 'Duration (s)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  fill: '#8A8A9A',
                  fontSize: 12
                }}
              />
              <Bar 
                dataKey="avgDuration" 
                fill="#1a5276" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              >
                {flowDurationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ATTACK_COLORS[entry.category] || '#1a5276'} 
                  />
                ))}
                <LabelList dataKey="avgDuration" position="center" fill="#fff" fontSize={10} formatter={(avgDuration: number) => avgDuration > 0 ? `${avgDuration.toFixed(2)}` : ''} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            TCP Flag Averages by Attack Type
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={tcpFlagsByAttackData}
              stackOffset="expand" 
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
              <XAxis 
                dataKey="flag" 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
              />
              <YAxis 
                stroke="#4A4A5A" 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
              />
              <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                wrapperStyle={{ paddingLeft: '20px' }}
              />

              {Object.keys(ATTACK_COLORS).map((groupName) => (
                <Bar 
                  key={groupName}
                  dataKey={groupName} 
                  stackId="tcp_stack" 
                  fill={ATTACK_COLORS[groupName]} 
                  name={groupName}
                >
                  <LabelList 
                    dataKey={groupName}
                    position="center" 
                    fill="#ffffff" 
                    fontSize={10} 
                    fontWeight="bold"
                    formatter={(v: number) => v > 0.05 ? `${(v * 100).toFixed(1)}%` : ''} 
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="rounded p-6" style={{ backgroundColor: "var(--card)", border: "0.5px solid var(--border)" }}>
          <h2 
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Service Distribution by Attack Type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={serviceDistributionData}
              stackOffset="expand"
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="#4A4A5A" 
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
              />
              <YAxis 
                stroke="#4A4A5A" 
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                tick={{ fill: '#8A8A9A', fontSize: 12 }} 
              />
              <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                wrapperStyle={{ paddingLeft: '20px' }}
              />

              {Object.keys(SERVICE_COLORS).map((service) => (
                <Bar 
                  key={service}
                  dataKey={service} 
                  stackId="service_stack" 
                  fill={SERVICE_COLORS[service]} 
                  name={service}
                >
                  <LabelList 
                    dataKey={service}
                    position="center" 
                    fill="#ffffff" 
                    fontSize={10} 
                    fontWeight="bold"
                    formatter={(v: number) => v > 0.05 ? `${(v * 100).toFixed(1)}%` : ''} 
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}