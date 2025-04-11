import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class PDFViewer {
  constructor() {
    this.iframe = document.getElementById('pdf-frame');
    this.setupSecurityMeasures();
  }

  setupSecurityMeasures() {
    this.iframe.addEventListener('load', () => {
      try {
        // Disable context menu
        this.iframe.contentDocument.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });

        // Disable keyboard shortcuts
        this.iframe.contentDocument.addEventListener('keydown', (e) => {
          const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
          if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            return false;
          }
        });

        // Disable text selection
        this.iframe.contentDocument.addEventListener('selectstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Disable drag and drop
        this.iframe.contentDocument.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Add CSS to disable text selection
        const style = this.iframe.contentDocument.createElement('style');
        style.textContent = `
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `;
        this.iframe.contentDocument.head.appendChild(style);
      } catch (error) {
        console.error('Error applying security measures:', error);
      }
    });
  }

  async showPDF() {
    try {
      // Get a signed URL for the PDF
      const { data, error } = await supabaseClient
        .storage
        .from('whitepaper')
        .createSignedUrl('whitepaper-document.pdf', 3600); // URL expires in 1 hour

      if (error) {
        console.error('Error getting PDF URL:', error);
        document.getElementById('error-message').textContent = 'Error loading PDF. Please try again.';
        return;
      }

      // Load the PDF into the iframe with security parameters
      this.iframe.src = `${data.signedUrl}#toolbar=0&navpanes=0`;
    } catch (err) {
      console.error('Error loading PDF:', err);
      document.getElementById('error-message').textContent = 'Error loading PDF. Please try again.';
    }
  }
} 