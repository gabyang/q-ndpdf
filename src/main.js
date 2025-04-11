import { createClient } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { PDFViewer } from './components/PDFViewer';
import { Router } from './components/Router';
import { Styles } from './components/ui/Styles';
import { AuthSection } from './components/sections/AuthSection';
import { SignupSection } from './components/sections/SignupSection';
import { PDFSection } from './components/sections/PDFSection';
import { VerificationSection } from './components/sections/VerificationSection';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class App {
  constructor() {
    // Inject styles
    Styles.inject();
    
    // Initialize router
    this.router = new Router();
    
    // Create UI components
    this.createUI();
    
    // Initialize components
    this.auth = new Auth(this.router);
    this.pdfViewer = new PDFViewer();
    
    // Check initial session
    this.checkSession();
  }

  createUI() {
    // Create main container
    const container = document.createElement('div');
    container.id = 'app-container';
    document.getElementById('app').appendChild(container);

    // Create auth section
    const authSection = new AuthSection();
    container.appendChild(authSection.render());

    // Create signup section
    const signupSection = new SignupSection();
    container.appendChild(signupSection.render());

    // Create verification section
    const verificationSection = new VerificationSection();
    container.appendChild(verificationSection.render());

    // Create PDF section
    const pdfSection = new PDFSection();
    container.appendChild(pdfSection.render());
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

// Initialize the app
new App(); 