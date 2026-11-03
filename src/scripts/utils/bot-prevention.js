// eslint-disable-next-line import/prefer-default-export
export class BotPrevention {
  static MAX_EXECUTION_TIME = 2 * 60 * 1000;

  static EXECUTION_TIME_LIMIT = 0.5 * 1000;

  static MIN_DIFFICULTY = 2;

  static MIN_COMPLEXITY = 100;

  static POW_CONFIG = {};

  static async solveChallange({pow_challenge, difficulty, complexity, allow_inc}) {
    try {
      const nonces = [];
      let powPrefix = pow_challenge;
      let executionTime = 0;
      const startExecution = Date.now();
      for (let i = 0; i < complexity; i++) {
        const solution = await this.findNonce(powPrefix, difficulty);
        powPrefix += solution.nonce;
        nonces.push(solution.nonce);

        executionTime = Date.now() - startExecution;
        if (allow_inc === true && executionTime >= this.EXECUTION_TIME_LIMIT) {
          break;
        }
        if (this.MAX_EXECUTION_TIME > 0 && executionTime > this.MAX_EXECUTION_TIME) {
          throw new Error('Max execution time exceceded!');
        }
      }
      return { nonces, executionTime };
    } catch (err) {
      return {};
    }
  }

  static generateStringOfZeroes(charNo) {
    let string = '';
    for (let i = 0; i < charNo; i++) {
      string += '0';
    }
    return string;
  }

  static convertHexCharToBinaryString(char) {
    switch (char.toUpperCase()) {
      case '0': return '0000';
      case '1': return '0001';
      case '2': return '0010';
      case '3': return '0011';
      case '4': return '0100';
      case '5': return '0101';
      case '6': return '0110';
      case '7': return '0111';
      case '8': return '1000';
      case '9': return '1001';
      case 'A': return '1010';
      case 'B': return '1011';
      case 'C': return '1100';
      case 'D': return '1101';
      case 'E': return '1110';
      case 'F': return '1111';
      default: return '0000';
    }
  }

  static extractLeadingBitsFromHexString(hexString, numBits) {
    let bitString = '';
    const numChars = Math.ceil(numBits / 4);
    for (let i = 0; i < numChars; i++) {
      bitString = `${bitString}${this.convertHexCharToBinaryString(hexString.charAt(i))}`;
    }
    bitString = bitString.substr(0, numBits);
    return bitString;
  }

  static async findNonce(challenge, difficulty) {
    try {
      const startExecution = Date.now();
      let nonce = 1;
      let executionTime = 1;
      let hashedValue = await this.sha256(challenge + nonce);
      const solutionPrefix = this.generateStringOfZeroes(difficulty);

      while (this.extractLeadingBitsFromHexString(hashedValue, difficulty) !== solutionPrefix) {
        nonce++;
        hashedValue = await this.sha256(challenge + nonce);
        executionTime = Date.now() - startExecution;
        if (this.MAX_EXECUTION_TIME > 0 && executionTime > this.MAX_EXECUTION_TIME) {
          throw new Error('Max execution time exceceded!');
        }
      }
      return { nonce, executionTime };
    } catch (err) {
      return {};
    }
  }

  static async sha256(message) {
    // Encode the message as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // Compute the hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert ArrayBuffer to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert bytes to hex string
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }
}
