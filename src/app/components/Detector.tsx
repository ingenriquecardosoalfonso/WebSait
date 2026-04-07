import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity, Upload, FileSpreadsheet } from 'lucide-react';

const PROTOCOLS = ['tcp', 'udp', 'icmp'];
const ML_MODELS = ['Random Forest', 'Neural Network', 'XGBoost', 'SVM', 'Decision Tree'];

const createInitialFormData = () => ({
  proto: 'tcp',
  service: 'Unidentified',
  flow_duration: '0',
  fwd_pkts_tot: '0',
  bwd_pkts_tot: '0',
  flow_pkts_per_sec: '0',
  down_up_ratio: '0',
  flow_FIN_flag_count: '0',
  flow_SYN_flag_count: '0',
  flow_RST_flag_count: '0',
  flow_ACK_flag_count: '0',
  'fwd_pkts_payload.avg': '0',
  'bwd_pkts_payload.avg': '0',
  'fwd_pkts_payload.tot': '0',
  'fwd_pkts_payload.min': '0',
  'flow_pkts_payload.avg': '0',
  'flow_pkts_payload.std': '0',
  'fwd_iat.avg': '0',
  'bwd_iat.avg': '0',
  'flow_iat.avg': '0',
  fwd_init_window_size: '0',
  bwd_init_window_size: '0',
  fwd_last_window_size: '0',
  payload_bytes_per_second: '0',
  fwd_subflow_bytes: '0',
  fwd_header_size_tot: '0',
  'active.avg': '0',
  'active.tot': '0',
  'active.min': '0',
  'id.resp_p': '0',
  bwd_pkts_per_sec: '0',
});

type FormDataType = ReturnType<typeof createInitialFormData>;

export default function Detector() {
  const [formData, setFormData] = useState<FormDataType>(createInitialFormData());
  const [selectedModel, setSelectedModel] = useState('Random Forest');
  const [excelData, setExcelData] = useState('');
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [prediction, setPrediction] = useState<{
    type: string;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    topFeatures: { name: string; impact: string }[];
  } | null>(null);

  const parseCSVLine = (line: string) => {
    const values: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccessMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setExcelData(text);
        setShowExcelImport(true);
        setSuccessMessage('');
      };
      reader.readAsText(file);
    }
  };

  const handleImportData = () => {
    try {
      const lines = excelData
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length > 1) {
        const headers = parseCSVLine(lines[0]);
        const values = parseCSVLine(lines[1]);

        const getValue = (column: keyof FormDataType) => {
          const index = headers.indexOf(column);
          if (index !== -1 && values[index] !== undefined && values[index] !== '') {
            return values[index];
          }
          return formData[column];
        };

        setFormData({
          proto: getValue('proto'),
          service: getValue('service'),
          flow_duration: getValue('flow_duration'),
          fwd_pkts_tot: getValue('fwd_pkts_tot'),
          bwd_pkts_tot: getValue('bwd_pkts_tot'),
          flow_pkts_per_sec: getValue('flow_pkts_per_sec'),
          down_up_ratio: getValue('down_up_ratio'),
          flow_FIN_flag_count: getValue('flow_FIN_flag_count'),
          flow_SYN_flag_count: getValue('flow_SYN_flag_count'),
          flow_RST_flag_count: getValue('flow_RST_flag_count'),
          flow_ACK_flag_count: getValue('flow_ACK_flag_count'),
          'fwd_pkts_payload.avg': getValue('fwd_pkts_payload.avg'),
          'bwd_pkts_payload.avg': getValue('bwd_pkts_payload.avg'),
          'fwd_pkts_payload.tot': getValue('fwd_pkts_payload.tot'),
          'fwd_pkts_payload.min': getValue('fwd_pkts_payload.min'),
          'flow_pkts_payload.avg': getValue('flow_pkts_payload.avg'),
          'flow_pkts_payload.std': getValue('flow_pkts_payload.std'),
          'fwd_iat.avg': getValue('fwd_iat.avg'),
          'bwd_iat.avg': getValue('bwd_iat.avg'),
          'flow_iat.avg': getValue('flow_iat.avg'),
          fwd_init_window_size: getValue('fwd_init_window_size'),
          bwd_init_window_size: getValue('bwd_init_window_size'),
          fwd_last_window_size: getValue('fwd_last_window_size'),
          payload_bytes_per_second: getValue('payload_bytes_per_second'),
          fwd_subflow_bytes: getValue('fwd_subflow_bytes'),
          fwd_header_size_tot: getValue('fwd_header_size_tot'),
          'active.avg': getValue('active.avg'),
          'active.tot': getValue('active.tot'),
          'active.min': getValue('active.min'),
          'id.resp_p': getValue('id.resp_p'),
          bwd_pkts_per_sec: getValue('bwd_pkts_per_sec'),
        });

        setShowExcelImport(false);
        setExcelData('');
        setSuccessMessage('File imported and data filled successfully.');
      }
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  };

  const detectAttack = () => {
    const pktsPerSec = parseFloat(formData.flow_pkts_per_sec);
    const synCount = parseFloat(formData.flow_SYN_flag_count);
    const rstCount = parseFloat(formData.flow_RST_flag_count);
    const payloadBytes = parseFloat(formData.payload_bytes_per_second);

    let predictedType = 'Normal';
    let confidence = 0.92;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

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

  const riskStyles = {
    low: {
      bg: 'rgba(76,175,110,0.08)',
      border: '#4CAF6E',
      text: '#4CAF6E',
      icon: <CheckCircle className="w-16 h-16" style={{ color: '#4CAF6E' }} />,
    },
    medium: {
      bg: 'rgba(232,200,64,0.08)',
      border: '#E8C840',
      text: '#E8C840',
      icon: <AlertTriangle className="w-16 h-16" style={{ color: '#E8C840' }} />,
    },
    high: {
      bg: 'rgba(232,56,58,0.08)',
      border: '#E8383A',
      text: '#E8383A',
      icon: <Shield className="w-16 h-16" style={{ color: '#E8383A' }} />,
    },
  };

  const currentRiskStyle = prediction ? riskStyles[prediction.riskLevel] : null;

  const inputStyle = {
    backgroundColor: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-wide text-foreground">
          AI Detector
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter network flow characteristics to detect potential attacks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded p-6"
          style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
        >
          <h2
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Flow Characteristics
          </h2>

          <div className="mb-6 pb-4" style={{ borderBottom: '0.5px solid var(--border)' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Import from CSV
            </label>

            <div className="flex gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />

              <label
                htmlFor="excel-upload"
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded font-medium cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '0.5px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Choose File
              </label>

              {showExcelImport && (
                <button
                  onClick={handleImportData}
                  className="flex items-center gap-2 py-2 px-4 rounded font-medium transition-colors"
                  style={{
                    backgroundColor: '#4CAF6E',
                    color: '#ffffff',
                    border: '0.5px solid #4CAF6E',
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Import
                </button>
              )}
            </div>

            {showExcelImport && (
              <p className="text-xs mt-2" style={{ color: '#4CAF6E' }}>
                ✓ File loaded. Click "Import" to paste values.
              </p>
            )}

            {successMessage && (
              <p className="text-xs mt-2" style={{ color: '#4CAF6E' }}>
                ✓ {successMessage}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Protocol
              </label>
              <select
                name="proto"
                value={formData.proto}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg"
                style={inputStyle}
              >
                {PROTOCOLS.map((proto) => (
                  <option key={proto} value={proto}>
                    {proto.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Service
              </label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg"
                style={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Duration (sec)
                </label>
                <input
                  type="number"
                  step="any"
                  name="flow_duration"
                  value={formData.flow_duration}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Packets/sec
                </label>
                <input
                  type="number"
                  step="any"
                  name="flow_pkts_per_sec"
                  value={formData.flow_pkts_per_sec}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Forward Packets
                </label>
                <input
                  type="number"
                  step="any"
                  name="fwd_pkts_tot"
                  value={formData.fwd_pkts_tot}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Backward Packets
                </label>
                <input
                  type="number"
                  step="any"
                  name="bwd_pkts_tot"
                  value={formData.bwd_pkts_tot}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Payload Bytes/sec
              </label>
              <input
                type="number"
                step="any"
                name="payload_bytes_per_second"
                value={formData.payload_bytes_per_second}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg"
                style={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Down/Up Ratio
                </label>
                <input
                  type="number"
                  step="any"
                  name="down_up_ratio"
                  value={formData.down_up_ratio}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Backward Packets/sec
                </label>
                <input
                  type="number"
                  step="any"
                  name="bwd_pkts_per_sec"
                  value={formData.bwd_pkts_per_sec}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                TCP Flags
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    SYN Count
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_SYN_flag_count"
                    value={formData.flow_SYN_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    ACK Count
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_ACK_flag_count"
                    value={formData.flow_ACK_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    RST Count
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_RST_flag_count"
                    value={formData.flow_RST_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    FIN Count
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_FIN_flag_count"
                    value={formData.flow_FIN_flag_count}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Payload Metrics
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Payload Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_pkts_payload.avg"
                    value={formData['fwd_pkts_payload.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Bwd Payload Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="bwd_pkts_payload.avg"
                    value={formData['bwd_pkts_payload.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Payload Total
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_pkts_payload.tot"
                    value={formData['fwd_pkts_payload.tot']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Payload Min
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_pkts_payload.min"
                    value={formData['fwd_pkts_payload.min']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Flow Payload Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_pkts_payload.avg"
                    value={formData['flow_pkts_payload.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Flow Payload Std
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_pkts_payload.std"
                    value={formData['flow_pkts_payload.std']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Timing Metrics
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd IAT Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_iat.avg"
                    value={formData['fwd_iat.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Bwd IAT Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="bwd_iat.avg"
                    value={formData['bwd_iat.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Flow IAT Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_iat.avg"
                    value={formData['flow_iat.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Window Metrics
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Init Window Size
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_init_window_size"
                    value={formData.fwd_init_window_size}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Bwd Init Window Size
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="bwd_init_window_size"
                    value={formData.bwd_init_window_size}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Last Window Size
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_last_window_size"
                    value={formData.fwd_last_window_size}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Flow Activity
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Active Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="active.avg"
                    value={formData['active.avg']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Active Total
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="active.tot"
                    value={formData['active.tot']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Active Min
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="active.min"
                    value={formData['active.min']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Other Network Features
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Subflow Bytes
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_subflow_bytes"
                    value={formData.fwd_subflow_bytes}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Header Size Total
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_header_size_tot"
                    value={formData.fwd_header_size_tot}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Response Port
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="id.resp_p"
                    value={formData['id.resp_p']}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-1 p-2 rounded-lg"
                style={inputStyle}
              >
                {ML_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>

              <button
                onClick={detectAttack}
                className="flex-1 py-2 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: '#00B8CC',
                  color: '#ffffff',
                  border: '0.5px solid #00B8CC',
                }}
              >
                Analyze
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded p-6"
          style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
        >
          <h2
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Analysis Result
          </h2>

          {prediction ? (
            <div className="space-y-6">
              <div className="text-center py-8" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <div className="flex justify-center mb-4">{currentRiskStyle?.icon}</div>

                <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {prediction.type}
                </h3>

                <span
                  className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: currentRiskStyle?.bg,
                    color: currentRiskStyle?.text,
                    border: `0.5px solid ${currentRiskStyle?.border}`,
                  }}
                >
                  Risk Level: {prediction.riskLevel.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Model Confidence
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${prediction.confidence * 100}%`,
                      backgroundColor: '#00B8CC',
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                  Determining Features
                </h3>

                <div className="space-y-2">
                  {prediction.topFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '0.5px solid var(--border)',
                      }}
                    >
                      <span className="text-sm font-mono" style={{ color: 'var(--foreground)' }}>
                        {feature.name}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: feature.impact === 'High' ? '#E8383A' : '#4CAF6E' }}
                      >
                        {feature.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {prediction.type !== 'Normal' && (
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: 'rgba(232,56,58,0.08)',
                    border: '0.5px solid #E8383A',
                  }}
                >
                  <h3 className="font-semibold mb-2" style={{ color: '#E8383A' }}>
                    Recommendations
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: '#c42e30' }}>
                    <li>Block source IP immediately</li>
                    <li>Enable rate limiting on firewall</li>
                    <li>Review security logs</li>
                    <li>Notify security team</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16" style={{ color: 'var(--vt-text-muted)' }}>
              <Activity className="w-24 h-24 mx-auto mb-4 opacity-20" />
              <p>Enter flow characteristics and click "Analyze"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}