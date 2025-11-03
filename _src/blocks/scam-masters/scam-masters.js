import {
  AdobeDataLayerService, UserDetectedEvent, WindowLoadStartedEvent, WindowLoadedEvent,
} from '@repobit/dex-data-layer';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';
import { matchHeights, renderTurnstile, submitWithTurnstile } from '../../scripts/utils/utils.js';
import page from '../../scripts/page.js';

const correctAnswersText = new Map();
const partiallyWrongAnswersText = new Map();
const wrongAnswersText = new Map();
const showAfterAnswerText = new Map();
const showBeforeListText = new Map();
const userAnswers = new Map();
const clickAttempts = new Map();
const shareTexts = new Map();
let score = 0;

// eslint-disable-next-line no-unused-vars
function formatQuizResult(resultArray, totalQuestions = 10) {
  const resultMap = new Map(resultArray.map((item) => [item.key, item.value]));
  const resultLines = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < totalQuestions; i++) {
    const isCorrect = resultMap.get(i) === true;
    resultLines.push(`Q${i + 1}: ${isCorrect ? 'correct' : 'incorrect'}`);
  }

  return resultLines.join(', ');
}

// eslint-disable-next-line no-unused-vars
async function saveResults(resultArray) {
  const endpoint = 'https://script.google.com/macros/s/AKfycbxqADa1Mi_VK6r6mrdGcjMxNgcb_QMmPIiC7cIdRR86g3ryCmtSXymouuOjCV0NeQcZHA/exec';

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result: resultArray }),
    });

    // console.log('Data saved');
  } catch (err) {
    // console.error('Err:', err);
  }
}

// function for tracking question interactions through dataLayer events
function trackQuizScreen(isAcqVariant, index, result, skipStartPage) {
  const quizType = isAcqVariant ? ':consumer:quiz' : ':consumer:quiz:scam-masters';
  if (index === 1 && skipStartPage) return;
  const question = `${index ? `:question ${index}` : ''}`;
  const section = `${page.locale}${quizType}${question}${result ? `:${result}` : ''}`;
  const subSubSubSection = isAcqVariant ? `question ${index}` : 'scam-masters';
  const newPageLoaded = new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name = `${section}`;
    pageLoadStartedInfo.subSubSection = 'quiz';
    pageLoadStartedInfo.subSubSubSection = subSubSubSection;
    return pageLoadStartedInfo;
  });

  AdobeDataLayerService.push(newPageLoaded);
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
}

function decorateStartPage(startBlock, isAcqVariant) {
  if (!startBlock) return;
  startBlock.classList.add('start-page');

  const legalDiv = document.createElement('div');
  legalDiv.classList.add('legal-links');

  let ul = startBlock.querySelector('ul');
  if (ul) {
    const listItems = ul.querySelectorAll('li');

    listItems?.forEach((listItem) => {
      const paragraph = document.createElement('p');
      paragraph.innerHTML = listItem.innerHTML;
      legalDiv.appendChild(paragraph);
    });

    ul = ul.replaceWith(legalDiv);
  }

  if (isAcqVariant) {
    const secondDiv = startBlock.querySelector('div:nth-of-type(2)');
    if (secondDiv) {
      const paragraphs = secondDiv.querySelectorAll('p');
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('start-content');
      // for every 2 paragraphs, wrap them in a div, but not the paragraph that contains a picture
      paragraphs.forEach((paragraph, index) => {
        if (!paragraph.querySelector('picture')) {
          if (index % 2 === 0) {
            const wrapper = document.createElement('div');
            wrapper.appendChild(paragraph);
            contentDiv.appendChild(wrapper);
          } else {
            contentDiv.lastChild.appendChild(paragraph);
          }
        }
      });
      secondDiv.prepend(contentDiv);
    }
  }
}

/**
 * Processes and styles text with special markup
 * Handles patterns like "<black Not Correct!>" or "Not Correct! <black Here's what you missed:>"
 * Also handles HTML-encoded angle brackets (&lt; and &gt;)
 * @param {string} html - The HTML content to process
 * @return {string} The processed HTML with styled spans
 */
function processStyledText(html) {
  if (!html) return html;

  // Step 1: Decode HTML entities
  let processedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  // Step 2: Convert <className content> patterns
  processedHtml = processedHtml.replace(/<([a-zA-Z-]+)\s+([^>]+)>/g, (_, cls, content) => `<span class="${cls}">${content}</span>`);

  return processedHtml;
}

function createNewParagraph(message, className) {
  if (!message) return '';
  const p = document.createElement('p');
  p.setAttribute('data-type', className);
  p.classList.add(className);
  p.innerHTML = `<strong>${processStyledText(message)}</strong>`;
  return p;
}

function stripOuterBrackets(str) {
  return str.replace(/^&lt;(.+)&gt;$/, '$1');
}

/**
 * Processes paragraphs with special markup in questions
 * @param {HTMLElement} question - The question element to process
 * @param {number} index - The question index
 */
function processSpecialParagraphs(question, index) {
  const tables = question.querySelectorAll('table');

  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr');

    rows.forEach((row) => {
      const cellText = row.innerText.trim();

      if (cellText.startsWith('correct-text:')) {
        const cellTextHTML = row.innerHTML.trim();
        const message = cellTextHTML.split('correct-text:')[1].trim();
        correctAnswersText.set(index, message);
      }

      if (cellText.startsWith('partially-wrong-text:')) {
        const cellTextHTML = row.innerHTML.trim();
        const message = cellTextHTML.split('partially-wrong-text:')[1].trim();
        partiallyWrongAnswersText.set(index, message);
      }

      if (cellText.startsWith('wrong-text:')) {
        const cellTextHTML = row.innerHTML.trim();
        const message = cellTextHTML.split('wrong-text:')[1].trim();
        wrongAnswersText.set(index, message);
      }

      if (cellText.startsWith('show-after-answer-text:')) {
        const message = cellText.split('show-after-answer-text:')[1].trim();
        showAfterAnswerText.set(index, message);
      }

      if (cellText.startsWith('show-before-list-text:')) {
        const message = cellText.split('show-before-list-text:')[1].trim();
        showBeforeListText.set(index, message);
      }

      if (cellText.startsWith('share-text:')) {
        let message = cellText.split('share-text:')[1].trim();
        message = decodeURIComponent(message);
        message = message.replace(/ {2,}/g, '');
        shareTexts.set(index, message);
      }

      if (cellText.startsWith('tries:')) {
        const triesRaw = cellText.split('tries:')[1].trim();
        const [singleTry, manyTries] = triesRaw.split('|');
        const triesCount = parseInt(triesRaw, 10) || 3;

        if (!question.querySelector('p.tries')) {
          const triesParagraph = document.createElement('p');
          triesParagraph.classList.add('tries');
          triesParagraph.setAttribute('data-singletry', singleTry.trim());
          triesParagraph.innerHTML = manyTries?.trim().replace('x', `<span>${triesCount}</span>`);

          const scamButton = question.querySelector('a[href="#not-a-scam"]');
          if (scamButton && scamButton.parentNode) {
            scamButton.parentNode.insertBefore(triesParagraph, scamButton);
          }
        }
      }
    });

    // Eliminăm tabelul din DOM după procesare
    table.remove();
  });
}

/**
 * Processes answer list in questions
 * @param {HTMLElement} question - The question element to process
 * @param {number} questionIndex - The question index
 */
function decorateAnswersList(question, questionIndex, isAcqVariant) {
  const answersList = question.querySelector('ul');
  const secondaryAnswersList = question.querySelector('ul:nth-of-type(2)');
  secondaryAnswersList?.classList.add('secondary-answers-list');

  // this is a clickable question or a question where we want a list after you answer
  if (question.querySelector('h6')) {
    return;
  }

  if (!answersList) return;

  // Create a div to wrap all content before the ul
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('question-content');

  // Get all elements in the question
  const children = Array.from(question.children[0].children);
  // Find the index of the ul element
  const ulIndex = children.indexOf(answersList);

  // Add all elements before the ul to the contentDiv
  for (let i = 0; i < ulIndex; i += 1) {
    if (i === 0) {
      children[i].classList.add('question-number');
    }
    contentDiv.appendChild(children[i]);
  }

  // Insert the contentDiv at the beginning of the question
  question.children[0].prepend(contentDiv);

  // Add class to the answers list
  answersList.classList.add('answers-list');

  let correctItemIndex = -1;

  // Process each list item as an answer option
  const listItems = answersList.querySelectorAll('li');
  listItems.forEach((listItem, index) => {
    listItem.classList.add('answer-option');
    const emElement = listItem.querySelector('em');
    if (emElement) {
      correctItemIndex = index;
      // Replace the <em> wrapper with its content - we don't want it to be visibly different
      const content = emElement.innerHTML;
      emElement.outerHTML = content;
      listItem.dataset.correct = 'true';
    }

    listItem.addEventListener('click', () => {
      // Prevent multiple selections
      if (userAnswers.has(questionIndex)) return;

      // Store the user's answer
      const isCorrect = index === correctItemIndex;
      userAnswers.set(questionIndex, isCorrect);

      // Apply selected styling
      listItems.forEach((item) => item.classList.remove('selected'));
      listItem.classList.add('selected');

      if (isCorrect) {
        listItem.classList.add('correct-answer');
        contentDiv.innerHTML = processStyledText(correctAnswersText.get(questionIndex));
        score += 1;
        contentDiv.classList.add('correct-answer');
        question.classList.add('correct-answer');
        trackQuizScreen(isAcqVariant, questionIndex + 1, 'correct');
      } else {
        listItem.classList.add('wrong-answer');
        contentDiv.innerHTML = processStyledText(wrongAnswersText.get(questionIndex));
        contentDiv.classList.add('wrong-answer');
        question.classList.add('wrong-answer');
        trackQuizScreen(isAcqVariant, questionIndex + 1, 'wrong');
      }

      const nextButton = question.querySelector('a[href="#continue"]');
      const anotherQuiz = question.querySelector('a[href="#quiz-2"]');

      // Show the next button if it exists
      if (nextButton) {
        nextButton.style.display = '';
      }

      // Show the another quiz button if it exists
      if (anotherQuiz) {
        anotherQuiz.style.display = '';
      }

      answersList.append(createNewParagraph(showAfterAnswerText.get(questionIndex), 'show-after-answer-text'));
    });
  });
}

function showQuestion(index, isAcqVariant, skipStartPage) {
  // Hide all questions
  const allQuestions = document.querySelectorAll('.scam-masters .question');
  const startPage = document.querySelector('.scam-masters .start-page');

  // Hide start page
  if (startPage) {
    startPage.style.display = 'none';
  }

  // Hide all questions
  allQuestions.forEach((q) => {
    q.style.display = 'none';
  });

  // Show the selected question
  const questionToShow = document.querySelector(`.scam-masters .question-${index}`);
  if (questionToShow) {
    questionToShow.style.display = '';
    trackQuizScreen(isAcqVariant, index, null, skipStartPage);
  }
}

function decorateClickableQuestionList(question) {
  const list = question.querySelector('ul');
  if (!list) {
    return;
  }

  // Create a div to wrap all content before the ul
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('question-content');

  // Get all elements in the question
  const children = Array.from(question.children[0].children);
  // Find the index of the ul element
  const ulIndex = children.indexOf(list);

  // Add all elements before the ul to the contentDiv
  for (let i = 0; i < ulIndex; i += 1) {
    if (i === 0) {
      children[i].classList.add('question-number');
    }
    contentDiv.appendChild(children[i]);
  }

  // Insert the contentDiv at the beginning of the question
  question.children[0].prepend(contentDiv);

  // Add class to the answers list
  list.classList.add('answers-list');
}

function getCoordinates(question) {
  const paragraphs = Array.from(question.querySelectorAll('p'));
  const coordinateParagraphs = paragraphs.filter((p) => p.innerHTML.includes('coordinate'));

  const coordinates = [];
  coordinateParagraphs.forEach((paragraph) => {
    paragraph.innerHTML = stripOuterBrackets(paragraph.innerHTML);
    const coordinate = paragraph.innerHTML.split(',').slice(1);
    coordinates.push(coordinate);
    paragraph.remove();
  });

  return coordinates;
}

function showWrong(question, questionIndex) {
  question.classList.add('wrong-answer');
  const questionContent = question.querySelector('.question-content');
  questionContent.classList.add('wrong-answer');
  const answerList = question.querySelector('.answers-list');
  const secondaryAnswersList = question.querySelector('.secondary-answers-list');
  const notAScamButton = question.querySelector('a[href="#not-a-scam"]');
  const continueButton = question.querySelector('a[href="#continue"]');
  const anotherQuizButton = question.querySelector('a[href="#quiz-2"]');
  const triesCounter = question.querySelector('.tries');
  const questionScamTag = question.querySelector('.question-scam-tag');

  const clickableContainer = question.querySelector('.clickable-container');
  clickableContainer.style.display = 'none';

  // Get the wrong answer text and process any styled text within it
  let wrongText = wrongAnswersText.get(questionIndex);
  wrongText = processStyledText(wrongText);
  // Update the question content with the processed text
  questionContent.innerHTML = wrongText;

  if (secondaryAnswersList) {
    secondaryAnswersList.style.display = 'block';
  } else {
    answerList.style.display = 'block';
  }

  if (notAScamButton) {
    notAScamButton.style.display = 'none';
  }

  if (continueButton) {
    continueButton.style.display = '';
  }

  if (anotherQuizButton) {
    anotherQuizButton.style.display = '';
  }

  if (triesCounter) {
    triesCounter.style.display = 'none';
  }

  if (questionScamTag) {
    questionScamTag.style.display = 'flex';
  }

  const explanation = document.createElement('div');
  explanation.classList.add('explanation');
  explanation.innerHTML = processStyledText(showAfterAnswerText.get(questionIndex));
  if (secondaryAnswersList) {
    secondaryAnswersList.append(createNewParagraph(showAfterAnswerText.get(questionIndex), 'show-after-answer-text'));
    secondaryAnswersList.prepend(createNewParagraph(showBeforeListText.get(questionIndex), 'show-before-list-text'));
  } else {
    answerList.append(createNewParagraph(showAfterAnswerText.get(questionIndex), 'show-after-answer-text'));
    answerList.prepend(createNewParagraph(showBeforeListText.get(questionIndex), 'show-before-list-text'));
  }
}

function showCorrect(question, questionIndex) {
  question.classList.add('correct-answer');
  const questionContent = question.querySelector('.question-content');
  questionContent.classList.add('correct-answer');
  const answerList = question.querySelector('.answers-list');
  const notAScamButton = question.querySelector('a[href="#not-a-scam"]');
  const continueButton = question.querySelector('a[href="#continue"]');
  const anotherQuizButton = question.querySelector('a[href="#quiz-2"]');
  const triesCounter = question.querySelector('.tries');
  const questionScamTag = question.querySelector('.question-scam-tag');

  // Get the wrong answer text and process any styled text within it
  let wrongText = correctAnswersText.get(questionIndex);
  wrongText = processStyledText(wrongText);
  // Update the question content with the processed text
  questionContent.innerHTML = wrongText;

  answerList.style.display = 'block';
  if (notAScamButton) {
    notAScamButton.style.display = 'none';
  }

  if (continueButton) {
    continueButton.style.display = '';
  }

  if (anotherQuizButton) {
    anotherQuizButton.style.display = '';
  }

  if (triesCounter) {
    triesCounter.style.display = 'none';
  }

  if (questionScamTag) {
    questionScamTag.style.display = 'flex';
  }

  answerList.append(createNewParagraph(showAfterAnswerText.get(questionIndex), 'show-after-answer-text'));
}

function decorateClickQuestions(question, index, isAcqVariant) {
  if (!question.querySelector('h6')) {
    return;
  }

  question.classList.add('clickable-question');

  const scamTag = question.querySelector('h6');
  scamTag.classList.add('question-scam-tag');

  decorateClickableQuestionList(question, index);

  const notAScamButton = question.querySelector('a[href="#not-a-scam"]');
  if (notAScamButton) {
    notAScamButton.classList.add('secondary');
    notAScamButton.addEventListener('click', (e) => {
      e.preventDefault();
      showWrong(question, index);
      trackQuizScreen(isAcqVariant, index, 'not correct');
    });
  }
  // Find the image that contains the clickable elements
  const imageContainer = question.querySelector('picture');
  if (!imageContainer) return;

  // Initialize click attempts for this question
  clickAttempts.set(index, 0);

  // Get existing tries counter
  const triesCounter = question.querySelector('.tries');

  // Create a wrapper to position the clickable areas over the image
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('image-wrapper');

  // Create a clickable background layer that covers the entire image
  const clickableBackground = document.createElement('div');
  clickableBackground.classList.add('clickable-background');

  // Create a container for the clickable spots that sits on top
  const clickableContainer = document.createElement('div');
  clickableContainer.classList.add('clickable-container');

  // Add the image to the wrapper
  imageWrapper.appendChild(imageContainer.cloneNode(true));

  // Hardcoded spots - can be customized for each question
  // Format: [x, y, width, height]
  const spotsList = getCoordinates(question, index);

  const clickableSpots = [];
  let spotsFound = 0;
  const totalSpots = spotsList.length;

  // Function to track wrong attempts and update the counter
  const trackWrongAttempt = () => {
    if (userAnswers.has(index)) return;

    // Increment attempt counter
    const attempts = clickAttempts.get(index) + 1;
    clickAttempts.set(index, attempts);

    // update tries counter
    const triesSpan = triesCounter.querySelector('span');
    if (triesSpan) {
      const current = parseInt(triesSpan.textContent, 10);
      if (Number(current) === 2) triesCounter.classList.add('red');

      if (!Number.isNaN(current) && current > 0) triesSpan.textContent = current - 1;
    }

    // On third and final attempt: decide the outcome
    if (attempts === 3) {
      if (triesCounter) {
        triesCounter.style.display = 'none';
      }

      if (spotsFound === totalSpots) {
        userAnswers.set(index, true);
        showCorrect(question, index);
        trackQuizScreen(isAcqVariant, index + 1, 'correct');
      } else if (spotsFound > 0) {
        userAnswers.set(index, 'partial');

        // Temporarily override the wrong message
        const originalWrongText = wrongAnswersText.get(index);
        const partialText = partiallyWrongAnswersText.get(index);
        if (partialText) {
          wrongAnswersText.set(index, partialText);
        }

        showWrong(question, index);
        trackQuizScreen(isAcqVariant, index + 1, 'very close');

        // Restore the original wrong text for safety
        if (partialText) {
          wrongAnswersText.set(index, originalWrongText);
        }
      } else {
        userAnswers.set(index, false);
        showWrong(question, index);
        trackQuizScreen(isAcqVariant, index + 1, 'not correct');
      }
    }
  };

  // Add click event to the background layer
  clickableContainer.addEventListener('click', (e) => {
    // Prevent the event from bubbling to spots if they overlap
    e.stopPropagation();

    // Only count clicks inside the picture if not already answered
    if (!userAnswers.has(index)) {
      trackWrongAttempt();
    }
  });

  // Create spots from hardcoded values
  spotsList.forEach((spotData, spotIndex) => {
    const [x, y, width, height] = spotData;

    // Create clickable spot
    const clickableSpot = document.createElement('div');
    clickableSpot.classList.add('clickable-spot');
    clickableSpot.style.left = `${x}%`;
    clickableSpot.style.top = `${y}%`;
    clickableSpot.style.width = `${width}%`;
    clickableSpot.style.height = `${height}%`;

    // Add data attributes
    clickableSpot.dataset.spotIndex = spotIndex;

    // Add click event
    clickableSpot.addEventListener('click', (e) => {
      e.stopPropagation();

      if (userAnswers.has(index) || clickableSpot.classList.contains('found-spot')) return;

      // Mark the spot as found
      clickableSpot.classList.add('found-spot');
      spotsFound += 1;

      // Increment attempt counter
      const attempts = clickAttempts.get(index) + 1;
      clickAttempts.set(index, attempts);

      const triesSpan = triesCounter.querySelector('span');
      if (triesSpan) {
        const current = parseInt(triesSpan.textContent, 10);
        if (!Number.isNaN(current) && current > 0) {
          const newCount = current - 1;

          if (newCount === 1) {
            triesCounter.innerText = triesCounter.getAttribute('data-singletry');
          } else {
            triesSpan.textContent = newCount;
          }
        }
      }

      // If third attempt, evaluate and show result
      if (attempts === 3) {
        if (spotsFound === totalSpots) {
          userAnswers.set(index, true);
          showCorrect(question, index);
        } else if (spotsFound > 0) {
          userAnswers.set(index, 'partial');

          // Temporarily override the wrong message
          const originalWrongText = wrongAnswersText.get(index);
          const partialText = partiallyWrongAnswersText.get(index);
          if (partialText) {
            wrongAnswersText.set(index, partialText);
          }

          showWrong(question, index);
          trackQuizScreen(isAcqVariant, index + 1, 'very close');

          // Restore the original wrong text for safety
          if (partialText) {
            wrongAnswersText.set(index, originalWrongText);
          }
        } else {
          userAnswers.set(index, false);
          showWrong(question, index);
          trackQuizScreen(isAcqVariant, index + 1, 'wrong');
        }
      }

      clickAttempts.set(index, attempts);
    });

    clickableContainer.appendChild(clickableSpot);
    clickableSpots.push(clickableSpot);
  });

  // Add background and spots container to the wrapper
  // imageWrapper.appendChild(clickableBackground);
  imageWrapper.appendChild(clickableContainer);

  // Replace the original image with our interactive version
  imageContainer.parentNode.replaceChild(imageWrapper, imageContainer);
}

let isExecuting = false;
async function saveData(quizResults, fileName, { invisible = false } = {}) {
  if (isExecuting) return;

  isExecuting = true;
  try {
    const { widgetId, token: initialToken } = await renderTurnstile('turnstile-container', { invisible });
    let token = initialToken;

    if (!invisible) {
      if (!window.latestVisibleToken) {
        token = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout waiting for Turnstile token.')), 10000); // 10s

          const checkInterval = setInterval(() => {
            if (window.latestVisibleToken) {
              clearInterval(checkInterval);
              clearTimeout(timeout);
              resolve(window.latestVisibleToken);
            }
          }, 200);
        });
      } else {
        token = window.latestVisibleToken;
      }
    }

    if (!token) throw new Error('Turnstile token missing.');

    await submitWithTurnstile({
      widgetId,
      token,
      data: quizResults,
      fileName,
    });
  } catch (err) {
    throw new Error(`[saveData] Failed: ${err.message}`);
  } finally {
    isExecuting = false;
    // console.log('Data Saved!');
  }
}

function showResult(question, results, isAcqVariant) {
  const date = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const locale = window.location.pathname.split('/')[1] || 'en';
  const quizResults = {
    DATE: date,
    LOCALE: locale,
  };
  const keys = [...userAnswers.keys()];
  const maxKey = Math.max(...keys);

  for (let i = 0; i <= maxKey; i += 1) {
    const answer = userAnswers.get(i);
    quizResults[`Q${i + 1}`] = answer === true ? 'correct' : 'incorrect';
  }

  const { savedata } = question.closest('.section').dataset;
  if (savedata) saveData(quizResults, savedata, { invisible: true });

  const setupShareLinks = (result, shareText, resultPath) => {
    const shareParagraph = result.querySelector('div > p:last-of-type');
    shareParagraph.classList.add('share-icons');
    shareParagraph.setAttribute('data-type', 'share-icons');
    const shareIcons = result.querySelector('.share-icons');
    if (!shareIcons) return;

    const resultUrl = new URL(window.location.href);
    resultUrl.hash = '';
    const cleanUrl = resultUrl.toString();
    const shareUrl = encodeURIComponent(`${cleanUrl}/${resultPath}`);
    const shareTextAndUrl = encodeURIComponent(`${shareText?.trim().replace(/<br>/g, '\n')} ${cleanUrl}/${resultPath}`);

    const linksConfig = {
      facebook: {
        href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        target: '_blank',
      },
      x: {
        href: `https://x.com/intent/tweet?text=${shareTextAndUrl}`,
        target: '_blank',
      },
      linkedin: {
        href: `https://www.linkedin.com/sharing/share-offsite/?text=${shareTextAndUrl}`,
        target: '_blank',
      },
      'chain-link': {
        href: '#copy-to-clipboard',
        target: '_self',
      },
    };

    Object.entries(linksConfig).forEach(([label, { href, target }]) => {
      const link = shareIcons.querySelector(`a[aria-label="${label}"]`);
      if (link) {
        link.setAttribute('aria-label', label);
        link.setAttribute('target', target);
        link.href = href;
      }
    });
  };

  question.style.display = 'none';
  const scoreRanges = [
    {
      min: 0, max: 2, resultIndex: 0, shareText: shareTexts.get(0), resultUrl: 'result-1',
    },
    {
      min: 3, max: 4, resultIndex: 1, shareText: shareTexts.get(1), resultUrl: 'result-2',
    },
    {
      min: 5, max: 6, resultIndex: 2, shareText: shareTexts.get(2), resultUrl: 'result-3',
    },
    {
      min: 7, max: 8, resultIndex: 3, shareText: shareTexts.get(3), resultUrl: 'result-4',
    },
    {
      min: 9, max: 10, resultIndex: 4, shareText: shareTexts.get(4), resultUrl: 'result-5',
    },
  ];

  const scoreRangesAcq = [
    {
      min: 0, max: 2, resultIndex: 0, shareText: shareTexts.get(0), resultUrl: 'digital-rookie',
    },
    {
      min: 3, max: 3, resultIndex: 1, shareText: shareTexts.get(1), resultUrl: 'scam-spotter',
    },
    {
      min: 4, max: 4, resultIndex: 2, shareText: shareTexts.get(2), resultUrl: 'digital-detective',
    },
    {
      min: 5, max: 5, resultIndex: 3, shareText: shareTexts.get(3), resultUrl: 'cyber-ninja',
    },
  ];

  const foundRange = scoreRanges.find((range) => score >= range.min && score <= range.max);
  const ACQfoundRange = scoreRangesAcq.find((range) => score >= range.min && score <= range.max);

  if (isAcqVariant) {
    const finalQuiz = document.querySelector('.quiz-stepper-container');
    finalQuiz.setAttribute('data-score', ACQfoundRange.resultUrl);
    return;
  }

  trackQuizScreen(isAcqVariant, null, 'results screen');

  if (foundRange && results[foundRange.resultIndex]) {
    results[foundRange.resultIndex].style.display = '';
    setupShareLinks(results[foundRange.resultIndex], foundRange.shareText, foundRange.resultUrl);
  }
}

function decorateScamButtons(question, index, isAcqVariant) {
  // Create flex container for scam/no-scam buttons
  const scamLink = question.querySelector('a[href="#scam"]');
  const noScamLink = question.querySelector('a[href="#no-scam"]');

  if (scamLink && noScamLink) {
    const scamParent = scamLink.parentElement;
    const noScamParent = noScamLink.parentElement;

    // Ensure both parents exist and have the same parent
    if (scamParent && noScamParent && scamParent.parentElement === noScamParent.parentElement) {
      // Create a flex container
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('scam-buttons-container');

      // Get the common parent and remember the position of the first button
      const commonParent = scamParent.parentElement;
      const referenceElement = scamParent;

      // Insert the container exactly where the first button was
      commonParent.insertBefore(buttonContainer, referenceElement);

      // Move both button parents into the container
      buttonContainer.appendChild(scamParent);
      buttonContainer.appendChild(noScamParent);
    }

    // Helper function to setup button behavior
    const setupButton = (button) => {
      if (button.textContent.startsWith('correct: ')) {
        button.classList.add('correct');
        button.textContent = button.textContent.replace('correct: ', '');
      }

      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (userAnswers.has(index)) return;

        const isCorrect = button.classList.contains('correct');
        userAnswers.set(index, isCorrect);

        if (isCorrect) {
          score += 1;
          showCorrect(question, index);
          const result = isAcqVariant ? 'spam' : 'correct';
          trackQuizScreen(isAcqVariant, index + 1, result);
        } else {
          showWrong(question, index);
          const result = isAcqVariant ? 'no-spam' : 'wrong';
          trackQuizScreen(isAcqVariant, index + 1, result);
        }
      });
    };

    // Setup both buttons
    setupButton(scamLink);
    setupButton(noScamLink);
  }
}

function decorateQuestions(questions, results, isAcqVariant) {
  questions.forEach((question, index) => {
    question.classList.add('question');
    question.classList.add(`question-${index + 1}`);
    question.dataset.questionIndex = index + 1;

    processSpecialParagraphs(question, index);
    decorateAnswersList(question, index, isAcqVariant);
    decorateClickQuestions(question, index, isAcqVariant);
    decorateScamButtons(question, index, isAcqVariant);

    // Hide all questions initially
    question.style.display = 'none';

    if (index < questions.length) {
      const nextButton = question.querySelector('a[href="#continue"]');
      if (nextButton && index < questions.length - 1) {
        nextButton.style.display = 'none';
        nextButton.addEventListener('click', () => showQuestion(index + 2, isAcqVariant));
      } else if (nextButton && index === questions.length - 1) {
        nextButton.style.display = 'none';
        nextButton.addEventListener('click', () => showResult(question, results, isAcqVariant));
      }

      const anotherQuiz = question.querySelector('a[href="#quiz-2"]');
      if (anotherQuiz) {
        anotherQuiz.style.display = 'none';
        anotherQuiz.addEventListener('click', (e) => {
          e.preventDefault();
          question.closest('.section').classList.add('fade-out');
          showResult(question, results, isAcqVariant);
          document.querySelector('.quiz-stepper-container').classList.add('fade-in');
          if (isAcqVariant) {
            const newPageLoaded = new WindowLoadStartedEvent((pageLoadStartedInfo) => {
              pageLoadStartedInfo.name = `${page.locale}:consumer:quiz:question form`;
              pageLoadStartedInfo.subSubSection = 'quiz';
              pageLoadStartedInfo.subSubSubSection = 'question form';
              return pageLoadStartedInfo;
            });
            AdobeDataLayerService.push(newPageLoaded);
            AdobeDataLayerService.push(new UserDetectedEvent());
            AdobeDataLayerService.push(
              {
                event: 'form viewed',
                user: {
                  form: 'Who do you protect online?',
                },
              },
            );
            AdobeDataLayerService.push(new WindowLoadedEvent());
          }
        });
      }
    }
  });
}

function decorateResults(results) {
  results.forEach((result, index) => {
    result.classList.add('result');
    result.classList.add(`result-${index + 1}`);
    result.dataset.resultIndex = index + 1;

    // first paragraph is expected to be the result number
    result.querySelector('p').classList.add('result-number');

    const h2 = result.querySelector('h2');
    h2.innerHTML = processStyledText(h2.innerHTML);
    processSpecialParagraphs(result, index);
    result.style.display = 'none';
  });
}

function setupStartButton(block, isAcqVariant, skipStartPage) {
  if (skipStartPage) {
    showQuestion(1, isAcqVariant, skipStartPage);
    return;
  }

  const startButton = block.querySelector('a[href="#start-quiz"]');
  if (startButton) {
    startButton.addEventListener('click', (e) => {
      e.preventDefault();
      showQuestion(1, isAcqVariant);
    });
  }
}

/**
 * Finds a div element whose first paragraph contains the specified search text.
 * When found, removes that paragraph and returns the parent div.
 *
 * @param {HTMLElement} block - The container to search within
 * @param {string} searchText - The text to search for in the first paragraph
 * @returns {HTMLElement|null} - The div containing the specified text, or null if not found
 */
function getDivsBasedOnFirstParagraph(block, searchText) {
  const allDivs = Array.from(block.querySelectorAll('div'));

  const targetDivs = allDivs.filter((div) => {
    const firstParagraph = div.querySelector('p');
    if (firstParagraph?.textContent.includes(searchText)) {
      firstParagraph.remove();
      return true;
    }
    return false;
  });

  return targetDivs.length > 0 ? targetDivs : null;
}

function createSharePopup(element) {
  element.style.maxWidth = `${element.offsetWidth}px`;
  element.style.maxHeight = `${element.offsetHeight}px`;
  const sharePopup = document.createElement('div');
  sharePopup.classList.add('share-popup');
  element.insertAdjacentElement('beforeend', sharePopup);
  return sharePopup;
}

function copyToClipboard(block, caller, popupText, resultPath) {
  let copyText = new URL(`${window.location.origin}${window.location.pathname}${resultPath}`);
  copyText.hash = '';
  copyText = copyText.toString();
  navigator.clipboard.writeText(copyText);

  const popup = block.querySelector('.share-popup') || createSharePopup(block);
  popup.textContent = popupText;
  const translateXValue = Math.abs((popup.offsetWidth - caller.offsetWidth) / 2);
  popup.style = `transform:translateX(-${translateXValue}px); opacity: 1`;
  setTimeout(() => {
    popup.style = `transform:translateX(-${translateXValue}px); opacity:0;`;
  }, 2500);
  caller.appendChild(popup);
}

export default function decorate(block) {
  const {
    resultPage, clipboardText, savedata,
  } = block.closest('.section').dataset;

  const skipStartPage = getMetadata('skip-start-page');
  const [startBlock, ...questionsAndResults] = block.children;
  const isAcqVariant = startBlock.closest('.acq-quiz');
  decorateStartPage(startBlock, isAcqVariant);

  // create turnstileDiv
  if (savedata) {
    const turnstileDiv = document.createElement('div');
    turnstileDiv.id = 'turnstile-container';
    turnstileDiv.className = 'turnstile-box';
    block.appendChild(turnstileDiv);
  }

  if (resultPage) {
    const results = getDivsBasedOnFirstParagraph(block, 'answer-box');
    decorateResults(results);
    results.forEach((result) => {
      result.style.display = '';
    });
    return;
  }

  const questions = getDivsBasedOnFirstParagraph(block, 'question-box');
  const results = getDivsBasedOnFirstParagraph(block, 'answer-box');
  decorateQuestions(questions, results, isAcqVariant);
  decorateResults(results);
  setupStartButton(block, isAcqVariant, skipStartPage);

  const questionsContainer = document.createElement('div');
  questionsContainer.classList.add('questions-container');

  questionsAndResults.forEach((question) => {
    questionsContainer.appendChild(question);
  });

  block.appendChild(questionsContainer);
  if (clipboardText) {
    const shareButtons = block.querySelectorAll('a[href="#copy-to-clipboard"]');
    shareButtons.forEach((shareButton, idx) => {
      shareButton.style.position = 'relative';
      shareButton.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(block, shareButton, clipboardText, `result-${idx + 1}`);
      });
    });
  }

  matchHeights(block, '.scam-buttons-container a');
  decorateIcons(block);
}
