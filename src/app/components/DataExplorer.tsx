import { useState, useMemo, useEffect } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function DataExplorer() {
  const [dataset, setDataset] = useState<NetworkFlow[]>([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      generateMockDataset().then((data) => {
        setDataset(data);
        setLoading(false);
      });
    }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    proto: 'all',
    service: 'all',
    attackType: 'all',
    searchTerm: '',
  });

  // Get unique values for filters
  const uniqueServices = useMemo(() => {
    return Array.from(new Set(dataset.map(f => f.service))).sort();
  }, [dataset]);

  const uniqueAttackTypes = useMemo(() => {
    return Array.from(new Set(dataset.map(f => f.Attack_grouped))).sort();
  }, [dataset]);

  // Filter data
  const filteredData = useMemo(() => {
    return dataset.filter(flow => {
      if (filters.proto !== 'all' && flow.proto !== filters.proto) return false;
      if (filters.service !== 'all' && flow.service !== filters.service) return false;
      if (filters.attackType !== 'all' && flow.Attack_grouped !== filters.attackType) return false;
      if (filters.searchTerm && !flow.id.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [dataset, filters]);

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Calculate statistics for filtered data
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    return {
      totalFlows: filteredData.length,
      avgDuration: (filteredData.reduce((sum, f) => sum + f.flow_duration, 0) / filteredData.length).toFixed(2),
      avgPackets: (filteredData.reduce((sum, f) => sum + (f.fwd_pkts_tot + f.bwd_pkts_tot), 0) / filteredData.length).toFixed(2),
      avgPayload: (filteredData.reduce((sum, f) => sum + f.payload_bytes_per_second, 0) / filteredData.length).toFixed(2),
    };
  }, [filteredData]);

  const handleExport = () => {
    const csv = [
      'ID,Protocol,Service,Duration,Attack_grouped,Fwd_Pkts,Bwd_Pkts,Pkts_Per_Sec,Payload_Bytes_Per_Sec',
      ...filteredData.map(f =>
        `${f.id},${f.proto},${f.service},${f.flow_duration},${f.Attack_grouped},${f.fwd_pkts_tot},${f.bwd_pkts_tot},${f.flow_pkts_per_sec.toFixed(2)},${f.payload_bytes_per_second.toFixed(2)}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_flows.csv';
    a.click();
  };

  const inputStyle = {
    backgroundColor: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-foreground">
            Data Explorer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore and filter network flow dataset
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: '#4CAF6E',
            color: '#ffffff',
            border: '0.5px solid #4CAF6E',
          }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div
        className="rounded p-6"
        style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
      >
        <h2
          className="text-xs font-medium tracking-widest uppercase mb-4"
          style={{ color: '#8A8A9A' }}
        >
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Protocol
            </label>
            <select
              value={filters.proto}
              onChange={(e) => {
                setFilters({ ...filters, proto: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full p-2 rounded-lg"
              style={inputStyle}
            >
              <option value="all">All</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
              <option value="icmp">ICMP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Service
            </label>
            <select
              value={filters.service}
              onChange={(e) => {
                setFilters({ ...filters, service: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full p-2 rounded-lg"
              style={inputStyle}
            >
              <option value="all">All</option>
              {uniqueServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Attack Type
            </label>
            <select
              value={filters.attackType}
              onChange={(e) => {
                setFilters({ ...filters, attackType: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full p-2 rounded-lg"
              style={inputStyle}
            >
              <option value="all">All</option>
              {uniqueAttackTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              Search by ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'var(--vt-text-muted)' }} />
              <input
                type="text"
                placeholder="flow-123..."
                value={filters.searchTerm}
                onChange={(e) => {
                  setFilters({ ...filters, searchTerm: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full p-2 pl-9 rounded-lg"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="rounded p-4 text-center"
            style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--vt-text-muted)' }}>Filtered Flows</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: '#00B8CC' }}>{stats.totalFlows}</p>
          </div>

          <div
            className="rounded p-4 text-center"
            style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--vt-text-muted)' }}>Average Duration</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: '#4CAF6E' }}>{stats.avgDuration}s</p>
          </div>

          <div
            className="rounded p-4 text-center"
            style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--vt-text-muted)' }}>Average Packets</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: '#E8C840' }}>{stats.avgPackets}</p>
          </div>

          <div
            className="rounded p-4 text-center"
            style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--vt-text-muted)' }}>Average Payload</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: '#E8383A' }}>{stats.avgPayload} B/s</p>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div
        className="rounded overflow-hidden"
        style={{ backgroundColor: 'var(--card)', border: '0.5px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderBottom: '0.5px solid var(--border)',
              }}
            >
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Proto</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Fwd Pkts</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Bwd Pkts</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Pkts/s</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: '#8A8A9A' }}>Attack Type</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((flow) => (
                <tr
                  key={flow.id}
                  className="transition-colors"
                  style={{ borderTop: '0.5px solid var(--border)' }}
                >
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--foreground)' }}>
                    {flow.id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(0,184,204,0.08)',
                        color: '#00B8CC',
                        border: '0.5px solid #00B8CC',
                      }}
                    >
                      {flow.proto.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    {flow.service}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    {flow.flow_duration.toFixed(2)}s
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    {flow.fwd_pkts_tot}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    {flow.bwd_pkts_tot}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>
                    {flow.flow_pkts_per_sec.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={
                        flow.Attack_grouped === 'Normal'
                          ? {
                              backgroundColor: 'rgba(76,175,110,0.08)',
                              color: '#4CAF6E',
                              border: '0.5px solid #4CAF6E',
                            }
                          : {
                              backgroundColor: 'rgba(232,56,58,0.08)',
                              color: '#E8383A',
                              border: '0.5px solid #E8383A',
                            }
                      }
                    >
                      {flow.Attack_grouped}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderTop: '0.5px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--vt-text-muted)' }}>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '0.5px solid var(--border)',
                color: 'var(--foreground)',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className="px-3 py-1 rounded-lg"
                    style={
                      currentPage === pageNum
                        ? {
                            backgroundColor: '#00B8CC',
                            color: '#ffffff',
                            border: '0.5px solid #00B8CC',
                          }
                        : {
                            backgroundColor: 'transparent',
                            color: 'var(--foreground)',
                            border: '0.5px solid transparent',
                          }
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2" style={{ color: 'var(--vt-text-muted)' }}>...</span>}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '0.5px solid var(--border)',
                color: 'var(--foreground)',
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}