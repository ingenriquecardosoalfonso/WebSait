import { useEffect, useState } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Shield, TrendingUp, Globe, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [dataset, setDataset] = useState<NetworkFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { generateMockDataset().then((data) => {setDataset(data); setLoading(false); });}, []);

  const totalFlows = dataset.length;
  const maliciousFlows =  dataset.filter(f => f.Attack_grouped != 'Normal').length;
  const maliciousPercent = ((maliciousFlows / totalFlows) * 100).toFixed(1);
  const suma = dataset.reduce((sum, f) => sum + (Number(f.flow_pkts_per_sec) || 0), 0);
  const avgPacketRate = (dataset.reduce((sum, f) => sum + f.flow_pkts_per_sec, 0) / totalFlows).toFixed(2);
  const avgDuration = (dataset.reduce((sum, f) => sum + f.flow_duration, 0) / totalFlows).toFixed(2);
  const networkStatus = parseFloat(maliciousPercent) < 5 ? 'Normal' : parseFloat(maliciousPercent) < 15 ? 'Warning' : 'Critical';
  const StatusIconComponent = networkStatus === 'Normal' ? CheckCircle : AlertTriangle;

  // Status colors — Velocity TDIR severity system
  const statusStyles = {
    Normal:   { bg: 'rgba(76,175,110,0.08)',  border: '#4CAF6E', text: '#4CAF6E',  sub: '#3a9960' },
    Warning:  { bg: 'rgba(232,200,64,0.08)',  border: '#E8C840', text: '#E8C840',  sub: '#c9ae35' },
    Critical: { bg: 'rgba(232,56,58,0.08)',   border: '#E8383A', text: '#E8383A',  sub: '#c42e30' },
  };
  const s = statusStyles[networkStatus];

  const timeSeriesData = dataset
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .reduce((acc: any[], flow, idx) => {
      if (idx % 50 === 0) {
        const maliciousCount = dataset.slice(Math.max(0, idx - 100), idx + 1).filter(f => f.Attack_grouped !== 'Normal').length;
        const totalCount = Math.min(100, idx + 1);
        acc.push({
          time: flow.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          packets: flow.flow_pkts_per_sec,
          bytes: flow.payload_bytes_per_second,
          status: (maliciousCount / totalCount) * 100,
        });
      }
      return acc;
    }, []);

  const recommendations = [
    {
      title: 'Network Segmentation',
      description: 'Implement IoT device isolation to limit attack propagation across network segments.',
      icon: Shield,
      color: '#00B8CC',
    },
    {
      title: 'Traffic Monitoring',
      description: 'Enable continuous monitoring and set up alerts for anomalous traffic patterns.',
      icon: Activity,
      color: '#4CAF6E',
    },
    {
      title: 'Firmware Updates',
      description: 'Ensure all IoT devices have the latest security patches and firmware updates.',
      icon: TrendingUp,
      color: '#C9B86C',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold tracking-wide text-foreground"
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Network traffic analysis overview
        </p>
      </div>

      {/* Network Status Banner */}
      <div
        className="rounded p-5 border-l-4 flex items-center gap-4"
        style={{ backgroundColor: s.bg, borderLeftColor: s.border }}
      >
        <StatusIconComponent className="w-10 h-10 flex-shrink-0" style={{ color: s.text }} />
        <div className="flex-1">
          <h2 className="text-xl font-semibold" style={{ color: s.text }}>
            Network Status: {networkStatus}
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: s.sub }}>
            {networkStatus === 'Normal'   && 'All systems operating normally. No significant threats detected.'}
            {networkStatus === 'Warning'  && 'Moderate threat level detected. Monitoring increased activity.'}
            {networkStatus === 'Critical' && 'High threat level! Immediate attention required.'}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs" style={{ color: '#8A8A9A' }}>Malicious Traffic</p>
          <p className="text-3xl font-semibold" style={{ color: s.text }}>{maliciousPercent}%</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Total Flows"
          value={totalFlows.toLocaleString()}
          icon={<Activity className="w-8 h-8" style={{ color: '#00B8CC' }} />}
        />
        <MetricCard
          label="Malicious Traffic"
          value={`${maliciousPercent}%`}
          valueColor="#E8383A"
          icon={<Shield className="w-8 h-8" style={{ color: '#E8383A' }} />}
        />
        <MetricCard
          label="Average Rate"
          value={avgPacketRate}
          unit="pkt/s"
          icon={<TrendingUp className="w-8 h-8" style={{ color: '#4CAF6E' }} />}
        />
        <MetricCard
          label="Average Duration"
          value={avgDuration}
          unit="sec"
          icon={<Globe className="w-8 h-8" style={{ color: '#C9B86C' }} />}
        />
      </div>

      {/* Charts + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Traffic Chart */}
        <div
          className="lg:col-span-2 rounded p-5"
          style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
        >
          <h2
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Traffic Over Time
          </h2>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="time" stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 11 }} />
              <YAxis yAxisId="left"   stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 11 }} />
              <YAxis yAxisId="right"  stroke="#4A4A5A" tick={{ fill: '#8A8A9A', fontSize: 11 }} orientation="right" />
              <YAxis yAxisId="status" orientation="right" domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '4px',
                  color: '#C8CDD8',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ color: '#8A8A9A', fontSize: 12 }} />
              <Line yAxisId="left"   type="monotone" dataKey="packets" stroke="#00B8CC" name="Packets/s"      strokeWidth={1.5} dot={false} />
              <Line yAxisId="right"  type="monotone" dataKey="bytes"   stroke="#4CAF6E" name="Bytes/s"        strokeWidth={1.5} dot={false} />
              <Line yAxisId="status" type="monotone" dataKey="status"  stroke="#E8383A" name="Threat Level %" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div
                key={idx}
                className="rounded p-4 border-l-2"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '0.5px solid var(--border)',
                  borderLeft: `2px solid ${rec.color}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: rec.color }} />
                  <div>
                    <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      {rec.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--vt-text-muted)' }}>
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Statement */}
          <div
            className="rounded p-4 border-l-2"
            style={{
              backgroundColor: 'var(--card)',
              border: '0.5px solid var(--border)',
              borderLeft: '2px solid var(--vt-gold)',
            }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: 'var(--vt-gold)' }} />
              <div>
                <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--vt-gold)' }}>
                  AI-Powered Analysis
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--vt-text-muted)' }}>
                  Machine learning models continuously analyze network patterns to detect anomalies.
                  Current confidence:{' '}
                  <span className="font-semibold" style={{ color: 'var(--vt-gold)' }}>94.7%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper component ──
function MetricCard({
  label, value, unit, valueColor, icon
}: {
  label: string;
  value: string;
  unit?: string;
  valueColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded p-5 flex items-center justify-between"
      style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
    >
      <div>
        <p className="text-xs" style={{ color: 'var(--vt-text-muted)' }}>{label}</p>
        <p className="text-2xl font-semibold mt-1" style={{ color: valueColor ?? 'var(--foreground)' }}>
          {value}
          {unit && <span className="text-sm font-normal ml-1" style={{ color: 'var(--vt-text-muted)' }}>{unit}</span>}
        </p>
      </div>
      {icon}
    </div>
  );
}