export class Router {
  constructor() {
    this.routes = {
      '/': 'auth',
      '/pdf': 'pdf'
    };
    this.currentView = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', this.handleRouteChange.bind(this));
    
    // Handle initial load
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
    const view = this.routes[path] || 'auth';
    
    if (this.currentView !== view) {
      this.currentView = view;
      this.updateView(view);
    }
  }

  updateView(view) {
    // Hide all sections
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('pdf-section').style.display = 'none';

    // Show the current view
    document.getElementById(`${view}-section`).style.display = 'block';
  }

  navigateTo(path) {
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }
} 