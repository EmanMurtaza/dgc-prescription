import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF(elementId = 'prescription-preview') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Preview element not found');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;

  pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
  return pdf;
}

export async function downloadPDF(patientName = 'prescription') {
  const pdf = await generatePDF();
  const fileName = `Rx_${patientName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
  return fileName;
}

export async function getPDFBlob(patientName = 'prescription') {
  const pdf = await generatePDF();
  return pdf.output('blob');
}

export async function shareViaWhatsApp(patientName, phone = '') {
  const text = `Dear Patient,\n\nPlease find your prescription from Prof. Dr. Ghulam Murtaza Gondal attached.\n\nDGC - Diabetes & Gastro Center\n051-5179847`;

  if (navigator.share) {
    try {
      const blob = await getPDFBlob(patientName);
      const file = new File([blob], `Prescription_${patientName}.pdf`, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Prescription', text });
        return;
      }
    } catch (e) {
      console.warn('File share not supported, falling back');
    }
  }

  // Fallback: download + open WhatsApp
  await downloadPDF(patientName);
  const encodedText = encodeURIComponent(text);
  const waUrl = phone
    ? `https://wa.me/92${phone.replace(/^0/, '')}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
  window.open(waUrl, '_blank');
}
