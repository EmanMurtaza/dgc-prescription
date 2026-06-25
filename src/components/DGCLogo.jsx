export default function DGCLogo({ size = 90 }) {
  const h = size * 0.62;
  const letterW = size / 3;
  return (
    <div style={{ display: 'inline-block' }}>
      <div style={{ display: 'flex', width: size, height: h }}>
        {/* D - black */}
        <div style={{
          width: letterW, height: h, background: '#111', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid #333'
        }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: h * 0.52, fontFamily: 'Arial Black, sans-serif', lineHeight: 1 }}>D</span>
        </div>
        {/* G - gold/orange */}
        <div style={{
          width: letterW, height: h, background: '#d4a017', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid #b8860b'
        }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: h * 0.52, fontFamily: 'Arial Black, sans-serif', lineHeight: 1 }}>G</span>
        </div>
        {/* C - black */}
        <div style={{
          width: letterW, height: h, background: '#111', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid #333'
        }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: h * 0.52, fontFamily: 'Arial Black, sans-serif', lineHeight: 1 }}>C</span>
        </div>
      </div>
      <div style={{
        textAlign: 'center', fontSize: size * 0.11, fontWeight: 600,
        color: '#111', marginTop: 3, letterSpacing: '0.03em',
        fontFamily: 'Arial, sans-serif'
      }}>
        Diabetes &amp; Gastro Center
      </div>
    </div>
  );
}
