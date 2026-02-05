export default function decorate(block) {
  const section = block.closest('.section');
  const { backgroundColor } = section.dataset;

  if (backgroundColor) {
    section.style.backgroundColor = backgroundColor;
  }

  const contentWrapper = block.querySelector('div:not(:first-child)');
  contentWrapper.classList.add('data-wrapper');
  const columnLeft = block.querySelector('.data-wrapper > div:first-of-type');
  columnLeft.classList.add('data-column-left');
  const columnRight = block.querySelector('.data-wrapper > div:nth-of-type(2)');
  columnRight.classList.add('data-column-right');
  const articlesWrapper = block.querySelector('div:nth-of-type(3)');
  articlesWrapper?.classList.add('articles-wrapper');

  articlesWrapper?.querySelectorAll('div')?.forEach((child, idx) => {
    if ((idx + 1) % 2 === 0) {
      child.style.order = idx;
    } else {
      child.style.order = idx + 2;
    }

    if (child.querySelector('img') || child.querySelector('.icon')) {
      child.classList.add('article-image');
      return;
    }

    child.classList.add('article-column');
  });

  // Observe statistics section for counter animation
  // Improved counter animation observer with multi-language support
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const statNumbers = entry.target.querySelectorAll('h1');

      statNumbers.forEach((stat) => {
        const originalText = stat.textContent.trim();

        // Normalize text for number extraction
        const normalized = originalText
          .replace(/[^0-9.,\s]/g, '') // keep numeric symbols
          .replace(/\s/g, '') // remove spaces (1 234 → 1234)
          .replace(/,/g, '.') // convert commas to dots
          .replace(/(\.\d*)\./g, '$1'); // fix "1.234.567"

        const numericValue = parseFloat(normalized);

        if (Number.isNaN(numericValue)) return;

        // Store original format for final restoration
        stat.setAttribute('data-original', originalText);

        let current = 0;
        const increment = numericValue / 100;

        const animation = setInterval(() => {
          current += increment;

          if (current >= numericValue) {
            stat.textContent = originalText;
            clearInterval(animation);
            return;
          }

          // ---- Detect keywords (multi-language) ----
          const lower = originalText.toLowerCase();

          const suffixes = {
            trillion: ['trillion', 'billón', 'billion', '兆'],
            billion: ['billion', 'milliard', 'mil millones', '亿'],
            million: ['million', 'millón', '百万'],
          };

          const formatValue = (num) => new Intl.NumberFormat(
            undefined,
            { maximumFractionDigits: 3 },
          ).format(num);

          let matchedWord = null;

          Object.entries(suffixes).some(([, words]) => words.some((word) => {
            if (lower.includes(word.toLowerCase())) {
              matchedWord = word; // use this exact word in final text
              return true; // stop inner some
            }
            return false;
          }));

          let formatted = formatValue(current);

          if (matchedWord) {
            formatted = `${formatted} ${matchedWord}`;
          }

          // Preserve other text ("+" signs, words, etc.)
          stat.textContent = formatted;
        }, 20);
      });

      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  statsObserver.observe(section);
}
