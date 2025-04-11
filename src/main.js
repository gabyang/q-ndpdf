import { createClient } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { PDFViewer } from './components/PDFViewer';
import { Router } from './components/Router';
import { Styles } from './components/ui/Styles';
import { AuthSection } from './components/sections/AuthSection';
import { PDFSection } from './components/sections/PDFSection';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class App {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Inject styles
    Styles.inject();

    // Create main container
    const appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);

    // Create and append sections
    const authSection = new AuthSection();
    const pdfSection = new PDFSection();
    appContainer.appendChild(authSection.render());
    appContainer.appendChild(pdfSection.render());

    // Initialize router and components
    this.router = new Router();
    this.auth = new Auth(this.router);
    this.pdfViewer = new PDFViewer();

    // Check session
    this.checkSession();
  }

  async checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      this.router.navigateTo('/pdf');
    } else {
      this.router.navigateTo('/');
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
}); 