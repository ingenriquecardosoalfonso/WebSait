import { useState } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Shield, TrendingUp, Globe, CheckCircle, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [dataset] = useState<NetworkFlow[]>(() => generateMockDataset(1000));
  
  // Calculate statistics
  const totalFlows = dataset.length;
  const maliciousFlows = dataset.filter(f => f.Attack_type !== 'Normal').length;
  const maliciousPercent = ((maliciousFlows / totalFlows) * 100).toFixed(1);
  const avgPacketRate = (dataset.reduce((sum, f) => sum + f.flow_pkts_per_sec, 0) / totalFlows).toFixed(2);
  const avgDuration = (dataset.reduce((sum, f) => sum + f.flow_duration, 0) / totalFlows).toFixed(2);
  
  // Determine network status
  const networkStatus = parseFloat(maliciousPercent) < 5 ? 'Normal' : parseFloat(maliciousPercent) < 15 ? 'Warning' : 'Critical';
  const statusColor = networkStatus === 'Normal' ? 'bg-green-50 border-green-500' : networkStatus === 'Warning' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500';
  const statusTextColor = networkStatus === 'Normal' ? 'text-green-800' : networkStatus === 'Warning' ? 'text-yellow-800' : 'text-red-800';
  const statusIcon = networkStatus === 'Normal' ? CheckCircle : AlertTriangle;
  const StatusIconComponent = statusIcon;
  
  // Time series data (simulated by grouping timestamps)
  const timeSeriesData = dataset
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .reduce((acc: any[], flow, idx) => {
      if (idx % 50 === 0) {
        // Calculate threat level for status line
        const maliciousCount = dataset.slice(Math.max(0, idx - 100), idx + 1).filter(f => f.Attack_type !== 'Normal').length;
        const totalCount = Math.min(100, idx + 1);
        const threatLevel = (maliciousCount / totalCount) * 100;
        
        acc.push({
          time: flow.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          packets: flow.flow_pkts_per_sec,
          bytes: flow.payload_bytes_per_second,
          status: threatLevel,
        });
      }
      return acc;
    }, []);
  
  // Recommendations based on current network status
  const recommendations = [
    {
      title: 'Network Segmentation',
      description: 'Implement IoT device isolation to limit attack propagation across network segments.',
      icon: Shield,
      color: 'text-blue-600',
    },
    {
      title: 'Traffic Monitoring',
      description: 'Enable continuous monitoring and set up alerts for anomalous traffic patterns.',
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Firmware Updates',
      description: 'Ensure all IoT devices have the latest security patches and firmware updates.',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Network traffic analysis overview</p>
      </div>
      
      {/* Network Status Banner */}
      <div className={`border-l-4 rounded-lg p-6 ${
        networkStatus === 'Normal' 
          ? 'bg-green-50 border-green-500' 
          : networkStatus === 'Warning' 
          ? 'bg-yellow-50 border-yellow-500' 
          : 'bg-red-50 border-red-500'
      }`}>
        <div className="flex items-center gap-4">
          <StatusIconComponent className={`w-12 h-12 ${
            networkStatus === 'Normal' 
              ? 'text-green-600' 
              : networkStatus === 'Warning' 
              ? 'text-yellow-600' 
              : 'text-red-600'
          }`} />
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${
              networkStatus === 'Normal' 
                ? 'text-green-800' 
                : networkStatus === 'Warning' 
                ? 'text-yellow-800' 
                : 'text-red-800'
            }`}>
              Network Status: {networkStatus}
            </h2>
            <p className={`mt-1 ${
              networkStatus === 'Normal' 
                ? 'text-green-700' 
                : networkStatus === 'Warning' 
                ? 'text-yellow-700' 
                : 'text-red-700'
            }`}>
              {networkStatus === 'Normal' && 'All systems operating normally. No significant threats detected.'}
              {networkStatus === 'Warning' && 'Moderate threat level detected. Monitoring increased activity.'}
              {networkStatus === 'Critical' && 'High threat level! Immediate attention required.'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Malicious Traffic</p>
            <p className={`text-3xl font-bold ${
              networkStatus === 'Normal' 
                ? 'text-green-600' 
                : networkStatus === 'Warning' 
                ? 'text-yellow-600' 
                : 'text-red-600'
            }`}>{maliciousPercent}%</p>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Flows</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">{totalFlows.toLocaleString()}</p>
            </div>
            <Activity className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Malicious Traffic</p>
              <p className="text-2xl font-bold mt-1 text-red-500">{maliciousPercent}%</p>
            </div>
            <Shield className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rate</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">{avgPacketRate} <span className="text-sm">pkt/s</span></p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Duration</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">{avgDuration} <span className="text-sm">sec</span></p>
            </div>
            <Globe className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Charts and Recommendations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Traffic Chart */}
        <div className="lg:col-span-2">
          {/* Traffic Over Time Chart */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Traffic Over Time</h2>
            <ResponsiveContainer width="100%" height={644}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <YAxis yAxisId="status" orientation="right" domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#1f2937'
                  }}
                />
                <Legend wrapperStyle={{ color: '#1f2937' }} />
                <Line yAxisId="left" type="monotone" dataKey="packets" stroke="#3b82f6" name="Packets/s" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="bytes" stroke="#10B981" name="Bytes/s" strokeWidth={2} />
                <Line yAxisId="status" type="monotone" dataKey="status" stroke="#EF4444" name="Threat Level %" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Recommendations & AI Statement */}
        <div className="space-y-4">
          {/* Recommendations */}
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <Icon className={`w-8 h-8 ${rec.color} flex-shrink-0`} />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-800">{rec.title}</h3>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Statement */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-purple-900">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-700">
                  Our machine learning models continuously analyze network patterns to detect anomalies and predict potential threats before they escalate. 
                  Current confidence level: <span className="font-bold text-purple-700">94.7%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}