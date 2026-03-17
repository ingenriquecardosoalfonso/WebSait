export interface NetworkFlow {
  id: string;
  timestamp: Date;
  proto: 'tcp' | 'udp' | 'icmp';
  service: string;
  flow_duration: number;
  flow_pkts_per_sec: number;
  payload_bytes_per_second: number;
  fwd_pkts_tot: number;
  bwd_pkts_tot: number;
  fwd_pkts_payload_avg: number;
  bwd_pkts_payload_avg: number;
  fwd_iat_avg: number;
  bwd_iat_avg: number;
  flow_SYN_flag_count: number;
  flow_ACK_flag_count: number;
  flow_RST_flag_count: number;
  flow_FIN_flag_count: number;
  fwd_init_window_size: number;
  bwd_init_window_size: number;
  down_up_ratio: number;
  Attack_type: string;
}

export type ModuleType = 'DASHBOARD' | 'ML_TRAINING' | 'DETECTOR' | 'DATA_EXPLORER' | 'ANALYSIS' | 'LIVE_MONITOR' | 'ABOUT';

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  featureImportance: { feature: string; importance: number }[];
}