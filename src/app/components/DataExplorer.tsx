import { useState, useMemo } from 'react';
import { NetworkFlow } from '../types';
import { generateMockDataset } from '../mockData';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function DataExplorer() {
  const [dataset] = useState<NetworkFlow[]>(() => generateMockDataset(500));
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
    return Array.from(new Set(dataset.map(f => f.Attack_type))).sort();
  }, [dataset]);
  
  // Filter data
  const filteredData = useMemo(() => {
    return dataset.filter(flow => {
      if (filters.proto !== 'all' && flow.proto !== filters.proto) return false;
      if (filters.service !== 'all' && flow.service !== filters.service) return false;
      if (filters.attackType !== 'all' && flow.Attack_type !== filters.attackType) return false;
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
      'ID,Timestamp,Protocol,Service,Duration,Attack_Type,Fwd_Pkts,Bwd_Pkts,Pkts_Per_Sec,Payload_Bytes_Per_Sec',
      ...filteredData.map(f => 
        `${f.id},${f.timestamp.toISOString()},${f.proto},${f.service},${f.flow_duration},${f.Attack_type},${f.fwd_pkts_tot},${f.bwd_pkts_tot},${f.flow_pkts_per_sec.toFixed(2)},${f.payload_bytes_per_second.toFixed(2)}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_flows.csv';
    a.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data Explorer</h1>
          <p className="text-gray-600 mt-2">Explore and filter network flow dataset</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Protocol</label>
            <select
              value={filters.proto}
              onChange={(e) => {
                setFilters({ ...filters, proto: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            >
              <option value="all">All</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
              <option value="icmp">ICMP</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Service</label>
            <select
              value={filters.service}
              onChange={(e) => {
                setFilters({ ...filters, service: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            >
              <option value="all">All</option>
              {uniqueServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Attack Type</label>
            <select
              value={filters.attackType}
              onChange={(e) => {
                setFilters({ ...filters, attackType: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            >
              <option value="all">All</option>
              {uniqueAttackTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Search by ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="flow-123..."
                value={filters.searchTerm}
                onChange={(e) => {
                  setFilters({ ...filters, searchTerm: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full p-2 pl-9 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200">
            <p className="text-sm text-gray-600">Filtered Flows</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.totalFlows}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200">
            <p className="text-sm text-gray-600">Average Duration</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.avgDuration}s</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200">
            <p className="text-sm text-gray-600">Average Packets</p>
            <p className="text-2xl font-bold mt-1 text-purple-600">{stats.avgPackets}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200">
            <p className="text-sm text-gray-600">Average Payload</p>
            <p className="text-2xl font-bold mt-1 text-orange-600">{stats.avgPayload} B/s</p>
          </div>
        </div>
      )}
      
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Proto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Fwd Pkts</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Bwd Pkts</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Pkts/s</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Attack Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((flow) => (
                <tr key={flow.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{flow.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{flow.timestamp.toLocaleString('es-ES')}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold border border-blue-200">
                      {flow.proto.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{flow.service}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{flow.flow_duration.toFixed(2)}s</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{flow.fwd_pkts_tot}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{flow.bwd_pkts_tot}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{flow.flow_pkts_per_sec.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      flow.Attack_type === 'Normal'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {flow.Attack_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
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
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}