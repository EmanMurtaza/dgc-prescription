export default function MurtazaLogo({ size = 90 }) {
  return (
    <img
      src="/murtaza-logo.png"
      alt="Murtaza Medical Complex"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  );
}
