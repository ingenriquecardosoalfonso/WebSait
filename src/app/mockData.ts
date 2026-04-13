import { NetworkFlow } from './types';
import { apiFetch } from '../services/apiService';

const ATTACK_TYPES = ['Normal', 'DDoS', 'DoS', 'Reconnaissance', 'Theft', 'Mirai'];
const PROTOCOLS: ('tcp' | 'udp' | 'icmp')[] = ['tcp', 'udp', 'icmp'];
const SERVICES = ['http', 'https', 'dns', 'ssh', 'ftp', 'smtp', 'telnet', 'ntp', 'snmp', 'mqtt'];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateMockFlow(row: NetworkFlow = {} as NetworkFlow): NetworkFlow {
  const proto = row.proto;
  const service = row.service;
  
  let flow_duration = row.flow_duration;
  let fwd_pkts_tot = row.fwd_pkts_tot;
  let bwd_pkts_tot = row.bwd_pkts_tot;
  let flow_pkts_per_sec = row.flow_pkts_per_sec ;
  let payload_bytes_per_second = row.payload_bytes_per_second;
  let flow_SYN_flag_count = row.flow_SYN_flag_count;
  let flow_ACK_flag_count = row.flow_ACK_flag_count;
  let flow_RST_flag_count = row.flow_RST_flag_count;
  let flow_FIN_flag_count = row.flow_FIN_flag_count;

  const fwd_pkts_payload_avg = payload_bytes_per_second / (fwd_pkts_tot / flow_duration);
  const bwd_pkts_payload_avg = payload_bytes_per_second * 0.7 / (bwd_pkts_tot / flow_duration);
  const fwd_iat_avg = flow_duration / fwd_pkts_tot;
  const bwd_iat_avg = flow_duration / bwd_pkts_tot;
  const down_up_ratio = bwd_pkts_tot / fwd_pkts_tot;
  
  return {
    id: `flow-${row.id}`,
    timestamp: new Date(Date.now() - randomInt(0, 86400000)),
    proto,
    service,
    flow_duration,
    flow_pkts_per_sec,
    payload_bytes_per_second,
    fwd_pkts_tot,
    bwd_pkts_tot,
    fwd_pkts_payload_avg,
    bwd_pkts_payload_avg,
    fwd_iat_avg,
    bwd_iat_avg,
    flow_SYN_flag_count,
    flow_ACK_flag_count,
    flow_RST_flag_count,
    flow_FIN_flag_count,
    fwd_init_window_size: row.fwd_init_window_size,
    bwd_init_window_size: row.bwd_init_window_size,
    down_up_ratio,
    Attack_grouped: row.Attack_grouped,
  };
}

export async function generateMockDataset(): Promise<NetworkFlow[]> {
  let size = 900; 
  const datametrics = await apiFetch('/api/metrics/');
  const datametricsrow = Array.isArray(datametrics) ? datametrics[0] : datametrics;
    if (datametricsrow?.totalFlows && typeof datametricsrow.totalFlows === 'number') {
      size = datametricsrow.totalFlows;
    }
  const dataset: NetworkFlow[] = [];
  interface Metric {  traffic_class: string; total_rows: number; percentage: number; }

  const datagrouppercentage = await apiFetch('/api/metrics/groupPercentage');
  const attackCount = (datagrouppercentage as Metric[]).find(l => l.traffic_class === 'Attack')?.total_rows ?? 0;
  const normalCount = (datagrouppercentage as Metric[]).find(l => l.traffic_class === 'Normal')?.total_rows ?? 0;

  const dataflow = await apiFetch('/api/network-flows/');
  const dataRows = (dataflow as NetworkFlow[]);
  
  dataRows.forEach((row, i) => {
    dataset.push(generateMockFlow(row!));
  });
  return dataset.sort(() => Math.random() - 0.5);
}

export function generateMockMetrics(): {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  featureImportance: { feature: string; importance: number }[];
} {
  return {
    accuracy: randomFloat(0.92, 0.98),
    precision: randomFloat(0.90, 0.97),
    recall: randomFloat(0.89, 0.96),
    f1Score: randomFloat(0.91, 0.97),
    confusionMatrix: [
      [450, 12, 8, 5, 3, 2],
      [10, 380, 5, 3, 2, 0],
      [8, 6, 320, 4, 2, 0],
      [5, 4, 3, 280, 5, 3],
      [4, 2, 3, 4, 250, 7],
      [3, 1, 2, 5, 4, 185],
    ],
    featureImportance: [
      { feature: 'flow_pkts_per_sec', importance: 0.18 },
      { feature: 'payload_bytes_per_second', importance: 0.15 },
      { feature: 'flow_SYN_flag_count', importance: 0.12 },
      { feature: 'flow_duration', importance: 0.11 },
      { feature: 'fwd_pkts_tot', importance: 0.09 },
      { feature: 'down_up_ratio', importance: 0.08 },
      { feature: 'flow_RST_flag_count', importance: 0.07 },
      { feature: 'fwd_iat_avg', importance: 0.06 },
      { feature: 'bwd_pkts_tot', importance: 0.05 },
      { feature: 'fwd_pkts_payload_avg', importance: 0.05 },
      { feature: 'flow_ACK_flag_count', importance: 0.04 },
    ],
  };
}
