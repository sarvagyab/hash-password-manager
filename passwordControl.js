import * as Vault from './Vault.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import { getEncryptionKey } from './masterPassword.js';

export function addPasswordForWebsite(website, username, password, masterPasswordArg = null) {
  const masterPassword = masterPasswordArg || (Vault.getDecryptedMasterPassword());
  const encryptionKey = getEncryptionKey(masterPassword);
  if (!encryptionKey) { return false; }
  const encrypted = AESencrypt(password, encryptionKey);
  Vault.addPasswordForWebsite({
    url: website,
    username,
    password: encrypted.cipherText,
    iv: encrypted.iv,
  });
  return true;
}

export function getUsernamesForWebsite(url) {
  const urlPasswords = Vault.getUsernamesForWebsite(url);
  return urlPasswords;
}

export function getPasswordForWebsite(url, index, masterPasswordArg = null) {
  const encryptedPassword = Vault.getPasswordForWebsite(url, index);
  const masterPassword = masterPasswordArg || Vault.getUnencryptedMasterPassword();
  const encryptionKey = getEncryptionKey(masterPassword);
  if (!encryptionKey) { return false; }
  const decryptedPassword = AESdecrypt(
    encryptedPassword.password, encryptedPassword, encryptedPassword.iv,
  );
  return decryptedPassword;
}
