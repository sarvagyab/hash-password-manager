import { generatePBK, generateMAC } from './generators.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import * as Vault from './Vault.js';

export function deriveMasterKey(password = 'development', salt = null) {
  const key = generatePBK(password, salt);
  const masterKey = {};
  masterKey.encryptionKey = key.key.substr(0, key.key.length / 2);
  masterKey.hashKey = key.key.substr(key.key.length / 2);
  masterKey.salt = key.salt;
  return masterKey;
}

export function setMasterPassword(password) {
  // const randomPassword = passwordGenerator.generatePassword();
  const randomPassword = 'adfsdfuwhfwemfdf';
  const encryptionKey = deriveMasterKey(randomPassword);
  // Encryption Key that will be used to encrypt all passwords
  const masterKey = deriveMasterKey(password);
  const masterKeyHash = generateMAC(password, masterKey.hashKey);
  const encryptedEncryptionKey = AESencrypt(encryptionKey.encryptionKey, masterKey.encryptionKey);
  Vault.setMasterPassword(
    encryptedEncryptionKey.cipherText, encryptedEncryptionKey.iv, masterKey.salt, masterKeyHash,
  );
}

export function askForMasterPassword() {
  const masterPassword = Vault.getDecryptedMasterPassword();
  if (typeof masterPassword === 'undefined' || masterPassword === null) {
    return true;
  }
  return false;
}

export function setAskForMasterPassword() {
  Vault.deleteDecryptedMasterPassword();
}

export function getDecryptedMasterPassword() {
  return Vault.getDecryptedMasterPassword();
}

export function verifyMasterPassword(password) {
  // To cover if master password is not set and if set, then it is right or not
  const { masterSalt } = Vault.getMasterPassword();
  const masterKey = deriveMasterKey(password, masterSalt);
  return verifyMasterPasswordWithKey(password, masterKey.hashKey);
}

export function verifyMasterPasswordWithKey(password, hashKey) {
  const { masterHash } = Vault.getMasterPassword();
  const currentHash = generateMAC(password, hashKey);
  if (currentHash === masterHash) { return true; }
  return false;
}

export function checkMasterPasswordPresent() {
  const val = Vault.getMasterPassword();
  if (
    typeof val === 'undefined' || val === null
    || typeof val.masterSalt === 'undefined'
    || val.masterSalt === null || typeof val.masterHash === 'undefined'
    || val.masterHash === null
  ) { return false; }
  return true;
}

export function changeMasterPassword(oldPassword, newPassword) {
  const ekey = getEncryptionKey(oldPassword);
  if (ekey === false) { return false; }
  const masterKey = deriveMasterKey(newPassword);
  const masterKeyHash = generateMAC(newPassword, masterKey.hashKey);
  const encryptedEncryptionKey = AESencrypt(ekey, masterKey.encryptionKey);
  Vault.setMasterPassword(
    encryptedEncryptionKey.cipherText,
    encryptedEncryptionKey.iv,
    masterKey.salt,
    masterKeyHash,
  );
  return true;
}

export function getEncryptionKey(password) {
  const { masterSalt } = Vault.getMasterPassword();
  const unlockKey = deriveMasterKey(password, masterSalt);
  if (!verifyMasterPasswordWithKey(password, unlockKey.hashKey)) { return false; }
  const encryptionKey = Vault.getEncryptionKey();
  const encryptedEncryptionKey = encryptionKey.encryptionKey;
  const decryptedEncryptionKey = AESdecrypt(
    encryptedEncryptionKey,
    unlockKey.encryptionKey,
    encryptionKey.encryptionKeyIV,
  );
  return decryptedEncryptionKey;
}
