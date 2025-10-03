import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const dataset = getDatasetFromSection(block);

  const {
    questionLabel, nextButtonLabel, previousButtonLabel, seeResultsLabel, selectErrorLabel,
  } = dataset;

  const state = {
    score: 0,
    currentStep: 0,
  };

  const isAcqVariant = document.querySelector('.acq-quiz');

  block.classList.add('default-content-wrapper');
  block.closest('.section').id = 'quiz-form';
  const steps = [...block.children];

  function renderStep(step, index) {
    const stepAboveTitle = step.querySelector('p:has(sup)');
    const stepTitle = step.querySelector('h2').textContent || step.children[0].children[0].textContent;
    const stepSubtitle = step.querySelector('h3');
    const stepOptions = [...step.querySelectorAll('li')];
    const stepImage = step.children[1].children[0];
    const isFirstStep = index === 0;
    const isLastStep = index === steps.length - 1;

    const fieldId = `question-${index}`;

    return `
      <div class="form-wrapper">
        <form class="step">
           <div class="step-header">
             <div class="step-index">${questionLabel} ${index + 1}/${steps.length}</div>
             ${!isFirstStep ? `<a class="step-previous">${previousButtonLabel}</a>` : ''}
           </div>
        
           
           <fieldset>
             ${stepAboveTitle ? `<p>${stepAboveTitle.innerHTML}</p>` : ''}
             <h2>${stepTitle}</h2>
             ${stepSubtitle ? `<h3>${stepSubtitle.innerHTML}</h3>` : ''}

                ${stepOptions.map((option, idx) => {
    const value = option.querySelector('u') ? 1 : 0;
    const forLabel = `${fieldId}-${idx}`;

    return `
                <div class="step-radio-wrapper">
                  <label for="${forLabel}">
                  ${option.textContent}
                  <input type="radio" id="${forLabel}" name="${fieldId}" value="${value}" required aria-required="true"/>
                  <div class="checkbox"></div>
                  </label>
                </div>
                `;
  }).join('')}
                <div class="error-message">${selectErrorLabel}</div>
           </fieldset>
    
           <p class="button-container submit">
            <a class="button modal" href="">${!isLastStep ? nextButtonLabel : seeResultsLabel}</a>
           </p>

            ${stepImage ? `<div class="img-container">${stepImage.outerHTML}</div>` : ''}
        </form>
      </div>
    `;
  }

  function moveToNextStep() {
    state.currentStep += 1;
    const slideWrapper = block.querySelector('.slide-wrapper');
    const offset = 60;

    const transformValue = `translateX(calc(-100% * ${state.currentStep} - (${offset}px *  ${state.currentStep})))`;
    slideWrapper.style.transform = transformValue;
  }

  function moveToPreviousStep() {
    state.currentStep -= 1;
    const slideWrapper = block.querySelector('.slide-wrapper');
    const offset = 60;

    const transformValue = `translateX(calc(-100% * ${state.currentStep} - (${offset}px *  ${state.currentStep})))`;
    slideWrapper.style.transform = transformValue;
  }

  function renderResults() {
    block.style.transform = null;

    // get score
    /* eslint-disable-next-line */
    const score = [...block.querySelectorAll('input[type="radio"]:checked')].map((inputEl) => inputEl.value).reduce((sc, value) => sc += Number(value), 0);

    const legendScore = Object.keys(dataset)
      .filter((item) => item.includes('result_'))
      .map((item) => ({
        template: item.split('result_')[1].split('_').join('-'),
        interval: [...dataset[item].split('-')],
      }));

    /* eslint-disable max-len */
    const foundLegend = legendScore.find(({ interval: [min, max] }) => Number(min) <= score && score <= Number(max));

    const { origin, pathname } = window.location;
    // redirect
    if (isAcqVariant) {
      window.location.replace(`${origin}${pathname}${dataset.score}`);
      return;
    }
    window.location.replace(`${origin}${pathname}${foundLegend.template}`);
  }

  function validateForm(e) {
    e.preventDefault();

    const formEl = e.target.closest('form');
    const selectedOption = formEl.querySelector('input[type="radio"]:checked');
    const isLastStep = state.currentStep === steps.length - 1;

    if (!selectedOption) {
      formEl.querySelector('fieldset').classList.add('invalid');
      return;
    }

    if (!isLastStep) {
      moveToNextStep();
      return;
    }

    if (isAcqVariant) {
      const eventData = {
        event: 'form completed',
        user: {
          form: 'Who do you protect online?',
          field: `${selectedOption.parentElement.innerText}`,
        },
      };
      // Store in localStorage
      localStorage.setItem('formCompletedEvent', JSON.stringify(eventData));
    }
    renderResults();
  }

  block.innerHTML = `
    <div class="slide-wrapper">${steps.map((step, index) => renderStep(step, index)).join('')}</div>
  `;

  block.querySelectorAll('form').forEach((form) => {
    const radios = form.querySelectorAll('input[type="radio"]');

    radios.forEach((radio) => {
      radio.addEventListener('change', (event) => {
        if (event.target.checked) {
          form.querySelector('fieldset').classList.remove('invalid');
        }
      });
    });

    form.querySelectorAll('.button-container.submit').forEach((buttonEl) => buttonEl.addEventListener('click', validateForm));
    form.querySelectorAll('.step-previous').forEach((previousEl) => previousEl.addEventListener('click', moveToPreviousStep));
  });
}
