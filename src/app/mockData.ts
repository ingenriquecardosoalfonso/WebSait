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

export function generateMockFlow(id: number, attackType?: string): NetworkFlow {
  const isAttack = attackType !== 'Normal';
  const proto = randomChoice(PROTOCOLS);
  const service = randomChoice(SERVICES);
  
  // Normal traffic patterns
  let flow_duration = randomFloat(0.1, 120);
  let fwd_pkts_tot = randomInt(5, 100);
  let bwd_pkts_tot = randomInt(3, 80);
  let flow_pkts_per_sec = (fwd_pkts_tot + bwd_pkts_tot) / flow_duration;
  let payload_bytes_per_second = randomFloat(100, 5000);
  let flow_SYN_flag_count = proto === 'tcp' ? randomInt(1, 3) : 0;
  let flow_ACK_flag_count = proto === 'tcp' ? randomInt(5, 50) : 0;
  let flow_RST_flag_count = proto === 'tcp' ? randomInt(0, 2) : 0;
  let flow_FIN_flag_count = proto === 'tcp' ? randomInt(0, 2) : 0;
  
  // Attack patterns modify the metrics
  if (isAttack) {
    if (attackType === 'DDoS' || attackType === 'DoS') {
      flow_pkts_per_sec = randomFloat(1000, 10000);
      fwd_pkts_tot = randomInt(500, 5000);
      payload_bytes_per_second = randomFloat(10000, 100000);
      flow_SYN_flag_count = proto === 'tcp' ? randomInt(50, 500) : 0;
      flow_RST_flag_count = proto === 'tcp' ? randomInt(20, 200) : 0;
    } else if (attackType === 'Reconnaissance') {
      flow_duration = randomFloat(0.01, 1);
      fwd_pkts_tot = randomInt(1, 5);
      bwd_pkts_tot = randomInt(0, 2);
      flow_SYN_flag_count = proto === 'tcp' ? randomInt(1, 2) : 0;
      flow_RST_flag_count = proto === 'tcp' ? randomInt(1, 2) : 0;
    } else if (attackType === 'Mirai') {
      flow_duration = randomFloat(10, 300);
      fwd_pkts_tot = randomInt(200, 1000);
      payload_bytes_per_second = randomFloat(5000, 50000);
      flow_SYN_flag_count = proto === 'tcp' ? randomInt(10, 100) : 0;
    }
  }
  
  const fwd_pkts_payload_avg = payload_bytes_per_second / (fwd_pkts_tot / flow_duration);
  const bwd_pkts_payload_avg = payload_bytes_per_second * 0.7 / (bwd_pkts_tot / flow_duration);
  const fwd_iat_avg = flow_duration / fwd_pkts_tot;
  const bwd_iat_avg = flow_duration / bwd_pkts_tot;
  const down_up_ratio = bwd_pkts_tot / fwd_pkts_tot;
  
  return {
    id: `flow-${id}`,
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
    fwd_init_window_size: randomInt(1024, 65535),
    bwd_init_window_size: randomInt(1024, 65535),
    down_up_ratio,
    Attack_type: attackType || randomChoice(ATTACK_TYPES),
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

  for (let i = 0; i < normalCount; i++) {
    dataset.push(generateMockFlow(i, 'Normal'));
  }
  
  const attackTypes = ATTACK_TYPES.filter(t => t !== 'Normal');
  for (let i = 0; i < attackCount; i++) {
    const attackType = randomChoice(attackTypes);
    dataset.push(generateMockFlow(normalCount + i, attackType));
  }
  
  // Shuffle
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
