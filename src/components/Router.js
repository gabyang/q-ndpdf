export class Router {
  constructor() {
    this.routes = {
      '/': 'auth',
      '/signup': 'signup',
      '/pdf': 'pdf'
    };
    this.setupEventListeners();
    // Force initial route to auth
    window.history.replaceState({}, '', '/');
    this.handleRouteChange();
  }

  setupEventListeners() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
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

  navigateTo(path) {
    // Update browser history without page reload
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }
} 