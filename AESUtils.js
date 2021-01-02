import CryptoJS from 'crypto-js';
import * as Constants from './Constants.js';

export function AESencrypt(plainText, key) {
  const iv = CryptoJS.lib.WordArray.random(Constants.AES_KEY_SIZE / 8);
  const parsedKey = CryptoJS.enc.Hex.parse(key);
  const encryptedText = CryptoJS.AES.encrypt(
    plainText,
    parsedKey,
    {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    },
  );
  const cipherText = encryptedText.ciphertext.toString(CryptoJS.enc.Hex);
  return {
    cipherText,
    iv: iv.toString(CryptoJS.enc.Hex),
  };
}

export function AESdecrypt(cipherText, key, iv) {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(cipherText),
  });
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    },
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
