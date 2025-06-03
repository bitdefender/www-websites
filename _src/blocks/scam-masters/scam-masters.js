import { decorateIcons } from '../../scripts/lib-franklin.js';

const correctAnswersText = new Map();
const wrongAnswersText = new Map();
const showAfterAnswerText = new Map();
const userAnswers = new Map();
const clickAttempts = new Map();
const shareTexts = new Map();
let score = 0;

function decorateStartPage(startBlock) {
  if (!startBlock) return;
  startBlock.classList.add('start-page');

  const legalDiv = document.createElement('div');
  legalDiv.classList.add('legal-links');

  let ul = startBlock.querySelector('ul');
  const listItems = ul.querySelectorAll('li');

  listItems.forEach((listItem) => {
    const paragraph = document.createElement('p');
    paragraph.innerHTML = listItem.innerHTML;
    legalDiv.appendChild(paragraph);
  });

  ul = ul.replaceWith(legalDiv);
}

/**
 * Extracts the first word inside angle brackets and the text after it
 * Example: "<correct-text Correct!>" returns { type: "correct-text", content: "Correct!" }
 * @param {string} text - The text to parse
 * @return {object|null} An object with type and content properties or null if no match
 */
function extractSpecialText(text) {
  // Regular expression to match content inside angle brackets and the text that follows
  const regex = /<([a-zA-Z-]+)\s+([^>]+)>/;
  const match = text.match(regex);

  if (match && match.length >= 3) {
    return {
      type: match[1],
      content: match[2],
    };
  }

  return null;
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

  // Handle both regular and HTML-encoded angle brackets
  let processedHtml = html;

  // Replace HTML-encoded brackets if present
  if (processedHtml.includes('&lt;')) {
    processedHtml = processedHtml.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  // Regular expression to match <word text> pattern anywhere in the string
  // Using a more flexible regex that can find the pattern anywhere in the text
  const regex = /<([a-zA-Z-]+)\s+([^>]+)>/g;

  // Process all matching patterns in the text
  return processedHtml.replace(regex, (match, className, content) => `<span class="${className}">${content}</span>`);
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
  const paragraphs = question.querySelectorAll('p');

  paragraphs.forEach((paragraph) => {
    const text = paragraph.innerText;
    const extractedData = extractSpecialText(text);

    if (extractedData) {
      paragraph.innerHTML = stripOuterBrackets(paragraph.innerHTML);
      paragraph.innerHTML = paragraph.innerHTML.replace(extractedData.type, '');

      paragraph.dataset.type = extractedData.type;
      paragraph.classList.add(extractedData.type);
      switch (paragraph.dataset.type) {
        case 'correct-text':
          correctAnswersText.set(index, paragraph);
          paragraph.remove();
          break;
        case 'wrong-text':
          wrongAnswersText.set(index, paragraph);
          paragraph.remove();
          break;
        case 'show-after-answer-text':
          showAfterAnswerText.set(index, paragraph);
          paragraph.remove();
          break;
        case 'tries':
          paragraph.classList.add('tries');
          break;
        case 'share-icons':
          paragraph.classList.add('share-icons');
          paragraph.innerHTML = paragraph.innerHTML.replace('&lt; ', '').replace('< ', '');
          paragraph.innerHTML = paragraph.innerHTML.replace('&gt;', '').replace('>', '');
          break;
        case 'share-text':
          shareTexts.set(index, paragraph);
          paragraph.remove();
          break;
        default:
          break;
      }
    }
  });
}

/**
 * Processes answer list in questions
 * @param {HTMLElement} question - The question element to process
 * @param {number} questionIndex - The question index
 */
function decorateAnswersList(question, questionIndex) {
  const answersList = question.querySelector('ul');
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

      const questionHeader = question.querySelector('h2');
      if (isCorrect) {
        listItem.classList.add('correct-answer');
        contentDiv.innerHTML = correctAnswersText.get(questionIndex).innerHTML;
        score += 1;
        contentDiv.classList.add('correct-answer');
        question.classList.add('correct-answer');
      } else {
        listItem.classList.add('wrong-answer');
        contentDiv.innerHTML = wrongAnswersText.get(questionIndex).innerHTML;
        contentDiv.classList.add('wrong-answer');
        question.classList.add('wrong-answer');
      }

      const nextButton = question.querySelector('a[href="#continue"]');

      // Show the next button if it exists
      if (nextButton) {
        nextButton.style.display = '';
      }

      answersList.append(showAfterAnswerText.get(questionIndex));
    });
  });
}

function showQuestion(index) {
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
  }
}

function decorateClickableQuestionList(question, index) {
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

function getCoordinates(question, questionIndex) {
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
  const notAScamButton = question.querySelector('a[href="#not-a-scam"]');
  const continueButton = question.querySelector('a[href="#continue"]');
  const triesCounter = question.querySelector('.tries');
  const questionScamTag = question.querySelector('.question-scam-tag');

  const clickableContainer = question.querySelector('.clickable-container');
  clickableContainer.style.display = 'none';

  // Get the wrong answer text and process any styled text within it
  let wrongText = wrongAnswersText.get(questionIndex).innerHTML;
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

  if (triesCounter) {
    triesCounter.style.display = 'none';
  }

  if (questionScamTag) {
    questionScamTag.style.display = 'flex';
  }

  answerList.append(showAfterAnswerText.get(questionIndex));
}

function showCorrect(question, questionIndex) {
  question.classList.add('correct-answer');
  const questionContent = question.querySelector('.question-content');
  questionContent.classList.add('correct-answer');
  const answerList = question.querySelector('.answers-list');
  const notAScamButton = question.querySelector('a[href="#not-a-scam"]');
  const continueButton = question.querySelector('a[href="#continue"]');
  const triesCounter = question.querySelector('.tries');
  const questionScamTag = question.querySelector('.question-scam-tag');

  // Get the wrong answer text and process any styled text within it
  let wrongText = correctAnswersText.get(questionIndex).innerHTML;
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

  if (triesCounter) {
    triesCounter.style.display = 'none';
  }

  if (questionScamTag) {
    questionScamTag.style.display = 'flex';
  }

  answerList.append(showAfterAnswerText.get(questionIndex));
}

function decorateClickQuestions(question, index) {
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
    // Prevent clicks if question already answered
    if (userAnswers.has(index)) return;

    // Increment attempt counter
    const attempts = clickAttempts.get(index) + 1;
    clickAttempts.set(index, attempts);

    // update tries counter
    const triesNumberMatch = triesCounter.innerHTML.match(/\d+/);
    const triesCounterNumber = triesNumberMatch ? triesNumberMatch[0] : null;
    triesCounter.innerHTML = triesCounter.innerHTML.replace(triesCounterNumber, triesCounterNumber - 1);

    // Check if attempts exhausted (count from the original 3 tries)
    if (attempts >= 3) {
      // Mark as wrong answer
      userAnswers.set(index, false);
      showWrong(question, index);
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
      // Prevent the event from reaching the background
      e.stopPropagation();

      // Prevent clicks if question already answered or spot already found
      if (userAnswers.has(index) || clickableSpot.classList.contains('found-spot')) return;

      // Mark the spot as found
      clickableSpot.classList.add('found-spot');
      spotsFound++;

      // Check if all spots have been found
      if (spotsFound >= totalSpots) {
        // Mark as correct answer
        userAnswers.set(index, true);

        showCorrect(question, index);
      }
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

function showResult(question, results) {
  const setupShareLinks = (result, shareText) => {
    const shareIcons = result.querySelector('.share-icons');
    if (!shareIcons) return;
    const url = new URL(window.location.href);
    url.hash = '';
    const cleanUrl = url.toString();
    const shareUrl = encodeURIComponent(cleanUrl);
    const shareLinkedIn = shareIcons.querySelector('a[href*="#share-li"]');
    if (shareLinkedIn) {
      shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&text=${encodeURIComponent(shareText.innerText)}`;
      shareLinkedIn.target = '_blank';
    }
    const shareFacebook = shareIcons.querySelector('a[href*="#share-fb"]');
    if (shareFacebook) {
      shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      shareFacebook.target = '_blank';
    }
    const shareTwitter = shareIcons.querySelector('a[href*="#share-twitter"]');
    if (shareTwitter) {
      shareTwitter.href = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText.innerHTML)}`;
      shareTwitter.target = '_blank';
    }
  };

  question.style.display = 'none';
  const scoreRanges = [
    {
      min: 0, max: 2, resultIndex: 0, shareText: shareTexts.get(0),
    },
    {
      min: 3, max: 4, resultIndex: 1, shareText: shareTexts.get(1),
    },
    {
      min: 5, max: 6, resultIndex: 2, shareText: shareTexts.get(2),
    },
    {
      min: 7, max: 8, resultIndex: 3, shareText: shareTexts.get(3),
    },
    {
      min: 9, max: 10, resultIndex: 4, shareText: shareTexts.get(4),
    },
  ];

  const foundRange = scoreRanges.find((range) => score >= range.min && score <= range.max);

  if (foundRange && results[foundRange.resultIndex]) {
    results[foundRange.resultIndex].style.display = '';
    setupShareLinks(results[foundRange.resultIndex], foundRange.shareText);
  }
}

function decorateQuestions(questions, results) {
  questions.forEach((question, index) => {
    question.classList.add('question');
    question.classList.add(`question-${index + 1}`);
    question.dataset.questionIndex = index + 1;

    processSpecialParagraphs(question, index);
    decorateAnswersList(question, index);
    decorateClickQuestions(question, index);

    // Hide all questions initially except the first one
    question.style.display = 'none';

    if (index < questions.length) {
      const nextButton = question.querySelector('a[href="#continue"]');
      if (nextButton && index < questions.length - 1) {
        nextButton.style.display = 'none';
        nextButton.addEventListener('click', () => showQuestion(index + 2));
      } else if (nextButton && index === questions.length - 1) {
        nextButton.style.display = 'none';
        nextButton.addEventListener('click', () => showResult(question, results));
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

function setupStartButton(block) {
  const startButton = block.querySelector('a[href="#start-quiz"]');
  if (startButton) {
    startButton.addEventListener('click', (e) => {
      e.preventDefault();
      showQuestion(1);
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

export default function decorate(block) {
  const {
    resultPage,
  } = block.closest('.section').dataset;

  if (resultPage) {
    const results = getDivsBasedOnFirstParagraph(block, '<answer>');
    decorateResults(results);
    results.forEach((result) => {
      result.style.display = '';
    });
    return;
  }

  const [startBlock, ...questionsAndResults] = block.children;
  decorateStartPage(startBlock);

  const questions = getDivsBasedOnFirstParagraph(block, '<question>');
  const results = getDivsBasedOnFirstParagraph(block, '<answer>');
  decorateQuestions(questions, results);
  decorateResults(results);
  setupStartButton(block);

  const questionsContainer = document.createElement('div');
  questionsContainer.classList.add('questions-container');

  questionsAndResults.forEach((question) => {
    questionsContainer.appendChild(question);
  });

  block.appendChild(questionsContainer);
  decorateIcons(block);
}
