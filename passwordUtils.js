import ZXCVBN from 'zxcvbn';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import { getEncryptionKey } from './masterPassword.js';

export function encryptLoginPassword(
  _masterPasswordObject,
  _encryptionKeyObject,
  masterPassword,
  loginPassword,
  masterPasswordKeyObject = null,
) {
  const encryptionKey = getEncryptionKey(
    _masterPasswordObject, _encryptionKeyObject, masterPassword, masterPasswordKeyObject,
  );
  if (!encryptionKey) { return false; }
  const encrypted = AESencrypt(loginPassword, encryptionKey);
  return encrypted; // {cipherText, iv}
}

export function decryptLoginPassword(
  _masterPasswordObject,
  _encryptionKeyObject,
  masterPassword,
  loginPasswordEncrypted,
  masterPasswordKeyObject = null,
) {
  const encryptionKey = getEncryptionKey(
    _masterPasswordObject, _encryptionKeyObject, masterPassword, masterPasswordKeyObject,
  );
  if (!encryptionKey) { return false; }
  const { cipherText, iv } = loginPasswordEncrypted;
  const decryptedLoginPassword = AESdecrypt(cipherText, encryptionKey, iv);
  return decryptedLoginPassword; // {cipherText, iv}
}

export function checkPasswordStrength(password) {
  return ZXCVBN.zxcvbn(password);
}
