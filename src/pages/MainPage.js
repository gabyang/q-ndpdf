import { Auth } from '../components/Auth';
import { PDFViewer } from '../components/PDFViewer';

export class MainPage {
  constructor() {
    this.auth = new Auth();
    this.pdfViewer = new PDFViewer();
    this.checkSession();
  }

  async checkSession() {
    const { data: { session } } = await this.auth.supabaseClient.auth.getSession();
    if (session) {
      this.pdfViewer.showPDF();
    }
  }
} 