// "use strict";

const DEFAULT_PASSWORD_LENGTH = 15;
const DEFAULT_PASSWORD_MIN_LENGTH = 8;

const MAX_UINT8 = Math.pow(2, 8) - 1;
const MAX_UINT32 = Math.pow(2, 32) - 1;

const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPECAIL_CASE = "$#@!%^&*()+-,/:;<>[]_~|{}`'?";
const DIGITS = "0123456789";

const REQUIRED_CHARACTER_SETS = [LOWER_CASE, UPPER_CASE, DIGITS, SPECAIL_CASE];

export const passwordGenerator = {

    /**
     * Randomly generates password of given length (if not -1)
     * If provided length is -1, then randomly generates password having length in range [8,15]
     * 
     * @param {number} [length=DEFAULT_PASSWORD_LENGTH] The length of the password to generate.
     * 
     * @returns {string} password that was generated.
     * 
     * @throws Error if `length` is invalid
     * @throws Error if `lengthLower` + `lengthUpper` + `lengthDigit` != `length`
     * 
     * @see https://stackoverflow.com/a/5361965
     * 
     * 
     */
    generatePassword(length = DEFAULT_PASSWORD_LENGTH) {

        if (length === -1) {
            length = DEFAULT_PASSWORD_MIN_LENGTH + this._randomIndex(DEFAULT_PASSWORD_LENGTH - DEFAULT_PASSWORD_MIN_LENGTH + 1)
        }

        if (length < DEFAULT_PASSWORD_MIN_LENGTH) {
            throw new Error("requested password length is too short");
        }

        if (length > MAX_UINT8) {
            throw new Error("requested password length is too long");
        }

        let password = "";

        // randomly select  number of lower case letters, upper case letters and digits such that atleast one from each
        // group exists in the password.

        let lengthLower = this._randomIndex(length - 3) + 1;
        let lengthUpper = this._randomIndex(length - lengthLower - 2) + 1;
        let lengthDigit = this._randomIndex(length - lengthLower - lengthUpper - 2) + 1;
        let lengthSpecial = length - lengthLower - lengthUpper - lengthDigit;

        let lengthOfRequiredCharacterSets = [lengthLower, lengthUpper, lengthDigit, lengthSpecial];


        for (const [idx, charSetString] of REQUIRED_CHARACTER_SETS.entries()) {
            while (lengthOfRequiredCharacterSets[idx]--) {
                password += charSetString[this._randomIndex(charSetString.length)];
            }
        }

        password = this._shuffleString(password);

        return password;

    },

    /**
     * 
     * @param {number} range The range to generate number in
     * @returns a random number in the range [0,range)
     * @throws Error if 'range' cannot fit in uint8
     */
    _randomIndex(range) {
        if (range > MAX_UINT8) {
            throw new Error("`range` cannot fit into uint8");
        }


        // we must discard random number above this value, otherwise it will make 
        // random number generator non-uniform
        const MAX_ACCEPTABLE_VALUE = Math.floor(MAX_UINT8 / range) * range - 1;

        const randomValueArr = new Uint16Array(1);
        do {
            window.crypto.getRandomValues(randomValueArr);
        } while (randomValueArr[0] > MAX_ACCEPTABLE_VALUE);

        return randomValueArr[0] % range;
    },


    /**
     * Shuffle the order of character in the string
     * 
     * @param {string} string to shuffle
     * @returns shuffled string
     * 
     */
    _shuffleString(str) {

        let arr = Array.from(str);

        // Generate all the random numbers that will be needed
        const randomValues = new Uint32Array(arr.length - 1);
        crypto.getRandomValues(randomValues);

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor((randomValues[i - 1] / MAX_UINT32) * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join("");
    }


}

// // example use
// console.log(passwordGenerator.generatePassword());
// console.log(passwordGenerator.generatePassword(10));
// console.log(passwordGenerator.generatePassword(-1)); 
