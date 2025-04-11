import { Button } from '../ui/Button';

export class PDFSection {
  render() {
    const pdfSection = document.createElement('div');
    pdfSection.id = 'pdf-section';
    pdfSection.style.display = 'none';

    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-container';
    pdfSection.appendChild(pdfContainer);

    const pdfFrame = document.createElement('iframe');
    pdfFrame.id = 'pdf-frame';
    pdfFrame.width = '100%';
    pdfFrame.height = '100%';
    pdfContainer.appendChild(pdfFrame);

    const logoutButton = new Button('Logout', 'button', 'btn-logout');
    pdfContainer.appendChild(logoutButton.render());

    return pdfSection;
  }
} 