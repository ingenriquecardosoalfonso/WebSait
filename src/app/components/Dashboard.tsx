import { useEffect, useState } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
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

  const totalRecords = dataset.length;

  const counts = dataset.reduce((acc: { [key: string]: number }, flow) => {
    const type = flow.Attack_grouped;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, count]) => {
    const colorMap: { [key: string]: string } = {
      'Normal': '#00B8CC',
      'DOS_SYN_Hping': '#E67E22',
      'ARP_poisioning': '#1A5276',
      'NMAP': '#1D8348'
    };

    return {
      name: name,
      value: parseFloat(((count as number / totalRecords) * 100).toFixed(2)),
      color: colorMap[name] || '#8884d8'
    };
  }).sort((a, b) => b.value - a.value);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

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
            Traffic Class Distribution
          </h2>
          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false} 
                label={renderCustomizedLabel} 
                innerRadius={0} 
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                stroke="var(--card)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle"
                wrapperStyle={{ color: '#8A8A9A', fontSize: 12, paddingLeft: '20px' }} 
              />
            </PieChart>
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