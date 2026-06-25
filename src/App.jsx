import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, History, Plus, Printer, Share2, Download, ArrowLeft, Loader2, X, Home } from 'lucide-react';
import PrescriptionForm from './components/PrescriptionForm';
import PrescriptionPreview from './components/PrescriptionPreview';
import PatientHistory from './components/PatientHistory';
import Dashboard from './components/Dashboard';
import { downloadPDF, shareViaWhatsApp } from './utils/pdf';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [previewData, setPreviewData] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingDownload, setPendingDownload] = useState(false);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Rx_${previewData?.patientName || 'prescription'}`,
  });

  useEffect(() => {
    if (pendingDownload && view === 'preview' && previewData) {
      const timer = setTimeout(async () => {
        setPendingDownload(false);
        await triggerDownload();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pendingDownload, view, previewData]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handlePreview(data) {
    setPreviewData(data);
    setView('preview');
  }

  function handleViewFromHistory(data, autoDownload = false) {
    setPreviewData(data);
    setView('preview');
    if (autoDownload) setPendingDownload(true);
  }

  function handleDashboardNavigate(target, data = null) {
    if (data) {
      setPreviewData(data);
      setView('preview');
    } else {
      setView(target);
    }
  }

  async function triggerDownload() {
    setDownloading(true);
    try {
      const name = await downloadPDF(previewData?.patientName || 'patient');
      showToast(`Downloaded: ${name}`);
    } catch {
      showToast('Download failed — try Print instead', 'error');
    } finally {
      setDownloading(false);
    }
  }

  async function handleDownload() {
    if (!previewData) return;
    await triggerDownload();
  }

  async function handleShare() {
    if (!previewData) return;
    setSharing(true);
    try {
      await shareViaWhatsApp(previewData.patientName || 'patient', previewData.phone || '');
      showToast('Shared successfully!');
    } catch {
      showToast('PDF downloaded — open WhatsApp to send', 'error');
    } finally {
      setSharing(false);
    }
  }

  const NAV_ITEMS = [
    { id: 'dashboard', icon: <Home size={15} />, label: 'Home' },
    { id: 'form',      icon: <Plus size={15} />, label: 'New Rx' },
    { id: 'preview',   icon: <FileText size={15} />, label: 'Preview' },
    { id: 'history',   icon: <History size={15} />, label: 'History' },
  ];

  function NavBtn({ id, icon, label }) {
    const active = view === id;
    return (
      <button
        onClick={() => setView(id)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          active ? 'bg-white text-green-800 shadow-sm' : 'text-green-100 hover:text-white hover:bg-green-700'
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Nav ── */}
      <header className="bg-green-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
              <span className="text-green-800 font-black text-xs leading-none">DGC</span>
            </div>
            <div className="hidden sm:block leading-none">
              <p className="text-white font-bold text-sm">DGC Prescription System</p>
              <p className="text-green-300 text-xs mt-0.5">Prof. Dr. Ghulam Murtaza Gondal</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 bg-green-900/60 rounded-xl p-1">
            {NAV_ITEMS.map(item => <NavBtn key={item.id} {...item} />)}
          </nav>
        </div>
      </header>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
          toast.type === 'error' ? 'bg-red-600 text-white border-red-700' : 'bg-green-700 text-white border-green-800'
        }`}>
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 ml-1"><X size={14} /></button>
        </div>
      )}

      {/* ── Content ── */}
      <main className="max-w-5xl mx-auto px-4 py-6">

        {view === 'dashboard' && (
          <Dashboard onNavigate={handleDashboardNavigate} />
        )}

        {view === 'form' && (
          <PrescriptionForm onPreview={handlePreview} />
        )}

        {view === 'history' && (
          <PatientHistory onView={handleViewFromHistory} />
        )}

        {view === 'preview' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <button
                onClick={() => setView('dashboard')}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200"
              >
                <ArrowLeft size={15} /> Home
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm hover:shadow active:scale-95"
                >
                  <Printer size={15} /> Print / PDF
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm active:scale-95 disabled:opacity-60"
                >
                  {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                  {downloading ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm active:scale-95 disabled:opacity-60 text-white"
                  style={{ background: sharing ? '#1da851' : '#25D366' }}
                >
                  {sharing ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
                  {sharing ? 'Sharing...' : 'WhatsApp'}
                </button>
              </div>
            </div>

            {previewData ? (
              <div className="overflow-x-auto pb-8">
                <div className="shadow-2xl mx-auto" style={{ width: '210mm', minWidth: '210mm' }}>
                  <PrescriptionPreview ref={printRef} data={previewData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-base font-medium">No prescription loaded</p>
                <button onClick={() => setView('form')} className="mt-5 text-green-700 font-semibold hover:underline text-sm">
                  Go to New Rx →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
