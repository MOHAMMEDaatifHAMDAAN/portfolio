/* ==========================================================================
   MOHAMMED AATIF HAMDAAN A - PORTFOLIO INTERACTIVITY SCRIPT
   High-performance particle canvas, audio simulator, Power BI demo,
   Computer Vision fish classifier demo, case study & certificate modals.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initNavigation();
  initSkillsFilter();
  initBabyCrySimulator();
  initPowerBiSimulator();
  initFishCvSimulator();
  initModalSystem();
  initContactSystem();
  initScrollReveal();
  initBackToTop();
});

/* ==========================================================================
   1. Ambient Particle Canvas Animation
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(139, 92, 246, 0.35)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse repulsion
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let dirX = dx / dist;
          let dirY = dy / dist;
          this.x -= dirX * force * 3;
          this.y -= dirY * force * 3;
        }
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Navigation, Sticky Header & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      const expanded = mobileToggle.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Scroll Spy for active nav link
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   3. Skills Category Filtering
   ========================================================================== */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Project 1: Baby Cry Analysis Interactive Pipeline Simulator
   ========================================================================== */
function initBabyCrySimulator() {
  const playBtn = document.getElementById('play-audio-sim');
  const specBars = document.querySelectorAll('.spec-bar-elem');
  const patternCards = document.querySelectorAll('.cry-pattern-card');
  const pipelineNodes = document.querySelectorAll('.pipeline-node');
  let isPlaying = false;
  let animInterval = null;
  let currentPatternIndex = 0;

  const patterns = [
    { name: 'Hunger Cry', index: 0 },
    { name: 'Pain Cry', index: 1 },
    { name: 'Discomfort', index: 2 },
    { name: 'Sleep / Tired', index: 3 }
  ];

  if (!playBtn) return;

  function updateVisuals() {
    specBars.forEach(bar => {
      const randomHeight = Math.floor(Math.random() * 85) + 15;
      bar.style.height = `${randomHeight}%`;
    });

    const stepIdx = Math.floor((Date.now() / 600) % 4);
    pipelineNodes.forEach((node, i) => {
      if (i === stepIdx) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  function cyclePattern() {
    currentPatternIndex = (currentPatternIndex + 1) % patterns.length;
    patternCards.forEach((card, idx) => {
      if (idx === currentPatternIndex) {
        card.classList.add('highlight');
        card.querySelector('.status').innerHTML = '<span>● Detected</span>';
      } else {
        card.classList.remove('highlight');
        card.querySelector('.status').innerHTML = '<span>Standby</span>';
      }
    });
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        Pause Pipeline
      `;
      playBtn.classList.add('btn-primary');
      playBtn.classList.remove('btn-outline');
      animInterval = setInterval(updateVisuals, 180);
      setInterval(cyclePattern, 2400);
    } else {
      playBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Simulate Pipeline
      `;
      playBtn.classList.remove('btn-primary');
      playBtn.classList.add('btn-outline');
      clearInterval(animInterval);
    }
  });
}

/* ==========================================================================
   5. Project 2: Power BI Interactive Mockup Dashboard
   ========================================================================== */
function initPowerBiSimulator() {
  const filterBtns = document.querySelectorAll('.dash-filter-btn');
  const kpiSales = document.getElementById('kpi-sales-val');
  const kpiOrders = document.getElementById('kpi-orders-val');
  const kpiAov = document.getElementById('kpi-aov-val');
  const mockBars = document.querySelectorAll('.mock-bar-item');

  const categoryData = {
    'all': {
      sales: '₹4.82 Cr',
      orders: '182.4K',
      aov: '₹264',
      barHeights: [45, 75, 60, 95, 80, 65, 88]
    },
    'groceries': {
      sales: '₹2.35 Cr',
      orders: '94.1K',
      aov: '₹250',
      barHeights: [70, 90, 85, 100, 75, 80, 95]
    },
    'dairy': {
      sales: '₹1.45 Cr',
      orders: '56.8K',
      aov: '₹255',
      barHeights: [35, 55, 65, 80, 60, 50, 70]
    },
    'beverages': {
      sales: '₹1.02 Cr',
      orders: '31.5K',
      aov: '₹324',
      barHeights: [25, 45, 40, 60, 50, 45, 55]
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat') || 'all';
      const data = categoryData[cat] || categoryData['all'];

      if (kpiSales) kpiSales.textContent = data.sales;
      if (kpiOrders) kpiOrders.textContent = data.orders;
      if (kpiAov) kpiAov.textContent = data.aov;

      mockBars.forEach((bar, idx) => {
        bar.style.height = `${data.barHeights[idx]}%`;
      });
    });
  });
}

/* ==========================================================================
   6. Project 3: Computer Vision Fish Species Classification Interactive Demo
   ========================================================================== */
function initFishCvSimulator() {
  const slicerBtns = document.querySelectorAll('.cv-slicer-btn');
  const targetLabel = document.getElementById('cv-target-label');
  const confVal = document.getElementById('cv-confidence-val');
  const speciesVal = document.getElementById('cv-species-val');
  const latencyVal = document.getElementById('cv-latency-val');
  const fishGraphic = document.getElementById('cv-fish-graphic');

  const speciesInfo = {
    'gilt-head': {
      name: 'Gilt-Head Bream',
      confidence: '95.8%',
      latency: '28ms',
      emoji: '🐟'
    },
    'red-sea': {
      name: 'Red Sea Bream',
      confidence: '94.6%',
      latency: '26ms',
      emoji: '🐠'
    },
    'sea-bass': {
      name: 'Sea Bass',
      confidence: '96.2%',
      latency: '30ms',
      emoji: '🐟'
    },
    'trout': {
      name: 'Trout',
      confidence: '95.1%',
      latency: '25ms',
      emoji: '🎣'
    },
    'salmon': {
      name: 'Salmon',
      confidence: '97.4%',
      latency: '27ms',
      emoji: '🐟'
    }
  };

  slicerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slicerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.getAttribute('data-species') || 'gilt-head';
      const info = speciesInfo[key] || speciesInfo['gilt-head'];

      if (targetLabel) targetLabel.textContent = `${info.name} • ${info.confidence}`;
      if (confVal) confVal.textContent = info.confidence;
      if (speciesVal) speciesVal.textContent = info.name;
      if (latencyVal) latencyVal.textContent = info.latency;
      if (fishGraphic) fishGraphic.textContent = info.emoji;
    });
  });
}

/* ==========================================================================
   7. Modal Case Study System & Certificate Lightbox
   ========================================================================== */
function initModalSystem() {
  const modalOverlay = document.getElementById('case-modal-overlay');
  const modalTitle = document.getElementById('modal-case-title');
  const modalTag = document.getElementById('modal-case-tag');
  const modalBody = document.getElementById('modal-case-body');
  const closeBtn = document.getElementById('modal-case-close');
  const openButtons = document.querySelectorAll('[data-open-case]');

  const caseStudies = {
    'baby-cry': {
      tag: 'AI / Machine Learning & Audio Signal Processing',
      title: 'Baby Cry Analysis — Intelligent Infant Cry Classification',
      content: `
        <div class="case-section">
          <h4 class="case-sec-title">Problem</h4>
          <p class="case-desc">Infants communicate their physiological and emotional needs exclusively through crying. Inexperienced parents and caregivers often face challenges distinguishing whether a cry indicates hunger, pain, discomfort, or fatigue, leading to caregiver stress and delayed response to critical distress.</p>
        </div>
        
        <div class="case-section">
          <h4 class="case-sec-title">Objective</h4>
          <p class="case-desc">Design and implement an intelligent, automated infant cry classification system using Deep Learning and acoustic feature extraction to accurately classify infant audio signals into distinct behavioral categories in real-time.</p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Approach</h4>
          <ul class="case-points">
            <li>Preprocessed labeled infant audio datasets with noise filtering and audio augmentation to enhance robustness.</li>
            <li>Extracted acoustic representations including Mel-Frequency Cepstral Coefficients (MFCCs) and Spectrograms.</li>
            <li>Architected and trained Convolutional Neural Network (CNN) models tailored for frequency-temporal patterns.</li>
            <li>Built an end-to-end inference pipeline for rapid audio ingestion and classification.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Technologies Used</h4>
          <p class="case-desc"><strong>Python, Deep Learning, CNN, TensorFlow, Keras, MFCC, Librosa, Audio Processing</strong></p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">My Contribution</h4>
          <ul class="case-points">
            <li>Led the feature engineering phase, transforming raw audio waveforms into 2D time-frequency spectrograms and MFCC matrices.</li>
            <li>Trained, fine-tuned, and validated CNN architectures using TensorFlow and Keras.</li>
            <li>Applied audio data augmentation techniques (pitch shifting, time stretching, background noise injection) to improve real-world reliability.</li>
            <li>Implemented the classification module for multi-class detection (Hunger, Pain, Discomfort, Sleep).</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Key Features</h4>
          <ul class="case-points">
            <li>Acoustic feature extraction transforming continuous sound to MFCC and spectrogram tensors.</li>
            <li>Multi-category infant distress classification (Hunger, Pain, Discomfort, Sleep).</li>
            <li>Real-time audio processing pipeline designed for low-latency inference.</li>
            <li>Augmentation pipeline built for handling real-world acoustic variance.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Outcome & Learning</h4>
          <p class="case-desc">Successfully demonstrated the practical application of deep convolutional neural networks in biomedical acoustic signal classification. Gained deep hands-on expertise in audio feature engineering, deep learning model architecture, and real-time inference optimization.</p>
        </div>
      `
    },
    'fish-species': {
      tag: 'Computer Vision | Transfer Learning | Deep Learning',
      title: 'Fish Species Classification Using Transfer Learning',
      content: `
        <div class="case-section">
          <h4 class="case-sec-title">Problem</h4>
          <p class="case-desc">Manual identification of fish species from imagery is time-consuming, subjective, and requires specialized marine biology and fisheries domain expertise.</p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Objective</h4>
          <p class="case-desc">Build an automated, high-precision image classification system capable of identifying diverse fish species using deep convolutional neural networks and transfer learning.</p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Approach</h4>
          <ul class="case-points">
            <li><strong>Data Preparation & Labeling:</strong> Curated and preprocessed a labeled multi-class fish image dataset.</li>
            <li><strong>Data Augmentation:</strong> Applied rotation, zoom, horizontal flips, and contrast adjustments to improve generalization on unseen images.</li>
            <li><strong>Pre-trained Base Model:</strong> Utilized MobileNetV2 pre-trained on ImageNet as an efficient convolutional feature extractor.</li>
            <li><strong>Fine-Tuning:</strong> Replaced the top classification layers with custom global average pooling, dropout, and Dense softmax layers tailored to fish categories.</li>
            <li><strong>Evaluation:</strong> Assessed performance using validation loss and multi-class accuracy curves.</li>
            <li><strong>Real-Time Inference:</strong> Integrated an inference engine supporting instantaneous classification of image uploads.</li>
            <li><strong>Monitoring:</strong> Monitored convergence, gradient stability, and validation metrics during training.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Technologies Used</h4>
          <p class="case-desc"><strong>Python, TensorFlow, Keras, MobileNetV2, Transfer Learning, CNN, Computer Vision, Image Classification, Data Augmentation</strong></p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Result</h4>
          <p class="case-desc">The fine-tuned MobileNetV2 model achieved approximately <strong>95% validation accuracy</strong>, demonstrating robust classification across diverse fish species with low computational overhead.</p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Key Learning</h4>
          <p class="case-desc">Gained practical, end-to-end expertise in Transfer Learning workflows, CNN-based image classification, computer vision pipelines, hyperparameter fine-tuning, data augmentation strategies, and TensorFlow/Keras production implementation.</p>
        </div>
      `
    },
    'baby-cry-research': {
      tag: 'Research Publication | Artificial Intelligence | Deep Learning',
      title: 'Baby Cry Analyzer Using Deep Learning and Mobile Computing: An End-to-End Intelligent Infant Care System',
      content: `
        <div class="case-section">
          <h4 class="case-sec-title">Research Topic</h4>
          <p class="case-desc"><strong>End-to-End Intelligent Infant Care System Leveraging Acoustic Signal Processing, Deep Convolutional Neural Networks, and Mobile Computing Architectures.</strong></p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Problem Addressed</h4>
          <p class="case-desc">Infant cry interpretation remains a non-trivial challenge for parents, caregivers, and pediatric healthcare professionals. Conventional methods rely on subjective auditory assessment, which can be inconsistent, slow, and prone to misinterpretation under stressful conditions. There is a strong need for an automated, accessible, mobile-integrated diagnostic system capable of real-time acoustic classification.</p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Proposed Intelligent System Architecture</h4>
          <ul class="case-points">
            <li><strong>Audio Capture & Preprocessing:</strong> Ambient noise suppression and signal normalization.</li>
            <li><strong>Feature Engineering Pipeline:</strong> Extraction of Mel-Frequency Cepstral Coefficients (MFCC) and Time-Frequency Spectrogram matrices.</li>
            <li><strong>Deep Learning Core:</strong> Multi-layer 2D Convolutional Neural Network (CNN) trained on labeled acoustic datasets.</li>
            <li><strong>Classification Engine:</strong> Probabilistic mapping across primary distress states (Hunger, Pain, Discomfort, Sleep).</li>
            <li><strong>Mobile Computing Layer:</strong> Low-latency edge/mobile deployment delivering instantaneous recommendations to caregivers.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Technologies & Methodologies</h4>
          <p class="case-desc"><strong>Deep Learning, CNN-based Audio Classification, MFCC & Spectrogram Analysis, Audio Signal Processing, Mobile Computing, Real-Time Audio Analysis, Python, TensorFlow, Keras.</strong></p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Key Research Contributions</h4>
          <ul class="case-points">
            <li>Formulated an end-to-end framework integrating advanced acoustic signal processing with deep convolutional representations.</li>
            <li>Evaluated audio data augmentation strategies (time stretching, pitch shifting) to address dataset scarcity and acoustic background interference.</li>
            <li>Demonstrated the feasibility of deploying intelligent acoustic inference onto lightweight mobile computing environments for practical healthcare assistance.</li>
          </ul>
        </div>
      `
    },
    'icisd-certificate': {
      tag: 'Academic Conference Achievement — Official Certificate',
      title: 'ICISD’26 — Certificate of Participation',
      content: `
        <div class="cert-lightbox-full">
          <div class="cert-lightbox-img-wrapper">
            <img src="assets/icisd_certificate.jpg" alt="ICISD'26 Certificate of Participation - Mohammed Aatif Hamdaan A">
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 18px; border-radius: 10px; width: 100%; text-align: left;">
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">International Conference on Intelligent Systems and Digital Transformation (ICISD’26)</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 4px;"><strong>Participant:</strong> Mohammed Aatif Hamdaan A</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 4px;"><strong>Organized By:</strong> Department of Computer Science and Engineering, SRM Institute of Science and Technology, Vadapalani Campus, Chennai</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 4px;"><strong>Dates:</strong> 6th & 7th April 2026</div>
            <div style="font-size: 0.85rem; color: #cbd5e1;"><strong>Affiliated Institution:</strong> Rajalakshmi Institute of Technology</div>
          </div>
        </div>
      `
    },
    'zepto-dashboard': {
      tag: 'Data Analytics, Business Intelligence & Data Modeling',
      title: 'Zepto Sales Analysis Dashboard',
      content: `
        <div class="case-section">
          <h4 class="case-sec-title">Problem</h4>
          <p class="case-desc">Quick-commerce businesses require real-time visibility into rapid inventory turnover, localized sales patterns, customer behavior, and delivery category performance to optimize supply chain decisions and enhance revenue margins.</p>
        </div>
        
        <div class="case-section">
          <h4 class="case-sec-title">Objective</h4>
          <p class="case-desc">Develop an interactive, executive-ready Power BI dashboard to transform complex transactional datasets into actionable insights covering sales performance, product mix, order trends, and customer conversion funnels.</p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Approach</h4>
          <ul class="case-points">
            <li>Conducted rigorous data cleaning, missing value handling, and type casting using Power Query.</li>
            <li>Engineered a robust relational star-schema data model connecting dimension and fact tables.</li>
            <li>Formulated custom DAX measures for calculating sales metrics, growth rates, and category contributions.</li>
            <li>Designed a cohesive, user-centered visual hierarchy featuring dynamic KPI cards, funnel charts, and cross-filtering slicers.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Technologies Used</h4>
          <p class="case-desc"><strong>Power BI, Power Query, DAX (Data Analysis Expressions), Microsoft Excel, Data Analytics, Data Modeling</strong></p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">My Contribution</h4>
          <ul class="case-points">
            <li>Performed end-to-end data transformation and ETL workflows using Power Query.</li>
            <li>Structured the relational data model for high-efficiency querying and aggregations.</li>
            <li>Authored customized DAX measures for dynamic KPIs (Total Sales, Average Order Value, Volume Distribution).</li>
            <li>Designed intuitive visual dashboards with interactive slicers, donut charts, and funnel visualizations.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Key Features</h4>
          <ul class="case-points">
            <li>Dynamic KPI cards tracking high-level revenue and volume metrics.</li>
            <li>Interactive bar and line charts analyzing temporal trends and category sales.</li>
            <li>Donut charts illustrating product category breakdown.</li>
            <li>Funnel analysis evaluating customer progression and order completion.</li>
            <li>Multi-dimensional interactive slicers for instant slicing by category, time, and segment.</li>
          </ul>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Outcome & Learning</h4>
          <p class="case-desc">Delivered a business intelligence tool capable of breaking down complex e-commerce data into clear, decision-ready visual stories. Strengthened core capabilities in DAX formulation, dimensional data modeling, and user-centric analytical design.</p>
        </div>
      `
    },
    'resume-view': {
      tag: 'Candidate Curriculum Vitae',
      title: 'Mohammed Aatif Hamdaan A — Professional Profile',
      content: `
        <div class="case-section">
          <h4 class="case-sec-title">Contact & Coordinates</h4>
          <p class="case-desc">
            <strong>Name:</strong> Mohammed Aatif Hamdaan A<br>
            <strong>Positioning:</strong> Computer Science Engineer | AI/ML | Data Analytics | UI/UX | Research<br>
            <strong>Location:</strong> Chennai, Tamil Nadu, India<br>
            <strong>Email:</strong> hmohammedaatif@gmail.com | <strong>Phone:</strong> +91 8668042532<br>
            <strong>LinkedIn:</strong> linkedin.com/in/mohamed-aatif-hamdaan-b182a2249/
          </p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Education</h4>
          <p class="case-desc">
            <strong>B.E. Computer Science and Engineering</strong> (2022 – 2026)<br>
            Rajalakshmi Institute of Technology, Chennai | <strong>CGPA: 7.6</strong>
          </p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Core Competencies</h4>
          <p class="case-desc">
            • <strong>AI / ML:</strong> Deep Learning, CNN, Transfer Learning, MobileNetV2, TensorFlow, Keras, MFCC, Computer Vision, Image Classification<br>
            • <strong>Data & Analytics:</strong> Power BI, Power Query, DAX, Microsoft Excel, Data Modeling, Data Cleaning<br>
            • <strong>Programming:</strong> Python, MySQL, Java, JCL, COBOL<br>
            • <strong>UI/UX:</strong> Figma, Canva, User-Centered Design, Wireframing, High-Fidelity Prototyping<br>
            • <strong>IT & Systems:</strong> Cloud Computing, Git, SDLC, STLC, Networking (TCP/IP)
          </p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Featured Projects & Publications</h4>
          <p class="case-desc">
            • <strong>Research Publication:</strong> Baby Cry Analyzer Using Deep Learning and Mobile Computing: An End-to-End Intelligent Infant Care System<br>
            • <strong>AI Project:</strong> Fish Species Classification Using Transfer Learning (MobileNetV2, ~95% Validation Acc)<br>
            • <strong>AI Project:</strong> Baby Cry Analysis — Intelligent Infant Cry Classification (CNN, MFCC, Spectrograms)<br>
            • <strong>BI Project:</strong> Zepto Sales Analysis Dashboard (Power BI, DAX, KPI Modeling)
          </p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Experience & Internships</h4>
          <p class="case-desc">
            <strong>UI/UX Intern — Parkqwik</strong> (Jan 2025 – Apr 2025)<br>
            Designed user-centered interfaces and prototypes in Figma; facilitated design-to-development handoffs.<br><br>
            <strong>Social Media Intern — Rook</strong> (Jan 2023 – Apr 2023)<br>
            Spearheaded Figma social templates, reducing turnaround time by 40%.
          </p>
        </div>

        <div class="case-section">
          <h4 class="case-sec-title">Certifications & Conferences</h4>
          <p class="case-desc">
            • <strong>ICISD’26:</strong> Certificate of Participation — SRM IST Vadapalani & RIT<br>
            • <strong>Microsoft:</strong> Azure AI Fundamentals<br>
            • <strong>NPTEL:</strong> Cloud Computing<br>
            • <strong>IBM:</strong> Introduction to Cloud Computing
          </p>
        </div>
      `
    }
  };

  function openModal(caseKey) {
    const data = caseStudies[caseKey];
    if (!data) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-case');
      openModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Contact System & Copy to Clipboard
   ========================================================================== */
function initContactSystem() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const contactForm = document.getElementById('contact-form');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#07090e';
        showToast(`Copied to clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      }).catch(() => {
        showToast('Unable to auto-copy. Please copy manually.');
      });
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Build mailto action
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:hmohammedaatif@gmail.com?subject=${subject}&body=${body}`;

      showToast('Opening your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
      contactForm.reset();
    });
  }
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   9. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
