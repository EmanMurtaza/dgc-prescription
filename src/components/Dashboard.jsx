import { useMemo } from 'react';
import { FilePlus, History, FileText, Calendar, TrendingUp, Users } from 'lucide-react';
import { getPrescriptions } from '../utils/storage';
import MurtazaLogo from './MurtazaLogo';

export default function Dashboard({ onNavigate }) {
  const prescriptions = useMemo(() => getPrescriptions(), []);

  const today = new Date().toLocaleDateString('en-PK', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const todayCount = prescriptions.filter(p => {
    try { return new Date(p.savedAt).toDateString() === new Date().toDateString(); }
    catch { return false; }
  }).length;

  const recent = prescriptions.slice(0, 5);

  const stats = [
    { label: "Total Prescriptions", value: prescriptions.length, icon: FileText, color: "bg-green-50 text-green-700 border-green-100" },
    { label: "Today's Prescriptions", value: todayCount, icon: Calendar, color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Unique Patients", value: new Set(prescriptions.map(p => p.patientName?.toLowerCase().trim()).filter(Boolean)).size, icon: Users, color: "bg-purple-50 text-purple-700 border-purple-100" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Hero card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Logo */}
            <div className="bg-white rounded-2xl p-3 shadow-xl flex-shrink-0">
              <MurtazaLogo size={100} />
            </div>
            {/* Clinic info */}
            <div className="text-center sm:text-left">
              <p className="text-green-300 text-sm font-medium tracking-widest uppercase mb-1">
                Diabetes &amp; Gastro Center
              </p>
              <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight">
                Prof. Dr. Ghulam Murtaza Gondal
              </h1>
              <p className="text-green-200 text-sm mt-2 leading-relaxed">
                B.Sc, MMBS, FCPS, FRCP (UK) &nbsp;·&nbsp; Diabaetologist &amp; Gastroenterologist<br />
                Foundation University Medical College &nbsp;·&nbsp; Fauji Foundation Hospital
              </p>
              <p className="text-green-300 text-xs mt-3">
                📍 Abubakar Avenue Commercial Plaza 21, Phase 8, Bahria Town, Rawalpindi
              </p>
              <p className="text-green-300 text-xs mt-0.5">
                📞 051-5179847 &nbsp;·&nbsp; 0333-5108397 &nbsp;·&nbsp; 0334-5113565
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-8 py-6 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('form')}
            className="flex items-center gap-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <FilePlus size={17} /> New Prescription
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 hover:shadow"
          >
            <History size={17} /> Patient History
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${color.split(' ').slice(2).join(' ')}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent prescriptions ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-600" /> Recent Prescriptions
          </h2>
          {prescriptions.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-green-700 font-semibold hover:underline"
            >
              View all →
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <FileText size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No prescriptions yet</p>
            <p className="text-xs mt-1">Create your first prescription to see it here</p>
            <button
              onClick={() => onNavigate('form')}
              className="mt-4 text-green-700 font-semibold text-sm hover:underline"
            >
              + New Prescription
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map(p => {
              const drugCount = (p.drugs || []).filter(d => d.drug).length;
              const savedDate = new Date(p.savedAt).toLocaleDateString('en-PK', {
                day: '2-digit', month: 'short', year: 'numeric'
              });
              return (
                <div
                  key={p.id}
                  onClick={() => onNavigate('preview', p)}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(p.patientName || '?')[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{p.patientName || 'Unnamed'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.age ? `${p.age}y` : ''}{p.gender ? ` · ${p.gender}` : ''}{p.complaint ? ` · ${p.complaint.slice(0, 40)}${p.complaint.length > 40 ? '…' : ''}` : ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                      {drugCount} drug{drugCount !== 1 ? 's' : ''}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{savedDate}</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 text-sm ml-1">›</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-xs text-gray-400 pb-4">
        DGC Prescription System &nbsp;·&nbsp; <a href="https://murtazamedicalcomplex.netlify.app" target="_blank" rel="noreferrer" className="hover:text-green-700 transition-colors">murtazamedicalcomplex.netlify.app</a>
      </p>
    </div>
  );
}
