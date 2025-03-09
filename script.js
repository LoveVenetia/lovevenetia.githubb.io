document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Remove old cursor elements
  const oldCursor = document.querySelector('.cursor');
  const oldCursorFollower = document.querySelector('.cursor-follower');
  if (oldCursor) oldCursor.remove();
  if (oldCursorFollower) oldCursorFollower.remove();
  
  // Create heat trail cursor effect
  const cursorContainer = document.createElement('div');
  cursorContainer.className = 'cursor-container';
  document.body.appendChild(cursorContainer);
  
  // Create cursor dot
  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  document.body.appendChild(cursor);
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Particles array
  const particles = [];
  
  // Tracking previous positions for smoother trail
  const previousPositions = [];
  const maxPrevPositions = 5;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor dot position
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    // Store previous positions for trail effect
    previousPositions.unshift({ x: mouseX, y: mouseY });
    if (previousPositions.length > maxPrevPositions) {
      previousPositions.pop();
    }
    
    // Create heat particle at an interval
    if (Math.random() < 0.3) {
      createHeatParticle();
    }
  });
  
  // Create heat particle
  function createHeatParticle() {
    // Use a previous position for smoother trail
    const index = Math.floor(Math.random() * Math.min(previousPositions.length, 3));
    const position = previousPositions[index] || { x: mouseX, y: mouseY };
    
    const particle = document.createElement('div');
    particle.className = 'heat-particle';
    
    // Randomize particle properties
    const size = Math.random() * 15 + 5;
    const duration = Math.random() * 1 + 0.5;
    const xOffset = (Math.random() - 0.5) * 20;
    const yOffset = (Math.random() - 0.5) * 20;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${position.x + xOffset}px`;
    particle.style.top = `${position.y + yOffset}px`;
    
    // Add to DOM
    cursorContainer.appendChild(particle);
    
    // Animate and remove
    gsap.to(particle, {
      opacity: 0,
      scale: 0,
      duration: duration,
      onComplete: () => {
        particle.remove();
      }
    });
  }
  
  // Create heart particle on click
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      createHeartParticle(e.clientX, e.clientY);
    }
  });
  
  function createHeartParticle(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '♥';
    
    // Randomize properties
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 1.5 + 1;
    const xOffset = (Math.random() - 0.5) * 60;
    const yOffset = (Math.random() - 0.5) * 60;
    
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${size}px`;
    
    // Add to DOM
    cursorContainer.appendChild(heart);
    
    // Animate and remove
    gsap.to(heart, {
      x: xOffset,
      y: yOffset - 100,
      opacity: 0,
      duration: duration,
      ease: "power2.out",
      onComplete: () => {
        heart.remove();
      }
    });
  }
  
  // Custom cursor effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .stat-card, input, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
  
  // Smooth scroll navigation
  const scrollContainer = document.querySelector('.scroll-container');
  const sections = document.querySelectorAll('.panel');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Get all section positions
  const sectionPositions = Array.from(sections).map(section => {
    return {
      id: section.id,
      top: section.offsetTop
    };
  });
  
  // Update navigation progress bar
  const navProgress = document.querySelector('.nav-progress');
  
  scrollContainer.addEventListener('scroll', () => {
    // Update progress bar
    const scrollPercentage = (scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight)) * 100;
    navProgress.style.width = `${scrollPercentage}%`;
    
    // Update active nav link
    const currentPosition = scrollContainer.scrollTop;
    
    // Find the current section
    let currentSection = sectionPositions[0].id;
    
    sectionPositions.forEach(section => {
      if (currentPosition >= section.top - 100) {
        currentSection = section.id;
      }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
  
  // Smooth scroll to sections
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      scrollContainer.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      });
    });
  });
  
  // Digital Globe Effect - Initialize immediately
  const initDigitalGlobe = () => {
    console.log("Initializing digital globe...");
    const globeDotsContainer = document.querySelector('.globe-dots');
    const globeConnectionsContainer = document.querySelector('.globe-connections');
    
    if (!globeDotsContainer) {
      console.log("Globe dots container not found");
      return;
    }
    
    // Clear any existing dots
    globeDotsContainer.innerHTML = '';
    globeConnectionsContainer.innerHTML = '';
    
    // Generate random dots on the globe
    const numDots = 60;
    const dots = [];
    const highlightDots = [];
    const radius = 125; // Half the globe width
    
    // Generate main highlight dot for Helsinki
    const helsinkiDot = createDotElement(60, 30, true);
    dots.push({ x: 60, y: 30, el: helsinkiDot });
    highlightDots.push({ x: 60, y: 30, el: helsinkiDot });
    globeDotsContainer.appendChild(helsinkiDot);
    
    // Generate other highlight dots for key music cities
    const musicCities = [
      { x: 45, y: 50 },  // London
      { x: 20, y: 40 },  // New York
      { x: 75, y: 60 },  // Tokyo
      { x: 50, y: 25 },  // Stockholm
      { x: 48, y: 45 }   // Berlin
    ];
    
    musicCities.forEach(city => {
      const dot = createDotElement(city.x, city.y, true);
      dots.push({ x: city.x, y: city.y, el: dot });
      highlightDots.push({ x: city.x, y: city.y, el: dot });
      globeDotsContainer.appendChild(dot);
    });
    
    // Generate regular dots
    for (let i = 0; i < numDots; i++) {
      // Generate dot within circle bounds
      let x, y, distFromCenter;
      do {
        x = Math.random() * 100;
        y = Math.random() * 100;
        const centerX = 50;
        const centerY = 50;
        distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      } while (distFromCenter > 45); // Keep dots within radius
      
      const dot = createDotElement(x, y, false);
      dots.push({ x, y, el: dot });
      globeDotsContainer.appendChild(dot);
    }
    
    // Create connections between highlight dots
    highlightDots.forEach((dot1, i) => {
      highlightDots.forEach((dot2, j) => {
        if (i < j) { // Connect each pair only once
          createConnection(dot1, dot2, globeConnectionsContainer);
        }
      });
    });
    
    // Rotate the globe over time
    let angle = 0;
    const rotateGlobe = () => {
      // Slight wobble effect
      const wobbleX = Math.sin(Date.now() / 2000) * 5;
      const wobbleY = Math.cos(Date.now() / 3000) * 3;
      
      const globe = document.querySelector('.digital-globe');
      if (globe) {
        globe.style.transform = `rotateY(${wobbleX}deg) rotateX(${wobbleY}deg)`;
      }
      
      requestAnimationFrame(rotateGlobe);
    };
    
    rotateGlobe();
    console.log("Digital globe initialized successfully");
  };
  
  // Explicitly call the globe initialization
  setTimeout(initDigitalGlobe, 500);
  
  // Re-initialize globe when About section enters viewport
  ScrollTrigger.create({
    trigger: "#about",
    scroller: scrollContainer,
    start: "top center",
    onEnter: initDigitalGlobe,
    onEnterBack: initDigitalGlobe
  });
  
  function createDotElement(x, y, isHighlight) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const formatter = new Intl.NumberFormat('en-US');
    
    function updateCounter() {
      start += increment;
      
      if (start >= target) {
        // Format large numbers with + for million+
        if (target >= 1000000) {
          element.textContent = (target / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
          element.textContent = formatter.format(Math.floor(target));
        } else {
          element.textContent = formatter.format(target);
        }
        return;
      }
      
      // Format large numbers with + for million+
      if (target >= 1000000) {
        if (start >= 1000000) {
          element.textContent = (start / 1000000).toFixed(1) + 'M+';
        } else {
          element.textContent = formatter.format(Math.floor(start));
        }
      } else if (target >= 1000) {
        element.textContent = formatter.format(Math.floor(start));
      } else {
        element.textContent = Math.floor(start);
      }
      
      requestAnimationFrame(updateCounter);
    }
    
    updateCounter();
  }
  
  // Animate elements on scroll
  sections.forEach((section, index) => {
    const elements = section.querySelectorAll('.content-wrapper > *');
    
    gsap.from(elements, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        scroller: scrollContainer,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });
    
    // Animate stat counters when stats section is visible
    if (section.id === 'stats') {
      ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainer,
        start: "top center",
        onEnter: () => {
          statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, targetValue, 2000);
          });
        },
        onEnterBack: () => {
          statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, targetValue, 2000);
          });
        }
      });
    }
  });
  
  // Initialize glitch effect
  const glitchElement = document.querySelector('.glitch');
  glitchElement.setAttribute('data-text', glitchElement.textContent);
  
  // Audio visualizer animation (simulated)
  setInterval(() => {
    const visualizerBars = document.querySelectorAll('.audio-visualizer span');
    visualizerBars.forEach(bar => {
      const randomHeight = Math.floor(Math.random() * 70) + 10;
      bar.style.height = `${randomHeight}px`;
    });
  }, 100);
  
  // Digital Globe Effect
  const initDigitalGlobe = () => {
    const globeDotsContainer = document.querySelector('.globe-dots');
    const globeConnectionsContainer = document.querySelector('.globe-connections');
    
    if (!globeDotsContainer) return;
    
    // Clear any existing dots
    globeDotsContainer.innerHTML = '';
    globeConnectionsContainer.innerHTML = '';
    
    // Generate random dots on the globe
    const numDots = 60;
    const dots = [];
    const highlightDots = [];
    const radius = 125; // Half the globe width
    
    // Generate main highlight dot for Helsinki
    const helsinkiDot = createDotElement(60, 30, true);
    dots.push({ x: 60, y: 30, el: helsinkiDot });
    highlightDots.push({ x: 60, y: 30, el: helsinkiDot });
    globeDotsContainer.appendChild(helsinkiDot);
    
    // Generate other highlight dots for key music cities
    const musicCities = [
      { x: 45, y: 50 },  // London
      { x: 20, y: 40 },  // New York
      { x: 75, y: 60 },  // Tokyo
      { x: 50, y: 25 },  // Stockholm
      { x: 48, y: 45 }   // Berlin
    ];
    
    musicCities.forEach(city => {
      const dot = createDotElement(city.x, city.y, true);
      dots.push({ x: city.x, y: city.y, el: dot });
      highlightDots.push({ x: city.x, y: city.y, el: dot });
      globeDotsContainer.appendChild(dot);
    });
    
    // Generate regular dots
    for (let i = 0; i < numDots; i++) {
      // Generate dot within circle bounds
      let x, y, distFromCenter;
      do {
        x = Math.random() * 100;
        y = Math.random() * 100;
        const centerX = 50;
        const centerY = 50;
        distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      } while (distFromCenter > 45); // Keep dots within radius
      
      const dot = createDotElement(x, y, false);
      dots.push({ x, y, el: dot });
      globeDotsContainer.appendChild(dot);
    }
    
    // Create connections between highlight dots
    highlightDots.forEach((dot1, i) => {
      highlightDots.forEach((dot2, j) => {
        if (i < j) { // Connect each pair only once
          createConnection(dot1, dot2, globeConnectionsContainer);
        }
      });
    });
    
    // Rotate the globe over time
    let angle = 0;
    const rotateGlobe = () => {
      // Slight wobble effect
      const wobbleX = Math.sin(Date.now() / 2000) * 5;
      const wobbleY = Math.cos(Date.now() / 3000) * 3;
      
      document.querySelector('.digital-globe').style.transform = 
        `rotateY(${wobbleX}deg) rotateX(${wobbleY}deg)`;
      
      requestAnimationFrame(rotateGlobe);
    };
    
    rotateGlobe();
  };
  
  function createDotElement(x, y, isHighlight) {
    const dot = document.createElement('div');
    dot.className = isHighlight ? 'globe-dot highlight' : 'globe-dot';
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    
    if (isHighlight) {
      // Add pulse animation for highlight dots
      dot.style.animation = 'blink 2s infinite';
    }
    
    return dot;
  }
  
  function createConnection(dot1, dot2, container) {
    const connection = document.createElement('div');
    connection.className = 'globe-connection';
    
    // Calculate position and length
    const x1 = dot1.x;
    const y1 = dot1.y;
    const x2 = dot2.x;
    const y2 = dot2.y;
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Set connection style
    connection.style.width = `${length}%`;
    connection.style.left = `${x1}%`;
    connection.style.top = `${y1}%`;
    connection.style.transform = `rotate(${angle}deg)`;
    
    // Set random animation delay
    connection.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(connection);
    return connection;
  }
  
  // Initialize the digital globe
  initDigitalGlobe();
  
  // Form input animation
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.parentElement.classList.remove('focused');
      }
    });
  });
  
  // Initialize scrolling to first section
  currentSectionIndex = 0;
});
