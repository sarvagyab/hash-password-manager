import CryptoJS from 'crypto-js';
import {passwordGenerator} from './randomGenerator';
import * as Constants from './Constants.js';

function generatePBK(password, saltPresent = null) {
// Creating a (512 bit / 64 bytes) salt (Salt size is ideally equal to keysize)
  const salt = saltPresent
    || CryptoJS.lib.WordArray
      .random(Constants.PBKDF2_KEY_SIZE_IN_BITS / 8).toString(CryptoJS.enc.Hex);
  const key = CryptoJS.PBKDF2(
    password,
    CryptoJS.enc.Hex.parse(salt),
    {
      keySize: Constants.PBKDF2_KEY_SIZE_IN_BITS / 32, // keySize - size of key in 4-byte blocks
      iterations: Constants.PBKDF2_ITERATIONS,
    },
  ).toString(CryptoJS.enc.Hex);
  return {
    key,
    salt,
  };
}

function generateMAC(text, key) {
  const hash = CryptoJS.HmacSHA256(text, key).toString(CryptoJS.enc.Hex);
  return hash;
}

function generateRandomString() {
  return passwordGenerator.generate();
}

export { generatePBK, generateMAC, generateRandomString as generatePassword };
