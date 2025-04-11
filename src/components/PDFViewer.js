import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class PDFViewer {
  constructor() {
    this.pdfFrame = document.getElementById('pdf-viewer');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.loadPDF();
      }
    });
  }

  async loadPDF() {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      // Get the PDF URL from Supabase storage
      const { data, error } = await supabaseClient
        .storage
        .from('pdfs')
        .createSignedUrl('document.pdf', 60); // URL expires in 60 seconds

      if (error) {
        console.error('Error loading PDF:', error);
        return;
      }

      if (this.pdfFrame) {
        this.pdfFrame.src = data.signedUrl;
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }
} 