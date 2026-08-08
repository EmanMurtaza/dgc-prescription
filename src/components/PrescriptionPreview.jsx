import { forwardRef } from 'react';
import MurtazaLogo from './MurtazaLogo';

const PrescriptionPreview = forwardRef(({ data }, ref) => {
  const {
    patientName = '', age = '', gender = '', date = '',
    complaint = '', bp = '', weight = '', temp = '',
    drugs = [], instructions = '',
  } = data;

  return (
    <div
      ref={ref}
      id="prescription-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontWeight: 700,
        color: '#111',
        padding: '12mm 14mm 10mm 14mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Main content grows to fill page ── */}
      <div style={{ flex: 1 }}>

        {/* ───── CLINIC TITLE ───── */}
        <div style={{
          textAlign: 'center', fontWeight: 900, fontSize: '26px', color: '#111',
          letterSpacing: '0.04em', marginBottom: '3mm', textTransform: 'uppercase',
        }}>
          Murtaza Medical Complex
        </div>

        {/* ───── LETTERHEAD HEADER ───── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4mm' }}>

          {/* Left: MMC logo — enlarged, no DGC */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MurtazaLogo size={160} />
          </div>

          {/* Right: Doctor info */}
          <div style={{ textAlign: 'right', lineHeight: '1.7' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>Professor</div>
            <div style={{ fontWeight: 900, fontSize: '19px', color: '#111', marginBottom: '2px' }}>Dr. Ghulam Murtaza Gondal</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>B.Sc, MMBS, FCPS</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Advanced Diabetes Training</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Member International Diabetes Center,</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Park Nocollet Minnesota, USA</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Consultant Med / Spec, Diabaetologist</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Gastroenterologist &amp; Endoscopist</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Professor of Medicine</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Foundation University Medical College</div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111' }}>Fauji Foundation Hospital Rawalpindi</div>
          </div>
        </div>

        {/* Horizontal divider */}
        <hr style={{ border: 'none', borderTop: '2px solid #111', margin: '2mm 0' }} />

        {/* ───── PATIENT INFO ───── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4mm', marginBottom: '2mm' }}>
          <div>
            <span style={{ fontWeight: 700 }}>Patient Name: </span>
            <span style={{ borderBottom: '1px solid #333', minWidth: '120px', display: 'inline-block', paddingLeft: '4px', paddingBottom: '1px' }}>
              {patientName}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: 700 }}>Age/Gender: </span>
            <span style={{ borderBottom: '1px solid #333', display: 'inline-block', minWidth: '60px', paddingLeft: '4px' }}>
              {age}{age && gender ? ' / ' : ''}{gender}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: 700 }}>Date: </span>
            <span style={{ borderBottom: '1px solid #333', display: 'inline-block', minWidth: '70px', paddingLeft: '4px' }}>
              {date}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '3mm' }}>
          <span style={{ fontWeight: 700 }}>Presenting Complaint(s): </span>
          <span style={{ borderBottom: '1px solid #333', display: 'inline-block', minWidth: '400px', paddingLeft: '4px' }}>
            {complaint}
          </span>
        </div>

        {/* ───── VITALS ───── */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '4mm' }}>
          <div>
            <span style={{ fontWeight: 700 }}>BP: </span>
            <span style={{ borderBottom: '1px solid #333', display: 'inline-block', minWidth: '70px', paddingLeft: '4px' }}>{bp}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700 }}>Weight: </span>
            <span style={{ borderBottom: '1px solid #333', display: 'inline-block', minWidth: '60px', paddingLeft: '4px' }}>{weight}</span>
          </div>
          <div>
            <span style={{ fontWeight: 700 }}>Temp: </span>
            <span style={{ borderBottom: '1px solid #333', display: 'inline-block', minWidth: '60px', paddingLeft: '4px' }}>{temp}</span>
          </div>
        </div>

        {/* ───── PRESCRIPTION ───── */}
        <div style={{ fontWeight: 900, fontSize: '16px', textDecoration: 'underline', marginBottom: '3mm' }}>
          Prescription
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #333', marginBottom: '4mm' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #333' }}>
              {['#', 'Drug Name', 'Dosage', 'Duration', 'Time / Frequency'].map((h, i) => (
                <th key={h} style={{
                  padding: '5px 6px', textAlign: 'left', fontWeight: 900,
                  fontSize: '12px', borderRight: i < 4 ? '1.5px solid #333' : 'none',
                  background: '#fafafa',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drugs.filter(d => d.drug || d.dosage || d.duration || d.frequency).length > 0
              ? drugs.filter(d => d.drug || d.dosage || d.duration || d.frequency).map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #ddd', minHeight: '22px' }}>
                  <td style={{ padding: '5px 6px', borderRight: '1px solid #ddd', width: '20px', color: '#555', fontSize: '12px', fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: '5px 6px', borderRight: '1px solid #ddd', minWidth: '120px', fontWeight: 700 }}>{d.drug}</td>
                  <td style={{ padding: '5px 6px', borderRight: '1px solid #ddd', minWidth: '60px', fontWeight: 700 }}>{d.dosage}</td>
                  <td style={{ padding: '5px 6px', borderRight: '1px solid #ddd', minWidth: '60px', fontWeight: 700 }}>{d.duration}</td>
                  <td style={{ padding: '5px 6px', fontWeight: 700 }}>{d.frequency}</td>
                </tr>
              ))
              : [1, 2, 3, 4, 5].map(i => (
                <tr key={i} style={{ height: '22px', borderBottom: '1px solid #eee' }}>
                  <td style={{ borderRight: '1px solid #ddd' }}></td>
                  <td style={{ borderRight: '1px solid #ddd' }}></td>
                  <td style={{ borderRight: '1px solid #ddd' }}></td>
                  <td style={{ borderRight: '1px solid #ddd' }}></td>
                  <td></td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {/* ───── OTHER INSTRUCTIONS ───── */}
        <div style={{ marginBottom: '6mm' }}>
          <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2mm' }}>Other Instructions:</div>
          <div style={{
            borderBottom: '1px solid #aaa', minHeight: '16px', paddingBottom: '2px',
            whiteSpace: 'pre-wrap', lineHeight: '1.6', fontWeight: 700,
          }}>
            {instructions || ' '}
          </div>
          <div style={{ borderBottom: '1px solid #aaa', marginTop: '8px', height: '16px' }} />
        </div>

        {/* ───── SIGNATURE BLOCK ───── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6mm' }}>
          <div style={{ textAlign: 'center', minWidth: '160px' }}>
            <div style={{ height: '30px', borderBottom: '1px solid #333', marginBottom: '3px' }} />
            <div style={{ fontSize: '11px', color: '#111', fontWeight: 700 }}>Prof Dr. Ghulam Murtaza Gondal</div>
            <div style={{ fontSize: '10.5px', color: '#111', fontWeight: 700 }}>BSc, MBBS, FCPS, FRCP (UK)</div>
            <div style={{ fontSize: '10.5px', color: '#111', fontWeight: 700 }}>Professor, Department of Medicine</div>
            <div style={{ fontSize: '10.5px', color: '#111', fontWeight: 700 }}>Foundation University Medical College</div>
            <div style={{ fontSize: '10.5px', color: '#111', fontWeight: 700 }}>Fauji Foundation Hospital Rawalpindi</div>
          </div>
        </div>

      </div>{/* end flex:1 */}

      {/* ───── FOOTER — always at bottom, never overlaps ───── */}
      <div style={{ marginTop: 'auto', paddingTop: '4mm' }}>
        <hr style={{ border: 'none', borderTop: '2px solid #111', marginBottom: '3mm' }} />
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '12px', color: '#111', marginBottom: '2px' }}>
          Abubakar Avenue Commercial Plaza 21, Phase 8, Bahria Town, Rawalpindi
        </div>
        <div style={{ textAlign: 'center', marginBottom: '2px' }}>
          <span style={{
            background: '#111', color: 'white', fontSize: '11px',
            fontWeight: 700, padding: '2px 12px', letterSpacing: '0.05em'
          }}>
            CONSULTATION ON APPOINTMENT ONLY
          </span>
        </div>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '12px', color: '#111', marginBottom: '1px' }}>
          051-5179847, 0333-5108397, 0334-5113565
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#111', fontWeight: 700 }}>
          Website: murtazamedicalcomplex.netlify.app
        </div>
      </div>

    </div>
  );
});

PrescriptionPreview.displayName = 'PrescriptionPreview';
export default PrescriptionPreview;
