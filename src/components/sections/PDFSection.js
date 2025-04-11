import { Button } from '../ui/Button';

export class PDFSection {
  render() {
    const pdfSection = document.createElement('section');
    pdfSection.id = 'pdf-section';
    pdfSection.style.display = 'none';

    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-container';
    pdfSection.appendChild(pdfContainer);

    // Create iframe for PDF
    const iframe = document.createElement('iframe');
    iframe.id = 'pdf-viewer';
    iframe.src = '';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    pdfContainer.appendChild(iframe);

    // Create logout button
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-button';
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'logout-button';
    pdfContainer.appendChild(logoutButton);

    return pdfSection;
  }
} 