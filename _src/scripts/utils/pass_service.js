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

const datastorePasswordService = {
    generatePassword: generatePassword,
    generate: generate,
    generateWithSettings: generateWithSettings,
    escapeRegExp: escapeRegExp,
    isStrongEnough: isStrongEnough,
};

export default datastorePasswordService;