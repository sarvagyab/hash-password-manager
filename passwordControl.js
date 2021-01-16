import { AESdecrypt, AESencrypt } from './AESUtils.js';
import { getEncryptionKey } from './masterPassword.js';

export function encryptLoginPassword(
  _masterPasswordObject,
  _encryptionKeyObject,
  masterPassword,
  loginPassword,
) {
  const encryptionKey = getEncryptionKey(
    _masterPasswordObject, _encryptionKeyObject, masterPassword,
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
) {
  const encryptionKey = getEncryptionKey(
    _masterPasswordObject, _encryptionKeyObject, masterPassword,
  );
  if (!encryptionKey) { return false; }
  const { cipherText, iv } = loginPasswordEncrypted;
  const decryptedLoginPassword = AESdecrypt(cipherText, encryptionKey, iv);
  return decryptedLoginPassword; // {cipherText, iv}
}
