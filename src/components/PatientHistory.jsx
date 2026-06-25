import { useState } from 'react';
import { Search, Trash2, Eye, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { getPrescriptions, deletePrescription } from '../utils/storage';
import { downloadPDF } from '../utils/pdf';

export default function PatientHistory({ onView }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [list, setList] = useState(() => getPrescriptions());
  const [downloading, setDownloading] = useState(null);

  const filtered = list.filter(p =>
    p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.complaint?.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id) {
    if (!confirm('Delete this prescription?')) return;
    deletePrescription(id);
    setList(getPrescriptions());
  }

  async function handleDownload(p) {
    setDownloading(p.id);
    onView(p, true); // render preview first (silent)
    await new Promise(r => setTimeout(r, 800));
    try {
      await downloadPDF(p.patientName || 'patient');
    } finally {
      setDownloading(null);
    }
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch { return iso; }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="bg-gradient-to-r from-green-800 to-green-700 px-6 py-4">
          <h2 className="text-white font-bold text-lg">Patient History</h2>
          <p className="text-green-200 text-xs mt-0.5">{list.length} saved prescription{list.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="p-5">
          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or complaint..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm">{search ? 'No results found' : 'No prescriptions saved yet'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {(p.patientName || '?')[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{p.patientName || 'Unnamed Patient'}</p>
                          <p className="text-xs text-gray-500">
                            {p.age ? `${p.age}y` : ''}{p.age && p.gender ? ' · ' : ''}{p.gender || ''}{p.phone ? ` · ${p.phone}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="text-xs text-gray-400 hidden sm:block">{formatDate(p.savedAt)}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {(p.drugs || []).filter(d => d.drug).length} drug{(p.drugs || []).filter(d => d.drug).length !== 1 ? 's' : ''}
                      </span>
                      {expanded === p.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {expanded === p.id && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                      {p.complaint && (
                        <p className="text-xs text-gray-600 mb-2">
                          <span className="font-semibold">Complaint:</span> {p.complaint}
                        </p>
                      )}
                      {(p.drugs || []).filter(d => d.drug).length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1.5">Drugs:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {p.drugs.filter(d => d.drug).map((d, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                {d.drug}{d.dosage ? ` ${d.dosage}` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => onView(p)}
                          className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye size={13} /> View / Print
                        </button>
                        <button
                          onClick={() => handleDownload(p)}
                          disabled={downloading === p.id}
                          className="flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Download size={13} /> {downloading === p.id ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
