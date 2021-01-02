import CryptoJS from 'crypto-js';

const PBKDF2_KEY_SIZE_IN_BITS = 512;
const PBKDF2_ITERATIONS = 100203;

export function generatePBK(password, saltPresent = null) {
// Creating a (512 bit / 64 bytes) salt (Salt size is ideally equal to keysize)
  const salt = saltPresent
    || CryptoJS.lib.WordArray.random(PBKDF2_KEY_SIZE_IN_BITS / 8).toString(CryptoJS.enc.Hex);
  const key = CryptoJS.PBKDF2(
    password,
    CryptoJS.enc.Hex.parse(salt),
    {
      keySize: PBKDF2_KEY_SIZE_IN_BITS / 32, // keySize is the size of the key in 4-byte blocks
      iterations: PBKDF2_ITERATIONS,
    },
  ).toString(CryptoJS.enc.Hex);
  return {
    key,
    salt,
  };
}

export function generateMAC(text, key) {
  const hash = CryptoJS.HmacSHA256(text, key).toString(CryptoJS.enc.Hex);
  return hash;
}

export function generateRandomAESencryptionKey() {

}
