import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportDashboardPdf(summary, userName) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('en-IN');

  doc.setFontSize(18);
  doc.setTextColor(46, 125, 50);
  doc.text('AgroPulse - Farm Report', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Farmer: ${userName || 'User'}`, 14, 30);
  doc.text(`Generated: ${date}`, 14, 37);

  let y = 48;

  if (summary?.weather) {
    doc.setFontSize(13);
    doc.setTextColor(46, 125, 50);
    doc.text('Weather Summary', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const w = summary.weather;
    doc.text(`${w.city}: ${w.temperature}°C, ${w.condition}`, 14, y);
    y += 6;
    doc.text(`Humidity: ${w.humidity}% | Wind: ${w.windSpeed} km/h`, 14, y);
    y += 12;
  }

  if (summary?.marketHighlight) {
    doc.setFontSize(13);
    doc.setTextColor(46, 125, 50);
    doc.text('Market Highlight', 14, y);
    y += 8;
    const m = summary.marketHighlight;
    autoTable(doc, {
      startY: y,
      head: [['Crop', 'Market', 'Avg Price']],
      body: [[m.cropName, m.marketName, `₹${m.avgPrice}`]],
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50] },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (summary?.cropTip) {
    doc.setFontSize(13);
    doc.setTextColor(46, 125, 50);
    doc.text('Crop Tip', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(summary.cropTip.title + ': ' + summary.cropTip.content, 180);
    doc.text(lines, 14, y);
  }

  doc.save(`agropulse-report-${Date.now()}.pdf`);
}
