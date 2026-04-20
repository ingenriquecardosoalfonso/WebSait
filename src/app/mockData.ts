import { NetworkFlow } from './types';
import { apiFetch } from '../services/apiService';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockFlow(row: NetworkFlow): NetworkFlow {
  const { fwd_pkts_tot, bwd_pkts_tot, flow_duration, payload_bytes_per_second } = row;

  return {
    ...row,
    id: `flow-${row.id}`,
    timestamp: new Date(Date.now() - randomInt(0, 86400000)),
    fwd_pkts_payload_avg: payload_bytes_per_second / (fwd_pkts_tot / flow_duration),
    bwd_pkts_payload_avg: (payload_bytes_per_second * 0.7) / (bwd_pkts_tot / flow_duration),
    fwd_iat_avg: flow_duration / fwd_pkts_tot,
    bwd_iat_avg: flow_duration / bwd_pkts_tot,
    down_up_ratio: bwd_pkts_tot / fwd_pkts_tot,
  };
}

export async function generateMockDataset(): Promise<NetworkFlow[]> {
  const dataflow = await apiFetch('/api/network-flows/');
  const dataset = (dataflow as NetworkFlow[]).map((row) => generateMockFlow(row));
  return dataset.sort((a, b) => {
    const numA = parseInt(a.id.replace('flow-', ''));
    const numB = parseInt(b.id.replace('flow-', ''));
    return numB - numA;  // descending
  });
}

export function generateMockMetrics() {
  const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

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