import { Activity, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { useDetector, riskStyles } from '../hooks/useDetector';

export default function Detector() {
  const {
  formData, selectedModel, showExcelImport,
  successMessage, isDataOpen, fieldErrors,
  prediction, loading, error,
  PROTOCOLS, ML_MODELS,
  handleInputChange, handleFileUpload,
  handleImportData, detectAttack,
  setSelectedModel, setIsDataOpen,
} = useDetector();

const currentRiskStyle = prediction ? riskStyles[prediction.riskLevel] : null;
const RiskIcon = currentRiskStyle?.icon;

  const inputStyle = {
    backgroundColor: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  };

const formatPrediction = (type: string) => {
  const labels: Record<string, string> = {
    'DOS_SYN_Hping':  'DOS SYN Hping',
    'ARP_poisioning': 'ARP Poisoning',
    'NMAP':           'NMAP Scan',
    'Normal':         'Normal Traffic',
  };
  return labels[type] ?? type;
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
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#8A8A9A' }}
          >
            Flow Characteristics
          </h2>

            <a
              href="/Instruction File.xlsx"
              download="Instruction File.xlsx"
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--vt-gold)',
                border: '0.5px solid var(--border)',
                color: 'var(--sidebar)',
                textDecoration: 'none',
              }}
            >
              <Download className="w-4 h-4" />
              Download Instructions
            </a>
          </div>

          <div className="mb-6 pb-4" style={{ borderBottom: '0.5px solid var(--border)' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Import CSV
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
            <div
  className="rounded-lg p-3"
  style={{
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '0.5px solid var(--border)',
  }}
>
  <button
    type="button"
    onClick={() => setIsDataOpen(!isDataOpen)}
    className="w-full flex items-center justify-between text-left"
    style={{ color: 'var(--foreground)' }}
  >
    <span className="text-sm font-medium">Data</span>
    <span className="text-xs" style={{ color: 'var(--vt-text-muted)' }}>
      {isDataOpen ? '▲ Hide' : '▼ Show'}
    </span>
  </button>
</div>
{isDataOpen && (
  <>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Protocol
              </label>
              <select
                name="proto"
                value={formData.proto}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg"
                style={{
                    ...inputStyle,
                    border: fieldErrors['proto'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    >
                    {fieldErrors['proto'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['proto']}
                    </p>
                    )}
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
               <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg"
                style={{
                 ...inputStyle,
                 border: fieldErrors.service ? '1px solid red' : '0.5px solid var(--border)',
                 }}
                 >
                 <option value="Unidentified">Unidentified</option>
                 <option value="mqtt">mqtt</option>
                 <option value="http">http</option>
                 <option value="dns">dns</option>
                 <option value="ntp">ntp</option>
                 <option value="ssl">ssl</option>
                 <option value="dhcp">dhcp</option>
                 <option value="irc">irc</option>
                 <option value="radius">radius</option>
                 </select>
                 {fieldErrors.service && (
                 <p className="text-xs mt-1" style={{ color: 'red' }}>
                {fieldErrors.service}
                </p>
             )}
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
                  required
                  min="0"
                  className="w-full p-2 rounded-lg"
                  style={{
                    ...inputStyle,
                    border: fieldErrors['flow_duration'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_duration'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_duration']}
                    </p>
                    )}
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
                  required
                  min="0"
                  className="w-full p-2 rounded-lg"
                  style={{
                    ...inputStyle,
                    border: fieldErrors['flow_pkts_per_sec'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_pkts_per_sec'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_pkts_per_sec']}
                    </p>
                    )}
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
                  required
                  min="0"
                  className="w-full p-2 rounded-lg"
                  style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_pkts_tot'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_pkts_tot'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_pkts_tot']}
                    </p>
                    )}
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
                  required
                  min="0"
                  className="w-full p-2 rounded-lg"
                  style={{
                    ...inputStyle,
                    border: fieldErrors['bwd_pkts_tot'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['bwd_pkts_tot'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['bwd_pkts_tot']}
                    </p>
                    )}
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
                required
                min="0"
                className="w-full p-2 rounded-lg"
                style={{
                    ...inputStyle,
                    border: fieldErrors['payload_bytes_per_second'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['payload_bytes_per_second'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['payload_bytes_per_second']}
                    </p>
                    )}
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
                  required
                  min="0"
                  className="w-full p-2 rounded-lg"
                  style={{
                    ...inputStyle,
                    border: fieldErrors['down_up_ratio'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['down_up_ratio'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['down_up_ratio']}
                    </p>
                    )}
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
                  required
                  min="0"
                  className="w-full p-2 rounded-lg"
                  style={{
                    ...inputStyle,
                    border: fieldErrors['bwd_pkts_per_sec'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['bwd_pkts_per_sec'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['bwd_pkts_per_sec']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['flow_SYN_flag_count'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_SYN_flag_count'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_SYN_flag_count']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['flow_ACK_flag_count'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_ACK_flag_count'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_ACK_flag_count']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['flow_RST_flag_count'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_RST_flag_count'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_RST_flag_count']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                   style={{
                    ...inputStyle,
                    border: fieldErrors['flow_FIN_flag_count'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_FIN_flag_count'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_FIN_flag_count']}
                    </p>
                    )}
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
                    name="fwd_pkts_payload_avg"
                    value={formData['fwd_pkts_payload_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_pkts_payload_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_pkts_payload_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_pkts_payload_avg']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Bwd Payload Avg 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="bwd_pkts_payload_avg"
                    value={formData['bwd_pkts_payload_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['bwd_pkts_payload_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['bwd_pkts_payload_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['bwd_pkts_payload_avg']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Payload Total 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_pkts_payload_tot"
                    value={formData['fwd_pkts_payload_tot']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_pkts_payload_tot'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_pkts_payload_tot'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_pkts_payload_tot']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Fwd Payload Min 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fwd_pkts_payload_min"
                    value={formData['fwd_pkts_payload_min']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_pkts_payload_min'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_pkts_payload_min'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_pkts_payload_min']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Flow Payload Avg 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_pkts_payload_avg"
                    value={formData['flow_pkts_payload_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['flow_pkts_payload_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_pkts_payload_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_pkts_payload_avg']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Flow Payload Std 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_pkts_payload_std"
                    value={formData['flow_pkts_payload_std']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['flow_pkts_payload_std'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_pkts_payload_std'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_pkts_payload_std']}
                    </p>
                    )}
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
                    name="fwd_iat_avg"
                    value={formData['fwd_iat_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_iat_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_iat_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_iat_avg']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Bwd IAT Avg
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="bwd_iat_avg"
                    value={formData['bwd_iat_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['bwd_iat_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['bwd_iat_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['bwd_iat_avg']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Flow IAT Avg 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="flow_iat_avg"
                    value={formData['flow_iat_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['flow_iat_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['flow_iat_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['flow_iat_avg']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_init_window_size'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_init_window_size'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_init_window_size']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['bwd_init_window_size'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['bwd_init_window_size'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['bwd_init_window_size']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_last_window_size'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_last_window_size'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_last_window_size']}
                    </p>
                    )}
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
                    name="active_avg"
                    value={formData['active_avg']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['active_avg'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['active_avg'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['active_avg']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Active Total 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="active_tot"
                    value={formData['active_tot']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['active_tot'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['active_tot'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['active_tot']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Active Min 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="active_min"
                    value={formData['active_min']}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['active_min'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['active_min'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['active_min']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_subflow_bytes'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_subflow_bytes'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_subflow_bytes']}
                    </p>
                    )}
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
                    required
                    min="0"
                    className="w-full p-2 rounded-lg"
                    style={{
                    ...inputStyle,
                    border: fieldErrors['fwd_header_size_tot'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['fwd_header_size_tot'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['fwd_header_size_tot']}
                    </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--vt-text-muted)' }}>
                    Response Port 
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="id_resp_p"
                    value={formData['id_resp_p']}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-2 rounded-lg"
                   style={{
                    ...inputStyle,
                    border: fieldErrors['id_resp_p'] ? '1px solid red' : '0.5px solid var(--border)',
                    }}
                    />
                    {fieldErrors['id_resp_p'] && (
                    <p className="text-xs mt-1" style={{ color: 'red' }}>
                    {fieldErrors['id_resp_p']}
                    </p>
                    )}
                </div>
              </div>
            </div>
          </>
          )}

           <div className="pt-4" style={{ borderTop: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Select Model
              </p>
             {error && (
                  <p className="text-xs mb-2" style={{ color: '#E8383A' }}>{error}</p>
                )}
                <div className="flex gap-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="flex-1 p-2 rounded-lg"
                style={inputStyle}
              >
                {ML_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>  
                <button
                  onClick={detectAttack}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: '#00B8CC',
                    color: '#ffffff',
                    border: '0.5px solid #00B8CC',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button> 
              </div>
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
                
                <div className="flex justify-center mb-4">
                  {RiskIcon && <RiskIcon className="w-16 h-16" style={{ color: currentRiskStyle?.text }} />}
                </div>

                <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {formatPrediction(prediction.type)}
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--vt-text-muted)' }}>
                  Analyzed by {ML_MODELS.find(m => m.value === prediction.modelUsed)?.label ?? prediction.modelUsed}
                </p>
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

              {prediction.shapFeatures.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    Determining Features
                  </h3>
                  <div className="space-y-2">
                    {prediction.shapFeatures.map((f, idx) => {
                      const isPositive = f.shap_value > 0;
                      const cleanName = `${f.feature_name}`;
                      const cleanDescription = `${f.description}\n${isPositive ? 'positive: ' + f.description_positive : 'negative: ' + f.description_negative}`;
                      const tooltipText = `${cleanName}`;

                      return (
                        <div className="flex items-start gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)' }}
                        >
                        <div
                          key={idx}
                          title={tooltipText}
                          className="flex flex-col p-3 rounded-lg cursor-help"
                        >
                          <span className="text-sm font-mono" style={{ color: 'var(--foreground)', whiteSpace: 'pre-line' }}
                          >
                            {cleanName}
                          </span>
                          <span className="text-sm font-mono" style={{ color: 'var(--vt-text-muted)' }}
                          >
                            {cleanDescription}
                          </span>
                        </div>
                          <span className="text-sm font-semibold self-start"
                            style={{ color: isPositive ? '#4CAF6E' : '#E8383A' }}
                          >
                            {isPositive ? '+' : ''}{f.shap_value.toFixed(4)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--vt-text-muted)' }}>
                    Positive values push toward the predicted class. Negative values push away.
                  </p>
                </div>
              )}

              {prediction.probabilities && (
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    Class Probabilities
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(prediction.probabilities)
                      .sort((a, b) => b[1] - a[1])
                      .map(([cls, prob]) => (
                        <div key={cls} className="flex justify-between items-center p-3 rounded-lg"
                          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)' }}>
                          <span className="text-sm font-mono" style={{ color: 'var(--foreground)' }}>{cls}</span>
                          <span className="text-sm font-semibold" style={{ color: '#00B8CC' }}>
                            {(prob * 100).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}


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
};
