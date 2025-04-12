export class Router {
  constructor() {
    this.routes = {
      '/q-ndpdf': 'auth',
      '/q-ndpdf/signup': 'signup',
      '/q-ndpdf/pdf': 'pdf'
    };
    this.currentRoute = window.location.pathname;
    this.setupEventListeners();
    // Force initial route to auth
    window.history.replaceState({}, '', '/');
    this.handleRouteChange();
  }

  setupEventListeners() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
      this.navigateTo(this.currentRoute);
    });
  }

  handleRouteChange() {
    const path = window.location.pathname;
    this.updateView(path);
  }

  updateView(path) {
    // Hide all sections first
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.display = 'none';
    });

    // Show the appropriate section based on the route
    const view = this.routes[path] || 'auth'; // Default to auth if route not found
    const section = document.getElementById(`${view}-section`);
    if (section) {
      section.style.display = 'block';
    }
  }

  navigateTo(route) {
    console.log('Navigating to:', route); // Debug log
    
    // Hide all sections first
    document.querySelectorAll('section').forEach(section => {
      section.style.display = 'none';
    });

    // Show the appropriate section based on the route
    const sectionId = this.routes[route];
    if (sectionId) {
      const section = document.getElementById(`${sectionId}-section`);
      if (section) {
        console.log('Showing section:', sectionId); // Debug log
        section.style.display = 'block';
      } else {
        console.error('Section not found:', sectionId); // Debug log
      }
    }

    // Update browser history
    window.history.pushState({}, '', route);
  }
} 