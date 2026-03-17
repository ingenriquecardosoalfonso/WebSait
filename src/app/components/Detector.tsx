import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity, Upload, FileSpreadsheet } from 'lucide-react';

const PROTOCOLS = ['tcp', 'udp', 'icmp'];
const ATTACK_TYPES = ['Normal', 'DDoS', 'DoS', 'Reconnaissance', 'Theft', 'Mirai'];
const ML_MODELS = ['Random Forest', 'Neural Network', 'XGBoost', 'SVM', 'Decision Tree'];

export default function Detector() {
  const [formData, setFormData] = useState({
    proto: 'tcp',
    flow_duration: '10',
    fwd_pkts_tot: '50',
    bwd_pkts_tot: '40',
    flow_pkts_per_sec: '9',
    payload_bytes_per_second: '2500',
    flow_SYN_flag_count: '2',
    flow_ACK_flag_count: '45',
    flow_RST_flag_count: '0',
    flow_FIN_flag_count: '1',
  });
  
  const [selectedModel, setSelectedModel] = useState('Random Forest');
  const [excelData, setExcelData] = useState('');
  const [showExcelImport, setShowExcelImport] = useState(false);
  
  const [prediction, setPrediction] = useState<{
    type: string;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    topFeatures: { name: string; impact: string }[];
  } | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setExcelData(text);
        setShowExcelImport(true);
      };
      reader.readAsText(file);
    }
  };
  
  const handleImportData = () => {
    // Parse the Excel data (assuming CSV format)
    try {
      const lines = excelData.trim().split('\n');
      if (lines.length > 1) {
        const values = lines[1].split(',');
        setFormData({
          proto: values[0] || formData.proto,
          flow_duration: values[1] || formData.flow_duration,
          fwd_pkts_tot: values[2] || formData.fwd_pkts_tot,
          bwd_pkts_tot: values[3] || formData.bwd_pkts_tot,
          flow_pkts_per_sec: values[4] || formData.flow_pkts_per_sec,
          payload_bytes_per_second: values[5] || formData.payload_bytes_per_second,
          flow_SYN_flag_count: values[6] || formData.flow_SYN_flag_count,
          flow_ACK_flag_count: values[7] || formData.flow_ACK_flag_count,
          flow_RST_flag_count: values[8] || formData.flow_RST_flag_count,
          flow_FIN_flag_count: values[9] || formData.flow_FIN_flag_count,
        });
        setShowExcelImport(false);
        setExcelData('');
      }
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  };
  
  const detectAttack = () => {
    // Simulate ML prediction based on input values
    const pktsPerSec = parseFloat(formData.flow_pkts_per_sec);
    const synCount = parseFloat(formData.flow_SYN_flag_count);
    const rstCount = parseFloat(formData.flow_RST_flag_count);
    const payloadBytes = parseFloat(formData.payload_bytes_per_second);
    
    let predictedType = 'Normal';
    let confidence = 0.92;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    // Simple heuristic detection
    if (pktsPerSec > 500 || synCount > 20 || payloadBytes > 20000) {
      predictedType = pktsPerSec > 1000 ? 'DDoS' : 'DoS';
      confidence = 0.89;
      riskLevel = 'high';
    } else if (synCount > 10 && rstCount > 5) {
      predictedType = 'Reconnaissance';
      confidence = 0.85;
      riskLevel = 'medium';
    } else if (parseFloat(formData.flow_duration) > 100 && pktsPerSec > 100) {
      predictedType = 'Mirai';
      confidence = 0.87;
      riskLevel = 'high';
    }
    
    const topFeatures = [
      { name: 'flow_pkts_per_sec', impact: pktsPerSec > 100 ? 'High' : 'Normal' },
      { name: 'flow_SYN_flag_count', impact: synCount > 5 ? 'High' : 'Normal' },
      { name: 'payload_bytes_per_second', impact: payloadBytes > 10000 ? 'High' : 'Normal' },
    ];
    
    setPrediction({
      type: predictedType,
      confidence,
      riskLevel,
      topFeatures,
    });
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100 border border-green-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border border-yellow-300';
      case 'high': return 'text-red-700 bg-red-100 border border-red-300';
      default: return 'text-gray-700 bg-gray-100 border border-gray-300';
    }
  };
  
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'high': return <Shield className="w-16 h-16 text-red-500" />;
      default: return <Activity className="w-16 h-16 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">AI Attack Detection Engine</h1>
        <p className="text-gray-600 mt-2">Enter network flow characteristics to detect potential attacks</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flow Characteristics</h2>
          
          {/* Excel Upload Section */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <label className="block text-sm font-medium mb-2 text-gray-700">Import from Excel</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label
                htmlFor="excel-upload"
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Choose File
              </label>
              {showExcelImport && (
                <button
                  onClick={handleImportData}
                  className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </button>
              )}
            </div>
            {showExcelImport && (
              <p className="text-xs text-green-600 mt-2">✓ File loaded. Click "Import" to paste values.</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Protocol</label>
              <select
                name="proto"
                value={formData.proto}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                {PROTOCOLS.map(proto => (
                  <option key={proto} value={proto}>{proto.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Duration (sec)</label>
                <input
                  type="number"
                  name="flow_duration"
                  value={formData.flow_duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Packets/sec</label>
                <input
                  type="number"
                  name="flow_pkts_per_sec"
                  value={formData.flow_pkts_per_sec}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Forward Packets</label>
                <input
                  type="number"
                  name="fwd_pkts_tot"
                  value={formData.fwd_pkts_tot}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Backward Packets</label>
                <input
                  type="number"
                  name="bwd_pkts_tot"
                  value={formData.bwd_pkts_tot}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Payload Bytes/sec</label>
              <input
                type="number"
                name="payload_bytes_per_second"
                value={formData.payload_bytes_per_second}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              />
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium mb-3 text-gray-700">TCP Flags</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">SYN Count</label>
                  <input
                    type="number"
                    name="flow_SYN_flag_count"
                    value={formData.flow_SYN_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">ACK Count</label>
                  <input
                    type="number"
                    name="flow_ACK_flag_count"
                    value={formData.flow_ACK_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">RST Count</label>
                  <input
                    type="number"
                    name="flow_RST_flag_count"
                    value={formData.flow_RST_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">FIN Count</label>
                  <input
                    type="number"
                    name="flow_FIN_flag_count"
                    value={formData.flow_FIN_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                  />
                </div>
              </div>
            </div>
            
            {/* Model Selection and Analyze Button */}
            <div className="flex gap-2 border-t border-gray-200 pt-4">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                {ML_MODELS.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <button
                onClick={detectAttack}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
              >
                🔍 Analyze
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Result</h2>
          
          {prediction ? (
            <div className="space-y-6">
              {/* Risk Level Indicator */}
              <div className="text-center py-8 border-b border-gray-200">
                <div className="flex justify-center mb-4">
                  {getRiskIcon(prediction.riskLevel)}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{prediction.type}</h3>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getRiskColor(prediction.riskLevel)}`}>
                  Risk Level: {prediction.riskLevel.toUpperCase()}</span>
              </div>
              
              {/* Confidence */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Model Confidence</span>
                  <span className="font-bold text-gray-800">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Top Features */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Determining Features</h3>
                <div className="space-y-2">
                  {prediction.topFeatures.map((feature, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-sm font-mono text-gray-700">{feature.name}</span>
                      <span className={`text-sm font-semibold ${
                        feature.impact === 'High' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {feature.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recommendations */}
              {prediction.type !== 'Normal' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">⚠️ Recommendations</h3>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Block source IP immediately</li>
                    <li>Enable rate limiting on firewall</li>
                    <li>Review security logs</li>
                    <li>Notify security team</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Activity className="w-24 h-24 mx-auto mb-4 opacity-20" />
              <p>Enter flow characteristics and click "Analyze"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}