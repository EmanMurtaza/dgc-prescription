import { useState } from 'react';
import { Plus, Save, Eye, ChevronDown } from 'lucide-react';
import DrugRow from './DrugRow';
import { savePrescription, saveDrug } from '../utils/storage';

const EMPTY_DRUG = { drug: '', dosage: '', duration: '', frequency: '' };

const today = () => new Date().toLocaleDateString('en-PK', {
  day: '2-digit', month: '2-digit', year: 'numeric'
});

export default function PrescriptionForm({ onPreview }) {
  const [form, setForm] = useState({
    patientName: '',
    age: '',
    gender: 'M',
    date: today(),
    complaint: '',
    bp: '',
    weight: '',
    temp: '',
    drugs: [{ ...EMPTY_DRUG }, { ...EMPTY_DRUG }, { ...EMPTY_DRUG }],
    instructions: '',
    phone: '',
  });

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function updateDrug(i, key, val) {
    setForm(f => {
      const drugs = f.drugs.map((d, idx) => idx === i ? { ...d, [key]: val } : d);
      return { ...f, drugs };
    });
  }

  function addDrug() {
    setForm(f => ({ ...f, drugs: [...f.drugs, { ...EMPTY_DRUG }] }));
  }

  function removeDrug(i) {
    setForm(f => ({
      ...f,
      drugs: f.drugs.length > 1 ? f.drugs.filter((_, idx) => idx !== i) : f.drugs,
    }));
  }

  function handleSavePreview() {
    // Save drugs to local favorites
    form.drugs.forEach(d => { if (d.drug.trim()) saveDrug(d.drug.trim()); });
    savePrescription(form);
    onPreview(form);
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Form header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 px-6 py-4">
          <h2 className="text-white font-bold text-lg">New Prescription</h2>
          <p className="text-green-200 text-xs mt-0.5">Prof. Dr. Ghulam Murtaza Gondal — DGC</p>
        </div>

        <div className="p-5 space-y-5">

          {/* ── Patient Info ── */}
          <section>
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-green-600 inline-block"></span>Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <label className={labelCls}>Patient Name</label>
                <input className={inputCls} type="text" placeholder="Full name"
                  value={form.patientName} onChange={e => setField('patientName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Age</label>
                <input className={inputCls} type="number" placeholder="Years" min="0" max="150"
                  value={form.age} onChange={e => setField('age', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select className={inputCls} value={form.gender} onChange={e => setField('gender', e.target.value)}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className={labelCls}>Phone (for WhatsApp)</label>
                <input className={inputCls} type="tel" placeholder="03xx-xxxxxxx"
                  value={form.phone} onChange={e => setField('phone', e.target.value)} />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className={labelCls}>Date</label>
                <input className={inputCls} type="text"
                  value={form.date} onChange={e => setField('date', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Presenting Complaint ── */}
          <section>
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-green-600 inline-block"></span>Presenting Complaint(s)
            </h3>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="e.g. Hyperglycaemia, abdominal pain, nausea..."
              value={form.complaint}
              onChange={e => setField('complaint', e.target.value)}
            />
          </section>

          {/* ── Vitals ── */}
          <section>
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-green-600 inline-block"></span>Vitals
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Blood Pressure</label>
                <input className={inputCls} type="text" placeholder="e.g. 120/80 mmHg"
                  value={form.bp} onChange={e => setField('bp', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Weight</label>
                <input className={inputCls} type="text" placeholder="e.g. 72 kg"
                  value={form.weight} onChange={e => setField('weight', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Temperature</label>
                <input className={inputCls} type="text" placeholder="e.g. 98.6°F"
                  value={form.temp} onChange={e => setField('temp', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Drug Table ── */}
          <section>
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-green-600 inline-block"></span>Prescription
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 w-8">#</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 min-w-[160px]">Drug Name</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 min-w-[90px]">Dosage</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 min-w-[100px]">Duration</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 min-w-[140px]">Frequency</th>
                    <th className="px-2 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {form.drugs.map((row, i) => (
                    <DrugRow
                      key={i}
                      row={row}
                      index={i}
                      onChange={updateDrug}
                      onRemove={removeDrug}
                      isLast={i === form.drugs.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addDrug}
              className="mt-2 flex items-center gap-1.5 text-green-700 text-sm font-medium hover:text-green-900 px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Plus size={15} /> Add Drug
            </button>
          </section>

          {/* ── Other Instructions ── */}
          <section>
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-green-600 inline-block"></span>Other Instructions
            </h3>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="e.g. Avoid sugary food, drink 2L water daily, follow-up after 4 weeks..."
              value={form.instructions}
              onChange={e => setField('instructions', e.target.value)}
            />
          </section>

          {/* ── Action button ── */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreview}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Eye size={16} /> Preview Prescription
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
