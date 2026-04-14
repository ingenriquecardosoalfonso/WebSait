import { useState } from 'react';
import { predictFlow } from '../../services/predictionService';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';

const PROTOCOLS = ['tcp', 'udp', 'icmp'];
const ML_MODELS = [
  { label: 'Random Forest', value: 'random_forest' },
  { label: 'Decision Tree', value: 'decision_tree' },
  { label: 'KNN',           value: 'knn' },
];

const createInitialFormData = () => ({
  proto:                    'tcp',
  service:                  'Unidentified',
  flow_duration:            '0',
  fwd_pkts_tot:             '0',
  bwd_pkts_tot:             '0',
  flow_pkts_per_sec:        '0',
  down_up_ratio:            '0',
  flow_FIN_flag_count:      '0',
  flow_SYN_flag_count:      '0',
  flow_RST_flag_count:      '0',
  flow_ACK_flag_count:      '0',
  fwd_pkts_payload_avg:     '0',
  bwd_pkts_payload_avg:     '0',
  fwd_pkts_payload_tot:     '0',
  fwd_pkts_payload_min:     '0',
  flow_pkts_payload_avg:    '0',
  flow_pkts_payload_std:    '0',
  fwd_iat_avg:              '0',
  bwd_iat_avg:              '0',
  flow_iat_avg:             '0',
  fwd_init_window_size:     '0',
  bwd_init_window_size:     '0',
  fwd_last_window_size:     '0',
  payload_bytes_per_second: '0',
  fwd_subflow_bytes:        '0',
  fwd_header_size_tot:      '0',
  active_avg:               '0',
  active_tot:               '0',
  active_min:               '0',
  id_resp_p:                '0',
  bwd_pkts_per_sec:         '0',
});

type FormDataType = ReturnType<typeof createInitialFormData>;

export const riskStyles = {
  low: {
    bg:     'rgba(76,175,110,0.08)',
    border: '#4CAF6E',
    text:   '#4CAF6E',
    icon:   CheckCircle,
  },
  medium: {
    bg:     'rgba(232,200,64,0.08)',
    border: '#E8C840',
    text:   '#E8C840',
    icon:   AlertTriangle,
  },
  high: {
    bg:     'rgba(232,56,58,0.08)',
    border: '#E8383A',
    text:   '#E8383A',
    icon:   Shield,
  },
};

export function useDetector() {
  const [formData, setFormData]               = useState<FormDataType>(createInitialFormData());
  const [selectedModel, setSelectedModel]     = useState('random_forest');
  const [excelData, setExcelData]             = useState('');
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [successMessage, setSuccessMessage]   = useState('');
  const [isDataOpen, setIsDataOpen]           = useState(true);
  const [fieldErrors, setFieldErrors]         = useState<Record<string, string>>({});
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  const [prediction, setPrediction] = useState<{
    type:          string;
    confidence:    number;
    riskLevel:     'low' | 'medium' | 'high';
    probabilities: Record<string, number> | null;
    shapFeatures: {
        feature: string;
        feature_name: string;
        description: string;
        description_negative: string;
        description_positive: string;
        predicted_class: string;
        shap_value: number;
        state: boolean;
      }[];
  } | null>(null);

  // ── Input change ────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMessage('');
    setFieldErrors((prev) => {
      const updated = { ...prev };
      if (e.target.value === '') {
        updated[e.target.name] = 'This field is required.';
      } else if (
        e.target instanceof HTMLInputElement &&
        e.target.type === 'number' &&
        Number(e.target.value) < 0
      ) {
        updated[e.target.name] = 'Negative values are not allowed.';
      } else {
        delete updated[e.target.name];
      }
      return updated;
    });
  };

  // ── CSV parsing ─────────────────────────────────────────────
  const parseCSVLine = (line: string) => {
    const values: string[] = [];
    let current = '';
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else insideQuotes = !insideQuotes;
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

  // ── File upload ─────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setExcelData(event.target?.result as string);
        setShowExcelImport(true);
        setSuccessMessage('');
      };
      reader.readAsText(file);
    }
  };

  // ── Import CSV into form ────────────────────────────────────
  const handleImportData = () => {
    try {
      const lines = excelData
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);

      if (lines.length > 1) {
        const headers = parseCSVLine(lines[0]);
        const values  = parseCSVLine(lines[1]);

        const getValue = (col: keyof FormDataType) => {
          const dotVersion = col.toString().replace(/_avg$/, '.avg')
                                          .replace(/_tot$/, '.tot')
                                          .replace(/_min$/, '.min')
                                          .replace(/_std$/, '.std')
                                          .replace(/_p$/, '.p');
          const idxUnderscore = headers.indexOf(col as string);
          const idxDot        = headers.indexOf(dotVersion);
          const idx = idxUnderscore !== -1 ? idxUnderscore : idxDot;
          return idx !== -1 && values[idx] !== undefined && values[idx] !== '' 
            ? values[idx] 
            : formData[col];
        };

        const newFormData = {} as FormDataType;
        (Object.keys(createInitialFormData()) as (keyof FormDataType)[]).forEach(key => {
          newFormData[key] = getValue(key);
        });

        setFormData(newFormData);
        setShowExcelImport(false);
        setExcelData('');
        setSuccessMessage('File imported and data filled successfully.');
      }
    } catch (err) {
      console.error('Error parsing CSV:', err);
    }
  };

  // ── Validation ──────────────────────────────────────────────
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '') {
        errors[key] = 'This field is required.';
      } else if (key !== 'proto' && key !== 'service') {
        const num = Number(value);
        if (isNaN(num))  errors[key] = 'A numeric value is required.';
        else if (num < 0) errors[key] = 'Negative values are not allowed.';
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Detect — calls real backend ─────────────────────────────
  const detectAttack = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const payload = {
        model:                    selectedModel,
        proto:                    formData.proto,
        service:                  formData.service,
        flow_duration:            Number(formData.flow_duration),
        fwd_pkts_tot:             Number(formData.fwd_pkts_tot),
        bwd_pkts_tot:             Number(formData.bwd_pkts_tot),
        flow_pkts_per_sec:        Number(formData.flow_pkts_per_sec),
        down_up_ratio:            Number(formData.down_up_ratio),
        flow_FIN_flag_count:      Number(formData.flow_FIN_flag_count),
        flow_SYN_flag_count:      Number(formData.flow_SYN_flag_count),
        flow_RST_flag_count:      Number(formData.flow_RST_flag_count),
        flow_ACK_flag_count:      Number(formData.flow_ACK_flag_count),
        fwd_pkts_payload_avg:     Number(formData.fwd_pkts_payload_avg),
        bwd_pkts_payload_avg:     Number(formData.bwd_pkts_payload_avg),
        fwd_pkts_payload_tot:     Number(formData.fwd_pkts_payload_tot),
        fwd_pkts_payload_min:     Number(formData.fwd_pkts_payload_min),
        flow_pkts_payload_avg:    Number(formData.flow_pkts_payload_avg),
        flow_pkts_payload_std:    Number(formData.flow_pkts_payload_std),
        fwd_iat_avg:              Number(formData.fwd_iat_avg),
        bwd_iat_avg:              Number(formData.bwd_iat_avg),
        flow_iat_avg:             Number(formData.flow_iat_avg),
        fwd_init_window_size:     Number(formData.fwd_init_window_size),
        bwd_init_window_size:     Number(formData.bwd_init_window_size),
        fwd_last_window_size:     Number(formData.fwd_last_window_size),
        payload_bytes_per_second: Number(formData.payload_bytes_per_second),
        fwd_subflow_bytes:        Number(formData.fwd_subflow_bytes),
        fwd_header_size_tot:      Number(formData.fwd_header_size_tot),
        active_avg:               Number(formData.active_avg),
        active_tot:               Number(formData.active_tot),
        active_min:               Number(formData.active_min),
        id_resp_p:                Number(formData.id_resp_p),
        bwd_pkts_per_sec:         Number(formData.bwd_pkts_per_sec),
      };

      const response = await predictFlow(payload);
      setPrediction({
        type:          response.prediction,
        confidence:    response.confidence,
        riskLevel: response.risk_level.toLowerCase() === 'critical' ? 'high' 
         : response.risk_level.toLowerCase() as 'low' | 'medium' | 'high',
        probabilities: response.probabilities ?? null,
        shapFeatures:  response.shap_features ?? [],
      });

    } catch (err) {
      console.error('Prediction error:', err);
      setError('Could not connect to the prediction API. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // state
    formData,
    selectedModel,
    showExcelImport,
    successMessage,
    isDataOpen,
    fieldErrors,
    prediction,
    loading,
    error,
    // constants
    PROTOCOLS,
    ML_MODELS,
    // handlers
    handleInputChange,
    handleFileUpload,
    handleImportData,
    detectAttack,
    setSelectedModel,
    setIsDataOpen,
  };
}