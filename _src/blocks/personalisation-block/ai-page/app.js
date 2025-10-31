import { matchHeights } from '../../../scripts/utils/utils.js';

const callToActionData = [
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/shield-check-star.svg',
    title: 'Redefining Cybersecurity with<br>Agentic AI',
    description: 'By integrating agentic AI in cybersecurity we enhance detection, adaptability, and real-time response, thus defining a new standard in online scam prevention.',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/asset-1-1.svg',
    title: 'Going Towards Human-Centric Cybersecurity',
    description: 'Enhanced with AI, cybersecurity now provides human-centred, context-aware protection that anticipates user needs and supports them through every stage of a scam attempt.',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/map.svg',
    title: 'Mapping Emerging Threat<br>Landscapes',
    description: 'AI detects, analyses, and blocks mobile scam campaigns before they spread, protecting users across regions.',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/rhombus-stack.svg',
    title: 'Anticipating the Behaviour of Tommorow’s Attacks',
    description: 'Combining machine learning and behavioral analysis simplifies the detection of recurring scam patterns, blocks threats in real time, and anticipates future tactics.',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/untitled-2-01-1.svg',
    title: 'Detecting More Complex<br>Scam Patterns',
    description: 'Correlating signals across devices and networks exposes unified attack campaigns spanning emails, fake domains, social media, and messaging apps.',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/untitled-3-01-01-1.svg',
    title: 'Exploring the Future of<br>AI-Driven Cybersecurity',
    description: 'Deepfakes are the new battleground in cybersecurity, a rapidly growing threat driving the next wave of adaptive, AI-powered defense innovation.',
  },
];

const timelineData = [
  {
    year: '2008',
    title: 'First ML-based detection',
    description: 'Bitdefender leveraged ML to improve detection of new or unknown malware.',
    position: 'top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/vector.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-2.svg',
  },
  {
    year: '2011',
    title: 'First noise reduction algorithm',
    description: 'The noise detection algorithm helped identify misclassified samples.',
    position: 'bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/pentagon-curved-line.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-1.svg',
  },
  {
    year: '2013',
    title: 'First ML-based automated stream detection',
    description: 'The first automated stream detection based on ML technologies.',
    position: 'top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/vector-1.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-2.svg',
  },
  {
    year: '2014',
    title: 'First use of deep learning',
    description: 'The first use of deep learning AI algorithms to increase detection rates.',
    position: 'bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/first.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-1.svg',
  },
  {
    year: '2017',
    title: 'Fileless Attack Protection',
    description: 'Using custom ML models to perform feature extraction from command lines and PowerShell scripts stops file-less malware. <a href="https://ieeexplore.ieee.org/abstract/document/9049836" target="_blank" rel="noopener noreferrer"><span style="text-decoration: underline;">This research</span></a> earned us the "Key Innovators" title by the European Commission.',
    position: 'top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/file-attack.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-2.svg',
  },
  {
    year: '2021',
    title: 'AI Models for Malicious Email Detection',
    description: 'Employs Deep Learning ML architectures to detect phishing, fraud, and malware-laced emails by analyzing heuristics, email components, embedded content, patterns, metadata and more',
    position: 'bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/email.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-1.svg',
  },
  {
    year: '2021',
    title: 'Prediction neural networks for malicious app detection',
    description: 'Utilizes layered deep learning models trained on extensive behavioral and static app features to predict malicious intent before execution',
    position: 'top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/anomaly.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-2.svg',
  },
  {
    year: '2022',
    title: 'Extended ML models for scam types classification',
    description: 'Enhancing scam detection accuracy by leveraging advanced machine learning architectures',
    position: 'bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/classification.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-1.svg',
  },
  {
    year: '2023',
    title: 'AI App anomaly detection',
    description: 'A cloud-based deep learning system for detecting anomalous and malicious application behavior',
    position: 'top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/app.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-2.svg',
  },
  {
    year: '2023',
    title: 'AI Assisted Scam Detection',
    description: 'By leveraging Bitdefender’s threat detection technologies and augmenting their power with the versatility and comprehension capabilities of AI agents we were able to research a new approach to Online Scams prevention',
    position: 'bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/chat-bubble-hook.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-1.svg',
  },
  {
    year: '2024',
    title: 'Threat Wave Clustering',
    description: 'Deep learning models that cluster threat detections with similar indicators of compromise, revealing how scams appear and spread.',
    position: 'top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/round-download.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-2.svg',
  },
  {
    year: '2025',
    title: 'AI Voice Honeypots',
    description: 'Our synthetic personas engage fraudsters like real victims, identify manipulation techniques, and methodically extract indicators across the attack',
    position: 'bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/voice.svg',
    arrowSrc: '/_src/blocks/personalisation-block/ai-page/public/arrow-1.svg',
  },
];

const statisticsData = [
  {
    value: '$1.026 trillion',
    title: 'Global Financial Impact',
    description: 'Scams have now reached a critical level globally, with total financial losses estimated at $1.026 trillion, equating to 1.05% of global GDP. This highlights an intensifying threat landscape, where scams affect more than just individual victims; they have broad economic implications as well.',
  },
  {
    value: '2+ billion victims',
    title: 'Victimization Rates',
    description: 'The GASA report reveals that approximately 25.5% of people globally have experienced financial loss due to scams in the last year. This translates to 1 in 4 individuals being affected, demonstrating the pervasiveness of fraudulent activities.',
  },
];

const scamCards = [
  {
    id: 1,
    type: 'large-top',
    icon: '/_src/blocks/personalisation-block/ai-page/public/hand-money.svg',
    title: 'Crypto Scams & Fake Trading Platforms',
    backgroundImage: '/_src/blocks/personalisation-block/ai-page/public/globe-02.png',
    backgroundClass: 'top: -120px; left: -5px; min-width: 202px; height: 210px;',
  },
  {
    id: 2,
    type: 'small',
    icon: '/_src/blocks/personalisation-block/ai-page/public/chat-bubble-hook-white.svg',
    title: 'Deepfake Scams',
  },
  {
    id: 3,
    type: 'small',
    icon: '/_src/blocks/personalisation-block/ai-page/public/id-user-hook.svg',
    title: 'Employment Scams',
  },
  {
    id: 4,
    type: 'medium-special',
    iconArea: '/_src/blocks/personalisation-block/ai-page/public/icon-area.svg',
    textImage: '/_src/blocks/personalisation-block/ai-page/public/text.svg',
    frameImage: '/_src/blocks/personalisation-block/ai-page/public/frame-1000004982.svg',
  },
  {
    id: 5,
    type: 'medium',
    icon: '/_src/blocks/personalisation-block/ai-page/public/phone-target.svg',
    title: 'Ransomware & Extortion Attacks',
    backgroundImage: '/_src/blocks/personalisation-block/ai-page/public/group-23186.png',
    backgroundClass: 'top: 5%; left: 5%; width: 90%',
  },
  {
    id: 6,
    type: 'medium',
    icon: '/_src/blocks/personalisation-block/ai-page/public/rocking-horse.svg',
    title: 'Remote Access Trojans',
    backgroundImage: '/_src/blocks/personalisation-block/ai-page/public/mask-group-2.svg',
    backgroundClass: 'top: -136px; left: -117px; min-width: 355px; min-height: 355px',
  },
  {
    id: 7,
    type: 'small',
    icon: '/_src/blocks/personalisation-block/ai-page/public/male-female.svg',
    title: 'Romance Scams',
  },
  {
    id: 8,
    type: 'small',
    icon: '/_src/blocks/personalisation-block/ai-page/public/headset-clock.svg',
    title: 'Tech Support Scams',
  },
  {
    id: 9,
    type: 'large-bottom',
    icon: '/_src/blocks/personalisation-block/ai-page/public/envelope-block.svg',
    title: 'Business Email Compromise',
    concentricCircles: [
      { src: '/_src/blocks/personalisation-block/ai-page/public/icon-4.svg', style: 'top: 38px; left: 54px; width: 85px; height: 90px;' },
      { src: '/_src/blocks/personalisation-block/ai-page/public/icon-3.svg', style: 'top: 18px; left: 37px; width: 119px; height: 126px;' },
      { src: '/_src/blocks/personalisation-block/ai-page/public/icon.svg', style: 'top: -5px; left: 18px; width: 156px; height: 167px;' },
      { src: '/_src/blocks/personalisation-block/ai-page/public/icon-1.svg', style: 'top: -29px; left: -2px; width: 196px; height: 210px;' },
      { src: '/_src/blocks/personalisation-block/ai-page/public/icon-2.svg', style: 'top: -51px; left: -22px; width: 236px; height: 251px;' },
    ],
  },
];

const insightsData = [
  {
    image: '/_src/blocks/personalisation-block/ai-page/public/rectangle-19.png',
    title: 'They Wear Our Faces: How Scammers Are Using AI to Swindle American Families',
    link: 'https://www.bitdefender.com/en-us/blog/hotforsecurity/they-wear-our-faces-how-scammers-are-using-ai-to-swindle-american-families',
  },
  {
    image: '/_src/blocks/personalisation-block/ai-page/public/rectangle-21.png',
    title: 'WhatsApp Shuts Down 6.8 Million Scam Accounts Linked to Worldwide Fraud Networks',
    link: 'https://www.bitdefender.com/en-us/blog/hotforsecurity/whatsapp-shuts-down-6-8-million-scam-accounts-linked-to-worldwide-fraud-networks',
  },
  {
    image: '/_src/blocks/personalisation-block/ai-page/public/rectangle-23.png',
    title: "'Your Account Has Been Hacked': Crypto and Bank Phishing Scams Surge Across Australia",
    link: 'https://www.bitdefender.com/en-us/blog/hotforsecurity/your-account-has-been-hacked-crypto-and-bank-phishing-scams-surge-across-australia',
  },
];

const responsibleAIData = [
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/shield-chat-bubble-check.svg',
    title: 'Transparency',
    description: 'We provide clear information about how our AI enhances security decisions and what data it uses, balancing technical transparency with usability.',
    component: '/_src/blocks/personalisation-block/ai-page/public/component-2.svg',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/frame-1.svg',
    title: 'Privacy by Design',
    description: 'We implement privacy-preserving techniques like federated learning and differential privacy to minimize data exposure while maintaining AI effectiveness.',
    component: '/_src/blocks/personalisation-block/ai-page/public/component-3.svg',
  },
  {
    icon: '/_src/blocks/personalisation-block/ai-page/public/shield-user.svg',
    title: 'Human Guided AI Protection',
    description: 'While our AI is powerful, we augment it with the deep expertise of Bitdefender Labs.',
    component: '/_src/blocks/personalisation-block/ai-page/public/component-4.svg',
  },
];

const partnerLogos = [
  { src: '/_src/blocks/personalisation-block/ai-page/public/image-5.png', alt: 'Partner logo 1', className: 'image-5' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/image-6.png', alt: 'Partner logo 2', className: '' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/image-7.png', alt: 'Partner logo 3', className: 'white-bg image-7' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/image-8.png', alt: 'Partner logo 4', className: 'white-bg' },
];

const navigationItems = [
  { label: 'For Consumer', active: true },
  { label: 'For Small Business', active: true },
  { label: 'For Enterprise', active: true },
  { label: 'For Partners', active: true },
];

const quickLinksColumn1 = [
  'Bitdefender Centeral',
  'GravityZone Cloud Control Center',
  'Bitdefender Cyperpedia',
  'Partner Advantage Network Portal',
  'Brand Portal',
];

const quickLinksColumn2 = [
  'Support for Home Products',
  'Support for Business Products',
  'Investors',
  'Careers',
  'InfoZone',
];

const socialMediaIcons = [
  { src: '/_src/blocks/personalisation-block/ai-page/public/social-media-icon-5.svg', alt: 'Social media icon' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/social-media-icon-1.svg', alt: 'Social media icon' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/social-media-icon-3.svg', alt: 'Social media icon' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/social-media-icon-4.svg', alt: 'Social media icon' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/social-media-icon-2.svg', alt: 'Social media icon' },
  { src: '/_src/blocks/personalisation-block/ai-page/public/social-media-icon.svg', alt: 'Social media icon' },
];

const footerLinks = [
  'Legal Information',
  'Privacy Policy',
  'Site Map',
  'Company',
  'Contact Us',
  'Privacy Settings',
];

const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
  <path d="M11.688 4.41584L8.008 8.09584L6.872 6.95984L7.96 5.87184L8.696 5.24784L8.68 5.18384L7.32 5.26384H0.328003V3.56784H7.32L8.68 3.64784L8.696 3.58384L7.96 2.95984L6.872 1.87184L8.008 0.73584L11.688 4.41584Z" fill="#006DFF"/>
</svg>`;

const researchSectionData = {
  title: '<strong>Science</strong> that drives progress',
  cards: [
    {
      title: 'DeepFake Detection',
      description: 'A recognised and award-winning technology focused on identifying and analysing manipulated media through advanced machine learning.',
      button: [
        {
          text: 'Circumventing shortcuts in audio-visual deepfake detection datasets with unsupervised learning ',
          link: 'https://arxiv.org/abs/2412.00175',
        },
        {
          text: 'DeCLIP: Decoding CLIP representations for deepfake localization ',
          link: 'https://arxiv.org/abs/2409.08849',
        },
        {
          text: 'Towards generalisable and calibrated audio deepfake detection with self-supervised representations ',
          link: 'https://arxiv.org/pdf/2309.05384',
        },
        {
          text: 'Weakly-supervised deepfake localization in diffusion-generated images ',
          link: 'https://openaccess.thecvf.com/content/WACV2024/papers/Tantaru_Weakly-Supervised_Deepfak[…]lization_in_Diffusion-Generated_Images_WACV_2024_paper.pdf',
        },
      ],
      img: '/_src/blocks/personalisation-block/ai-page/public/group-33689.png',
    },
    {
      title: 'LLM for Assembly',
      description: 'Models fine-tuned on assembly code to improve feature quality and accuracy in tasks like anomaly detection, search, and classification.',
      button: [{ text: 'Large Language Models for Malware Analysis ', link: 'https://bit-ml.github.io/blog/post/large-language-models-for-malware-analysis/' }],
      img: '/_src/blocks/personalisation-block/ai-page/public/group-33688.png',
    },
  ],

};

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }), observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.cta-card, .timeline-box, .research-card, .stat-card, .threat-card, .insight-card, .principle-card',
  );

  animateElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// Add fade-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Observe statistics section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.research-stat-value');
      statNumbers.forEach((stat) => {
        // Extract numeric value from text
        const text = stat.textContent;
        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));

        if (!numericValue.isNaN) {
          // Animate the number
          stat.setAttribute('data-original', text);
          let current = 0;
          const increment = numericValue / 100;

          const animation = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              stat.textContent = stat.getAttribute('data-original');
              clearInterval(animation);
            } else {
              // Format the number based on original format
              if (text.includes('trillion')) {
                stat.textContent = `$${current.toFixed(3)} trillion`;
              }
              if (text.includes('billion')) {
                stat.textContent = `${current.toFixed(1)}+ billion victims`;
              }
            }
          }, 20);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.research-section');
if (statsSection) {
  statsObserver.observe(statsSection);
}

function renderCallToActionSection() {
  const grid = document.querySelector('.cta-grid');

  callToActionData.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'cta-card';
    cardEl.innerHTML = `
      <img src="${card.icon}" alt="${card.title}">
      <h3>${card.title}</h3>
      <p>${card.description}</p>
    `;
    grid.appendChild(cardEl);
  });
}

function replaceHeader() {
  const customHeader = document.querySelector('.header-custom');
  const header = document.querySelector('header');
  header.outerHTML = customHeader.outerHTML;
  customHeader.remove();
}

function initTimelineCarousel() {
  const container = document.querySelector('.timeline-container');
  if (!container) return;
  const track = container.querySelector('.timeline-track');
  const prevBtn = container.querySelector('.timeline-button.left');
  const nextBtn = container.querySelector('.timeline-button.right');
  const items = Array.from(container.querySelectorAll('.timeline-box.populated'));
  const upItems = Array.from(container.querySelectorAll('.timeline-content-up .timeline-box'));
  if (!track || !prevBtn || !nextBtn || items.length === 0) return;

  let currentIndex = 5;
  const itemsToShow = 5; // number of visible boxes at a time
  const maxIndex = Math.max(0, items.length - itemsToShow - 2);

  // Amount to scroll per click (item width + gap)
  function getScrollAmount() {
    const itemWidth = (upItems[0].offsetWidth + upItems[1].offsetWidth) / 2;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
    return itemWidth + gap;
  }

  function updateTimeline() {
    const offset = -(currentIndex * getScrollAmount());
    track.style.transform = `translateX(${offset}px)`;
    track.style.transition = 'transform 0.5s ease';

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }
  track.addEventListener('resize', updateTimeline());

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex -= 1;
    updateTimeline();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) currentIndex += 1;
    updateTimeline();
  });

  // Touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) currentIndex = Math.min(currentIndex + 1, maxIndex);
      else currentIndex = Math.max(currentIndex - 1, 0);
      updateTimeline();
    }
  }, { passive: true });

  // Initial position
  updateTimeline();
}

function renderTimelineSection() {
  const container = document.querySelector('.timeline-container');
  container.innerHTML = ''; // clear old content

  // Create main wrapper
  const track = document.createElement('div');
  track.className = 'timeline-track';

  // Create 3 rows
  const contentUp = document.createElement('div');
  contentUp.className = 'timeline-content-up';

  const years = document.createElement('div');
  years.className = 'timeline-years';

  const contentDown = document.createElement('div');
  contentDown.className = 'timeline-content-down';

  // Append them to track
  track.appendChild(contentUp);
  track.appendChild(years);
  track.appendChild(contentDown);
  container.appendChild(track);

  timelineData.forEach((item, index) => {
    // --- Row 1: Top Content (even index) ---
    const upBox = document.createElement('div');
    upBox.className = 'timeline-box';
    if (index % 2 !== 0) {
      if (item.icon) {
        const iconEl = document.createElement('img');
        iconEl.className = 'timeline-icon';
        iconEl.src = item.icon;
        upBox.appendChild(iconEl);
        upBox.classList.add('populated');
      }
      upBox.insertAdjacentHTML('beforeend', `
        <div class="timeline-box-content">
          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-description">${item.description}</p>
        </div>
      `);

      // Set arrow only for boxes with content
      upBox.style.setProperty('--arrow-src', `url(${item.arrowSrc})`);
    }
    contentUp.appendChild(upBox);

    // --- Row 2: Year (always populated) ---
    const yearEl = document.createElement('div');
    yearEl.className = 'timeline-year';
    yearEl.innerHTML = `<span class="year-tag">${item.year}</span>`;
    years.appendChild(yearEl);

    // --- Row 3: Bottom Content (odd index) ---
    const downBox = document.createElement('div');
    downBox.className = 'timeline-box';
    if (index % 2 === 0) {
      if (item.icon) {
        const iconEl = document.createElement('img');
        iconEl.className = 'timeline-icon';
        iconEl.src = item.icon;
        downBox.classList.add('populated');
        downBox.appendChild(iconEl);
      }
      downBox.insertAdjacentHTML('beforeend', `
        <div class="timeline-box-content">
          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-description">${item.description}</p>
        </div>
      `);

      // Set arrow only for boxes with content
      downBox.style.setProperty('--arrow-src', `url(${item.arrowSrc})`);
    }
    contentDown.appendChild(downBox);
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('timeline-controls');
  const leftBtn = document.createElement('button');
  leftBtn.className = 'timeline-button left';
  leftBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
  <path d="M9.34315 1.41419L7.92893 -2.2769e-05L0.857865 7.07104L2.27208 8.48526L9.34315 1.41419Z" fill="#fff"/>
  <path d="M2.27208 5.65683L0.857865 7.07104L7.92893 14.1421L9.34315 12.7279L2.27208 5.65683Z" fill="#fff"/>
</svg>`;

  const rightBtn = document.createElement('button');
  rightBtn.className = 'timeline-button right';
  rightBtn.disabled = true;
  rightBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
  <path d="M0.656854 1.41419L2.07107 -2.2769e-05L9.14214 7.07104L7.72792 8.48526L0.656854 1.41419Z" fill="white"/>
  <path d="M7.72792 5.65683L9.14214 7.07104L2.07107 14.1421L0.656854 12.7279L7.72792 5.65683Z" fill="white"/>
  </svg>`;

  const gradient1 = document.createElement('div');
  gradient1.className = 'timeline-gradient';
  gradient1.style.left = '0';
  gradient1.style.transform = 'rotate(180deg)';
  gradient1.style.background = 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)';
  container.appendChild(gradient1);

  const gradient2 = document.createElement('div');
  gradient2.className = 'timeline-gradient';
  gradient2.style.right = '0';
  gradient2.style.background = 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)';
  container.appendChild(gradient2);

  buttonsContainer.innerHTML = `${leftBtn.outerHTML}${rightBtn.outerHTML}`;

  container.insertAdjacentElement('afterBegin', buttonsContainer);
}

function renderStatisticsSection() {
  const card = document.querySelector('.statistics-card');

  card.innerHTML = `
    <div class="statistics-content">
      <div class="statistics-left">
        <h2>Bitdefender joined the Global Anti-Scam Alliance as a Foundation Member</h2>
      </div>
      <div class="statistics-right">
        <div class="statistics-logo"></div>
        <p>Global Anti-Scam Alliance (GASA) unites organisations, experts, and law enforcement to protect consumers worldwide from scams.</p>
      </div>
    </div>
  `;
}

function renderResearchSection() {
  const container = document.querySelector('.research-container');

  const leftHTML = `
    <div class="research-left">
      <h2>In cybersecurity, <br>AI is not the future.<br>It's the reality of <strong>today</strong>.</h2>
      <p>The growing use of AI has transformed both sides of the cybersecurity battlefield; while criminals exploit it to enhance deception and scale their attacks, defenders harness the same technology to anticipate, detect, and neutralize those threats faster than ever before.</p>
    </div>
  `;

  const rightHTML = `
    <div class="research-right">
      ${statisticsData.map((stat) => `
        <div class="research-stat">
          <div class="research-stat-value">${stat.value}</div>
          <div class="research-stat-title">${stat.title}</div>
          <div class="research-stat-description">${stat.description}</div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = leftHTML + rightHTML;
}

function renderResearchProgressSection() {
  const container = document.querySelector('.research-progress-container');
  container.innerHTML = `
    <div class="ai-content">
      <div class="ai-left">
        <p class="ai-subtitle">Redefining cybersecurity through AI research</p>
        <h2 class="ai-description">${researchSectionData.title}</h2>
      </div>
      <div class="ai-right">
        <p class="ai-text">
            We don’t just use AI.<br>
            With over 70 academic papers published and 50+ researchers teaching at top universities, Bitdefender sets new standards in integrating AI in cybersecurity. 
        </p>
      </div>
    </div> 
    <div class="cards-container">
      ${researchSectionData.cards.map((card) => `
          <div class="research-card">
            <div class="text-content">
              <h3 class="card-title">${card.title}</h3>
              <p class="card-description">${card.description}<p>
              <div class="buttons-container">${card.button.map((button) => ` <a class="card-button" href = '${button.link}' target="_blank"> ${button.text} ${arrowSvg} </a>`).join('')}</div>
            </div>
            <img src="${card.img}">
          </div>
      `).join('')}
    </div>    
  `;

  // Match heights for consistency
  matchHeights(container, '.card-title');
  matchHeights(container, '.card-description');
}

function renderIntroductionSection() {
  const container = document.querySelector('.introduction-container');

  let scamCardsHTML = '<div class="scam-cards-grid-container"><div class="scam-cards-grid">';

  scamCardsHTML += '<div class="scam-column" style="width: 192px;">';
  const card1 = scamCards.find((c) => c.id === 1);
  scamCardsHTML += `
    <div class="scam-card scam-card-large">
      <div class="scam-card-content">
        ${card1.backgroundImage ? `<img class="scam-card-bg" style="${card1.backgroundClass}" src="${card1.backgroundImage}" alt="Background">` : ''}
        <div class="scam-icon-wrapper">
          <img src="${card1.icon}" alt="${card1.title}">
        </div>
        <div class="scam-card-title">${card1.title}</div>
      </div>
    </div>
    <div class="scam-column">
      ${scamCards.filter((c) => c.id === 2 || c.id === 3).map((card) => `
        <div class="scam-card scam-card-small">
          <div class="scam-card-content">
            <div class="scam-icon-wrapper">
              <img src="${card.icon}" alt="${card.title}">
            </div>
            <div class="scam-card-title">${card.title}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  scamCardsHTML += '</div>';

  scamCardsHTML += '<div class="scam-column">';
  const card4 = scamCards.find((c) => c.id === 4);
  scamCardsHTML += `
    <div class="scam-card scam-card-special">
      <div class="scam-card-content">
        <img class="scam-card-bg" style="position: absolute; top: calc(50% - 54px); left: calc(50% - 195px); width: 390px; height: 56px;" src="${card4.frameImage}" alt="Frame">
        <img style="width: 64px; height: 64px; position: relative; z-index: 10;" src="${card4.iconArea}" alt="Icon">
        <img class="scam-text" src="${card4.textImage}" alt="Text">
      </div>
    </div>
    <div class="scam-column" style="display: flex; flex-direction: row; gap: 30px; height: 192px;">
      ${scamCards.filter((c) => c.id === 5 || c.id === 6).map((card) => `
        <div class="scam-card scam-card-medium" style="width:192px;">
          <div class="scam-card-content">
            ${card.backgroundImage ? `<img class="scam-card-bg" style="${card.backgroundClass}" src="${card.backgroundImage}" alt="Background">` : ''}
            <div class="scam-icon-wrapper">
              <img src="${card.icon}" alt="${card.title}">
            </div>
            <div class="scam-card-title">${card.title}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  scamCardsHTML += '</div>';

  scamCardsHTML += '<div class="scam-column" style="width: 192px;">';
  scamCardsHTML += `
    <div class="scam-column">
      ${scamCards.filter((c) => c.id === 7 || c.id === 8).map((card) => `
        <div class="scam-card scam-card-small">
          <div class="scam-card-content">
            <div class="scam-icon-wrapper">
              <img src="${card.icon}" alt="${card.title}">
            </div>
            <div class="scam-card-title">${card.title}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  const card9 = scamCards.find((c) => c.id === 9);
  scamCardsHTML += `
    <div class="scam-card scam-card-large">
      <div class="scam-card-content">
        ${card9.concentricCircles.map((circle) => `
          <img class="scam-card-bg" style="position: absolute; ${circle.style}" src="${circle.src}" alt="Icon">
        `).join('')}
        <div class="scam-icon-wrapper">
          <img src="${card9.icon}" alt="${card9.title}">
        </div>
        <div class="scam-card-title">${card9.title}</div>
      </div>
    </div>
  `;
  scamCardsHTML += '</div>';

  scamCardsHTML += '</div><div class="overlay scam-cards-grid"></div></div>';

  container.innerHTML = `

    <div class="introduction-content">
      <h2>Scams.</h2>
      <h3>The Leading Cyber Threat of Today.</h3>
      <p>With the help of AI, scams are becoming more sophisticated, more convincing, and harder to detect.</p>
      ${scamCardsHTML}
    </div>
  `;
}

function renderThreatsSection() {
  const container = document.querySelector('.threats-container');

  const gridHTML = insightsData.map((insight) => `
    <div class="threat-card">
      <img src="${insight.image}" alt="${insight.title}">
      <div class="threat-card-content">
        <h3>${insight.title}</h3>
        <a href="${insight.link ?? '#'}" target="_blank">Read More ${arrowSvg}</a>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <h2>Latest AI Insights</h2>
    <p>Trends, news and breakthroughs in the world of cybersecurity</p>
    <div class="threats-grid">${gridHTML}</div>
  `;
}

function renderInsightsSection() {
  const container = document.querySelector('.insights-container');

  const gridHTML = responsibleAIData.map((insight) => `
    <div class="insight-card">
      <div class="insight-card-content">
        <img class="insight-card-bg" src="${insight.component}" alt="Background">
        <img class="insight-icon" src="${insight.icon}" alt="${insight.title}">
        <h3>${insight.title}</h3>
        <p>${insight.description}</p>
      </div>
    </div>
  `).join('');

  const logosHTML = partnerLogos.map((logo) => `
    <div class="partner-logo ${logo.className}">
      ${logo.className !== 'image-5' ? `<img src="${logo.src}" alt="${logo.alt}">` : ''}
    </div>
  `).join('');

  container.innerHTML = `
    <h2>Responsible AI. Protected Future.</h2>
    <p>
      We believe powerful AI should be paired with strong ethical principles. Our commitment to responsible AI ensures
      security never comes at the cost of privacy or digital rights
    </p>
    <div class="insights-grid">${gridHTML}</div>
    <div class="partner-logos">${logosHTML}</div>
  `;
}

function renderFooterSection() {
  const container = document.querySelector('.footer-container');

  const navItemsHTML = navigationItems.map((item, index) => `
    <button class="footer-nav-link">${item.label}</button>
    ${index < navigationItems.length - 1 ? '<span class="footer-separator">|</span>' : ''}
  `).join('');

  const quickLinks1HTML = quickLinksColumn1.map((link) => `
    <a href="#" class="footer-link">${link}</a>
  `).join('');

  const quickLinks2HTML = quickLinksColumn2.map((link) => `
    <a href="#" class="footer-link">${link}</a>
  `).join('');

  const socialIconsHTML = socialMediaIcons.map((icon) => `
    <button class="social-icon">
      <img src="${icon.src}" alt="${icon.alt}">
    </button>
  `).join('');

  const footerLinksHTML = footerLinks.map((link, index) => `
    <a href="#" class="footer-bottom-link">${link}</a>
    ${index < footerLinks.length - 1 ? '<span class="footer-separator">|</span>' : ''}
  `).join('');

  container.innerHTML = `
    <div class="footer-header">
      <div class="footer-logo-1"></div>
      <div class="footer-logo-2"></div>
    </div>

    <nav class="footer-nav">
      <div class="footer-nav-items">
        ${navItemsHTML}
      </div>
      <div class="footer-divider"></div>
    </nav>

    <div class="footer-links-section">
      <div class="footer-links-content">
        <h3 class="footer-links-title">Quick Links</h3>
        <div class="footer-links-columns">
          <div class="footer-links-column">
            ${quickLinks1HTML}
          </div>
          <div class="footer-links-column">
            ${quickLinks2HTML}
          </div>
        </div>
      </div>
      <div class="footer-social">
        ${socialIconsHTML}
      </div>
    </div>

    <div class="footer-divider"></div>

    <div class="footer-bottom-nav">
      <nav class="footer-bottom-links">
        ${footerLinksHTML}
      </nav>
      <address class="footer-address">
        111 W. Houston Street, Suite 2105, Frost Tower Building<br>
        San Antonio, Texas 78205
      </address>
    </div>

    <div class="footer-divider"></div>

    <div class="footer-copyright-section">
      <p class="footer-copyright">Copyright © 1997 - 2025 Bitdefender</p>
      <div class="footer-logo-3"></div>
      <div class="footer-select-wrapper">
        <img class="footer-select-icon" src="/_src/blocks/personalisation-block/ai-page/public/leading-icon.svg" alt="Icon">
        <select class="footer-select">
          <option>United Arab Emirates - English</option>
        </select>
      </div>
    </div>
  `;
}

// document.addEventListener('DOMContentLoaded', () => {
renderCallToActionSection();
renderTimelineSection();
initTimelineCarousel();
renderResearchProgressSection();
renderStatisticsSection();
renderResearchSection();
renderIntroductionSection();
renderThreatsSection();
// Select main grid container and overlay container
const cardsContainer = document.querySelector('.scam-cards-grid-container');
const overlay = document.querySelector('.overlay.scam-cards-grid');

// Clear overlay
overlay.innerHTML = '';

// Clone entire grid container content into overlay
const clonedGrid = cardsContainer.cloneNode(true); // deep clone everything
clonedGrid.classList.add('overlay-grid'); // optional class for overlay styling
overlay.appendChild(clonedGrid);

// Collect all real cards and overlay cards for size sync
const allRealCards = Array.from(cardsContainer.querySelectorAll('.scam-card'));
const overlayCards = Array.from(clonedGrid.querySelectorAll('.scam-card'));

// ResizeObserver to keep overlay cards aligned
const resizeObserver = new ResizeObserver(() => {
  allRealCards.forEach((card, index) => {
    const overlayCard = overlayCards[index];
    if (!overlayCard) return;

    const rect = card.getBoundingClientRect();

    // Only copy width and height, keep layout structure
    overlayCard.style.width = `${rect.width}px`;
    overlayCard.style.height = `${rect.height}px`;
  });
});

allRealCards.forEach((card) => resizeObserver.observe(card));

// Pointer movement to apply glow/gradient effect
document.addEventListener('pointermove', (e) => {
  const rect = cardsContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  overlay.style.setProperty('--x', `${x}px`);
  overlay.style.setProperty('--y', `${y}px`);
  overlay.style.setProperty('--opacity', 1);
});

function addHeaderAnimation() {
  const header = document.querySelector('header');
  header.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', () => {
      header.querySelector('li.active').classList.remove('active');
      li.classList.add('active');
    });
  });
}

renderInsightsSection();
renderFooterSection();
replaceHeader();
addHeaderAnimation();
initScrollAnimations();
// });
