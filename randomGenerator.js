// "use strict";

const DEFAULT_PASSWORD_LENGTH = 15;
const DEFAULT_PASSWORD_MIN_LENGTH = 8;

const MAX_UINT8 = Math.pow(2, 8) - 1;
const MAX_UINT32 = Math.pow(2, 32) - 1;

const LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
const UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPECIAL_CASE = "$#@!%^&*()+-,/:;<>[]_~|{}`'?";
const DIGITS = "0123456789";

const REQUIRED_CHARACTER_SETS = [LOWER_CASE, UPPER_CASE, DIGITS, SPECIAL_CASE];

export const passwordGenerator = {

    /**
     * Randomly generates password of given length (if not -1)
     * If provided length is -1, then randomly generates password having length in range [8,15]
     * 
     * @param {number} [length=DEFAULT_PASSWORD_LENGTH] The length of the password to generate.
     * @param {number} [minLengthLower=1] Minimum number of lowercase characters the password should have
     * @param {number} [minLengthUpper=1] Minimum number of uppercase characters the password should have
     * @param {number} [minLengthDigit=1] Minimum number of digits the password should have
     * @param {number} [minLengthSpecial=1] Minimum number of special characters the password should have
     * 
     * @returns {string} password that was generated.
     * 
     * @throws Error if `length` is invalid
     * @throws Error if `minLengthLower` + `minLengthUpper` + `minLengthDigit` + `minLengthSpecial` > `length`
     * 
     * @see https://stackoverflow.com/a/5361965
     * 
     * 
     */
    generatePassword: function (
        length = DEFAULT_PASSWORD_LENGTH,
        minLengthLower = 1,
        minLengthUpper = 1,
        minLengthDigit = 1,
        minLengthSpecial = 1
    ) {

        // If negative than take 0
        minLengthLower = Math.max(0, minLengthLower);
        minLengthUpper = Math.max(0, minLengthUpper);
        minLengthDigit = Math.max(0, minLengthDigit);
        minLengthSpecial = Math.max(0, minLengthSpecial);


        if (length === -1) {
            length = DEFAULT_PASSWORD_MIN_LENGTH + this._randomIndex(DEFAULT_PASSWORD_LENGTH - DEFAULT_PASSWORD_MIN_LENGTH + 1)
        }

        if (length < DEFAULT_PASSWORD_MIN_LENGTH) {
            throw new Error("Requested password length is too short");
        }
        if (length > MAX_UINT8) {
            throw new Error("Requested password length is too long");
        }

        if (minLengthLower + minLengthUpper + minLengthDigit + minLengthSpecial > length) {
            throw new Error('minLengthLower + minLengthUpper + minLengthDigit + minLengthSpecial should be less than length')
        }

        let password = "";

        // randomly select number of lower case letters, upper case letters, digits and special characters such that min length constraints
        // are maintained.

        // below code can be refactored
        let lengthLower = this._randomIndex(length - minLengthLower - minLengthUpper - minLengthDigit - minLengthSpecial) + minLengthLower;
        let lengthUpper = this._randomIndex(length - lengthLower - minLengthUpper - minLengthDigit - minLengthSpecial) + minLengthUpper;
        let lengthDigit = this._randomIndex(length - lengthLower - lengthUpper - minLengthDigit - minLengthSpecial) + minLengthDigit;
        let lengthSpecial = length - lengthLower - lengthUpper - lengthDigit;
        //

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
     * @returns a random number in the range [0,range) and 0 if range == 0
     * @throws Error if 'range' cannot fit in uint8
     */
    _randomIndex: function (range) {

        if (range <= 0) return 0;

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
    _shuffleString: function (str) {

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
