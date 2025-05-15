/**
 * Service to manage the password datastore
 */
/* eslint-disable */

const uppercaseMinCount = 1;
const lowercaseMinCount = 1;
const numberMinCount = 1;
const specialMinCount = 1;

const DEFAULT_SETTINGS = {
    passwordLength: 16,
    includeLettersUppercase: true,
    includeLettersLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    passwordLettersUppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    passwordLettersLowercase: 'abcdefghijklmnopqrstuvwxyz',
    passwordNumbers: '0123456789',
    passwordSpecialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const SecurityReportConstants = {
    // Length and score constants
    minPasswordLength: 8,
    maxPasswordLength: 16,
    minVariationEnforcePasswordLength: 15,
    minVariationLength: 3,
    variationPenalty: 0.15,
    maxScore: 100,
    minScore: 0,
    weakMaxScore: 20,
    poorMaxScore: 40,
    goodMaxScore: 80,
    newPasswordMaxDays: 90,
  
    // Variation keys
    digitsKey: 'digits',
    lowerKey: 'lower',
    upperKey: 'upper',
    nonWordsKey: 'nonWords',

    // Password strength labels
    passwordStrengthWeak: 'weak',
    passwordStrengthPoor: 'poor',
    passwordStrengthGood: 'good',
    passwordStrengthStrong: 'strong',
  
    // Advice constants
    adviceSetLongerPassword: 'SET_LONGER_PASSWORD',
    adviceSetLongerOrMoreComplexPassword: 'SET_LONGER_OR_MORE_COMPLEX_PASSWORD',
    adviceSetLongerPassword10: 'SET_LONGER_PASSWORD_10',
  };
  
  /**
   * Computes a score for the provided password string.
   * @param {string} password - The password to evaluate.
   * @returns {Object} An object containing the score, advice, passwordLength, and variationCount.
   */
  function ratePasswordFromPasswordInfo(password) {
    // If password is empty or undefined, return a minimal score.
    if (!password) {
      return {
        score: SecurityReportConstants.minScore,
        advice: SecurityReportConstants.adviceSetLongerPassword,
        passwordLength: 0,
        variationCount: 0,
      };
    }
  
    // Evaluate character variations using regular expressions.
    const variations = {
      [SecurityReportConstants.digitsKey]: /\d/.test(password),
      [SecurityReportConstants.lowerKey]: /[a-z]/.test(password),
      [SecurityReportConstants.upperKey]: /[A-Z]/.test(password),
      [SecurityReportConstants.nonWordsKey]: /\W/.test(password),
    };
  
    // Count the number of variation conditions that passed.
    const variationCount = Object.values(variations).filter(Boolean).length;
  
    // If the password is too short, return a low score.
    if (password.length <= SecurityReportConstants.minPasswordLength) {
      return {
        score: SecurityReportConstants.minScore,
        advice: SecurityReportConstants.adviceSetLongerPassword,
        passwordLength: password.length,
        variationCount: variationCount,
        minPasswordLength: SecurityReportConstants.minPasswordLength,
      };
    }
  
    // If the password is very long, consider it max score.
    if (password.length >= SecurityReportConstants.maxPasswordLength) {
      return {
        score: SecurityReportConstants.maxScore,
        advice: '',
        passwordLength: password.length,
        variationCount: variationCount,
        maxPasswordLength: SecurityReportConstants.maxPasswordLength,
      };
    }
  
    // Compute a base score based on the password length.
    let score = ((password.length - SecurityReportConstants.minPasswordLength) *
                 SecurityReportConstants.maxScore) /
                (SecurityReportConstants.maxPasswordLength - SecurityReportConstants.minPasswordLength);
  
    // If the password length is relatively short and the variation count is below minimum, apply a penalty.
    if (
      password.length <= SecurityReportConstants.minVariationEnforcePasswordLength &&
      variationCount < SecurityReportConstants.minVariationLength
    ) {
      score = score * (1 - (SecurityReportConstants.minVariationLength - variationCount) * SecurityReportConstants.variationPenalty);
      score = Math.min(score, SecurityReportConstants.maxScore);
      score = Math.max(score, SecurityReportConstants.minScore);
      score = Math.round(score * 10) / 10;
      return {
        score: score,
        advice: SecurityReportConstants.adviceSetLongerOrMoreComplexPassword,
        passwordLength: password.length,
        variationCount: variationCount,
      };
    }
  
    // Clamp the score between minScore and maxScore, round to one decimal place.
    score = Math.min(score, SecurityReportConstants.maxScore);
    score = Math.max(score, SecurityReportConstants.minScore);
    score = Math.round(score * 10) / 10;
    return {
      score: score,
      advice: SecurityReportConstants.adviceSetLongerPassword10,
      passwordLength: password.length,
      variationCount: variationCount,
    };
  }

  function fromRating(rating) {
    const score = rating.score;
    if (score == null || score <= SecurityReportConstants.weakMaxScore) {
      return SecurityReportConstants.passwordStrengthWeak;
    } else if (score < SecurityReportConstants.poorMaxScore) {
      return SecurityReportConstants.passwordStrengthPoor;
    } else if (score < SecurityReportConstants.goodMaxScore) {
      return SecurityReportConstants.passwordStrengthGood;
    } else {
      return SecurityReportConstants.passwordStrengthStrong;
    }
  }

/**
 * checks if the given password complies with the minimal complexity
 *
 * @param password
 * @returns {*}
 */
function isStrongEnough(password, generatorSettings = DEFAULT_SETTINGS) {
    if (
        uppercaseMinCount + lowercaseMinCount + numberMinCount + specialMinCount >
        generatorSettings.passwordLength
    ) {
        // password can never comply, so we skip check
        return true;
    }

    const {
        includeLettersUppercase = true,
        includeLettersLowercase = true,
        includeNumbers = true,
        includeSpecialChars = true,
        passwordLettersUppercase = '',
        passwordLettersLowercase = '',
        passwordNumbers = '',
        passwordSpecialChars = '',
    } = generatorSettings;

    const uc = password.match(
        new RegExp("([" + escapeRegExp(passwordLettersUppercase) + "])", "g")
    );
    const lc = password.match(
        new RegExp("([" + escapeRegExp(passwordLettersLowercase) + "])", "g")
    );
    const n = password.match(
        new RegExp("([" + escapeRegExp(passwordNumbers) + "])", "g")
    );
    const sc = password.match(
        new RegExp("([" + escapeRegExp(passwordSpecialChars) + "])", "g")
    );

    const uc_test_result = includeLettersUppercase ? (
        passwordLettersUppercase.length === 0 ||
        (uc && uc.length >= uppercaseMinCount)
    ) : true;
    const lc_test_result = includeLettersLowercase ? (
        passwordLettersLowercase.length === 0 ||
        (lc && lc.length >= lowercaseMinCount)
    ) : true;
    const n_test_result = includeNumbers ? (
        passwordNumbers.length === 0 || (n && n.length >= numberMinCount)
    ) : true;
    const sc_test_result = includeSpecialChars ? (
        passwordSpecialChars.length === 0 || (sc && sc.length >= specialMinCount)
    ) : true;

    return uc_test_result && lc_test_result && n_test_result && sc_test_result;
}

/**
 * escapes regex string
 *
 * @param str
 * @returns {*}
 */
function escapeRegExp(str) {
    // from sindresorhus/escape-string-regexp under MIT License

    if (typeof str !== "string") {
        throw new TypeError("Expected a string");
    }

    return str.replace(new RegExp("[|\\\\{}()[\\]^$+*?.-]", "g"), "\\$&");
}

/**
 * generates a password based on the length requirement and a string with all allowed characters
 *
 * @param {int}  length The length of the password
 * @param {string}  allowedCharacters A string containing all allowed characters
 *
 * @returns {string} Returns the password
 */
function generatePassword(length, allowedCharacters) {
    const allowed_characters_length = allowedCharacters.length;
    let password = "";

    // Create a Uint32Array(1) for storing the random number
    const randomBuffer = new Uint32Array(1);

    for (let i = 0; i < length; i++) {
        // Use Web Crypto API to fill the array with a random number
        window.crypto.getRandomValues(randomBuffer);
        
        // Use the random value to select a character (normalized to the range)
        const pos = Math.floor((randomBuffer[0] / 0xFFFFFFFF) * allowed_characters_length);
        password = password + allowedCharacters.charAt(pos);
    }

    return password;
}

/**
 *
 * Main function to generate a random password based on the specified settings.
 *
 * @param [passwordLength]
 * @param [passwordLettersUppercase]
 * @param [passwordLettersLowercase]
 * @param [passwordNumbers]
 * @param [passwordSpecialChars]
 *
 * @returns {string} Returns the generated random password
 */
function generate(passwordLength, passwordLettersUppercase, passwordLettersLowercase, passwordNumbers, passwordSpecialChars) {
    let password = "";

    const settings = {
        passwordLength: passwordLength || DEFAULT_SETTINGS.passwordLength,
        passwordLettersUppercase: passwordLettersUppercase || DEFAULT_SETTINGS.passwordLettersUppercase,
        passwordLettersLowercase: passwordLettersLowercase || DEFAULT_SETTINGS.passwordLettersLowercase,
        passwordNumbers: passwordNumbers || DEFAULT_SETTINGS.passwordNumbers,
        passwordSpecialChars: passwordSpecialChars || DEFAULT_SETTINGS.passwordSpecialChars,
        includeLettersUppercase: !!passwordLettersUppercase || DEFAULT_SETTINGS.includeLettersUppercase,
        includeLettersLowercase: !!passwordLettersLowercase || DEFAULT_SETTINGS.includeLettersLowercase,
        includeNumbers: !!passwordNumbers || DEFAULT_SETTINGS.includeNumbers,
        includeSpecialChars: !!passwordSpecialChars || DEFAULT_SETTINGS.includeSpecialChars
    };

    while (!isStrongEnough(password, settings)) {
        password = generatePassword(
            settings.passwordLength,
            settings.passwordLettersUppercase +
            settings.passwordLettersLowercase +
            settings.passwordNumbers +
            settings.passwordSpecialChars
        );
    }
    return password;
}

/**
 *
 * Main function to generate a random password based on the specified settings.
 *
 * @param [settings]
 *
 * @returns {string} Returns the generated random password
 */
function generateWithSettings(settings = DEFAULT_SETTINGS) {

    const {
        includeLettersUppercase = true,
        includeLettersLowercase = true,
        includeNumbers = true,
        includeSpecialChars = true,
    } = settings;

    let alphabet = "";
    if (includeLettersUppercase) {
        alphabet += settings.passwordLettersUppercase;
    }

    if (includeLettersLowercase) {
        alphabet += settings.passwordLettersLowercase;
    }

    if (includeNumbers) {
        alphabet += settings.passwordNumbers;
    }

    if (includeSpecialChars) {
        alphabet += settings.passwordSpecialChars;
    }

    let password = "";
    while (!isStrongEnough(password, settings)) {
        password = generatePassword(
            settings.passwordLength, alphabet
        );
    }
    return password;
}

function updatePasswordStrengthTexts(weakText, poorText, goodText, strongText) {
    SecurityReportConstants.passwordStrengthWeak = weakText;
    SecurityReportConstants.passwordStrengthPoor = poorText;
    SecurityReportConstants.passwordStrengthGood = goodText;
    SecurityReportConstants.passwordStrengthStrong = strongText;
}

const datastorePasswordService = {
    generatePassword: generatePassword,
    generate: generate,
    generateWithSettings: generateWithSettings,
    ratePasswordFromPasswordInfo: ratePasswordFromPasswordInfo,
    fromRating: fromRating,
    updatePasswordStrengthTexts: updatePasswordStrengthTexts,
    SecurityReportConstants,
};

export { datastorePasswordService as default };
//# sourceMappingURL=pass_service.js.map
