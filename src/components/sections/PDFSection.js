export class PDFSection {
  constructor() {
    this.pdfUrl = import.meta.env.VITE_PDF_URL;
    this.currentPage = 1;
    this.pdfDoc = null;
    this.scale = 1.5;
    this.controls = null;
    this.isRendering = false;
    this.zoomLevel = 1.0;
    this.minZoom = 0.5;
    this.maxZoom = 3.0;
    this.zoomStep = 0.25;
  }

  render() {
    const section = document.createElement('section');
    section.id = 'pdf-section';
    section.style.display = 'block';
    section.style.width = '100%';
    section.style.height = '100vh';
    section.style.position = 'fixed';
    section.style.top = '0';
    section.style.left = '0';
    section.style.backgroundColor = '#ffffff';

    // Create container for PDF viewer
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.margin = '0 auto';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    // Create controls container
    this.controls = document.createElement('div');
    this.controls.style.padding = '10px';
    this.controls.style.backgroundColor = '#f0f0f0';
    this.controls.style.display = 'flex';
    this.controls.style.justifyContent = 'center';
    this.controls.style.gap = '10px';
    this.controls.style.alignItems = 'center';

    // Create zoom controls
    const zoomOutButton = document.createElement('button');
    zoomOutButton.textContent = '-';
    zoomOutButton.style.padding = '5px 10px';
    zoomOutButton.style.fontSize = '16px';
    zoomOutButton.onclick = () => this.zoomOut();

    const zoomInButton = document.createElement('button');
    zoomInButton.textContent = '+';
    zoomInButton.style.padding = '5px 10px';
    zoomInButton.style.fontSize = '16px';
    zoomInButton.onclick = () => this.zoomIn();

    const zoomLevel = document.createElement('span');
    zoomLevel.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    zoomLevel.style.minWidth = '50px';
    zoomLevel.style.textAlign = 'center';

    // Create page navigation buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => this.showPage(this.currentPage - 1);
    prevButton.disabled = true;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => this.showPage(this.currentPage + 1);

    const pageInfo = document.createElement('span');
    pageInfo.id = 'page-info';
    pageInfo.textContent = 'Page 1 of 1';

    // Add controls to container
    this.controls.appendChild(zoomOutButton);
    this.controls.appendChild(zoomLevel);
    this.controls.appendChild(zoomInButton);
    
    // Create spacer element
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    this.controls.appendChild(spacer);
    
    this.controls.appendChild(prevButton);
    this.controls.appendChild(pageInfo);
    this.controls.appendChild(nextButton);

    // Create viewer container
    const viewerContainer = document.createElement('div');
    viewerContainer.id = 'viewerContainer';
    viewerContainer.style.flex = '1';
    viewerContainer.style.overflow = 'auto';
    viewerContainer.style.position = 'relative';

    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvasContainer';
    canvasContainer.style.width = '100%';
    canvasContainer.style.minHeight = '100%';
    canvasContainer.style.display = 'flex';
    canvasContainer.style.flexDirection = 'column';
    canvasContainer.style.alignItems = 'center';
    canvasContainer.style.padding = '20px';

    viewerContainer.appendChild(canvasContainer);
    container.appendChild(this.controls);
    container.appendChild(viewerContainer);
    section.appendChild(container);

    // Load PDF.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      // Initialize PDF.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      // Load the PDF
      pdfjsLib.getDocument({
        url: this.pdfUrl,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/cmaps/',
        cMapPacked: true
      }).promise.then(pdf => {
        this.pdfDoc = pdf;
        pageInfo.textContent = `Page 1 of ${pdf.numPages}`;
        this.renderAllPages();
        
        // Update button states
        prevButton.disabled = true;
        nextButton.disabled = pdf.numPages <= 1;

        // Handle window resize
        window.addEventListener('resize', () => {
          this.renderAllPages();
        });
      }).catch(error => {
        console.error('Error loading PDF:', error);
        viewerContainer.innerHTML = `
          <div style="color: red; text-align: center; padding: 20px;">
            Error loading PDF: ${error.message}
            <br>
            <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Try Again
            </button>
          </div>
        `;
      });
    };
    document.head.appendChild(script);

    return section;
  }

  async renderAllPages() {
    if (!this.pdfDoc || this.isRendering) return;
    
    this.isRendering = true;
    const canvasContainer = document.getElementById('canvasContainer');
    
    try {
      // Wait for the next frame to ensure container is ready
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Clear existing pages
      canvasContainer.innerHTML = '';
      
      // Ensure container has a valid width
      const containerWidth = Math.max(canvasContainer.clientWidth, 100);
      
      // Create an array to store all page promises
      const pagePromises = [];
      
      // Render pages sequentially to maintain order
      for (let i = 1; i <= this.pdfDoc.numPages; i++) {
        await this.renderPage(i, containerWidth);
      }
    } catch (error) {
      console.error('Error rendering pages:', error);
    } finally {
      this.isRendering = false;
    }
  }

  async renderPage(pageNum, containerWidth) {
    try {
      const page = await this.pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: this.scale });
      
      // Calculate scale to fit container width while maintaining aspect ratio
      const baseScale = Math.min(containerWidth / viewport.width, 2.0);
      const scale = baseScale * this.zoomLevel; // Apply zoom level
      const adjustedViewport = page.getViewport({ scale });

      // Ensure valid dimensions
      const canvasWidth = Math.max(1, Math.floor(adjustedViewport.width));
      const canvasHeight = Math.max(1, Math.floor(adjustedViewport.height));

      const canvas = document.createElement('canvas');
      canvas.id = `page-${pageNum}`;
      canvas.style.width = '100%';
      canvas.style.maxWidth = `${canvasWidth}px`;
      canvas.style.marginBottom = '20px';
      canvas.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      
      // Set canvas dimensions
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const context = canvas.getContext('2d');
      const renderContext = {
        canvasContext: context,
        viewport: adjustedViewport
      };

      await page.render(renderContext).promise;
      document.getElementById('canvasContainer').appendChild(canvas);
    } catch (error) {
      console.error(`Error rendering page ${pageNum}:`, error);
      // Add error placeholder
      const errorDiv = document.createElement('div');
      errorDiv.textContent = `Error loading page ${pageNum}`;
      errorDiv.style.color = 'red';
      errorDiv.style.padding = '20px';
      document.getElementById('canvasContainer').appendChild(errorDiv);
    }
  }

  showPage(pageNum) {
    if (pageNum < 1 || pageNum > this.pdfDoc.numPages) return;
    
    this.currentPage = pageNum;
    const pageInfo = document.getElementById('page-info');
    const prevButton = this.controls.querySelector('button:nth-last-child(3)');
    const nextButton = this.controls.querySelector('button:nth-last-child(1)');

    if (pageInfo) {
      pageInfo.textContent = `Page ${pageNum} of ${this.pdfDoc.numPages}`;
    }
    if (prevButton) {
      prevButton.disabled = pageNum === 1;
    }
    if (nextButton) {
      nextButton.disabled = pageNum === this.pdfDoc.numPages;
    }

    // Scroll to the page
    const pageCanvas = document.getElementById(`page-${pageNum}`);
    if (pageCanvas) {
      pageCanvas.scrollIntoView({ behavior: 'smooth' });
    }
  }

  zoomIn() {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
      this.updateZoom();
    }
  }

  zoomOut() {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
      this.updateZoom();
    }
  }

  updateZoom() {
    const zoomLevel = this.controls.querySelector('span:nth-child(2)');
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
    this.renderAllPages();
  }
} 