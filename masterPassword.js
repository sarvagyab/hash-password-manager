import { generatePBK, generateMAC } from './generators.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';

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
  const masterPasswordObject = getMasterPassword(
    password,
    encryptionKey.encryptionKey,
  );
  return masterPasswordObject;
}

export function verifyMasterPassword(_masterKeyObject, password) {
  const { masterKeySalt, masterKeyHash } = _masterKeyObject;
  const masterKey = deriveMasterKey(password, masterKeySalt);
  return verifyMasterPasswordWithKey(masterKeyHash, password, masterKey.hashKey);
}

export function verifyMasterPasswordWithKey(masterKeyHash, password, hashKey) {
  const currentHash = generateMAC(password, hashKey);
  if (currentHash === masterKeyHash) { return true; }
  return false;
}

export function changeMasterPassword(
  _masterPasswordObject,
  _encryptionKeyObject,
  oldPassword,
  newPassword,
) {
  const ekey = getEncryptionKey(_masterPasswordObject, _encryptionKeyObject, oldPassword);
  if (ekey === false) { return false; }
  const newMasterPasswordObject = getMasterPassword(
    newPassword,
    ekey,
  );
  return newMasterPasswordObject;
}

export function getEncryptionKey(_masterPasswordObject, _encryptionKeyObject, password) {
  const { masterKeySalt, masterKeyHash } = _masterPasswordObject;
  const { encryptionKey, encryptionKeyIv } = _encryptionKeyObject;
  const unlockKey = deriveMasterKey(password, masterKeySalt);
  if (!verifyMasterPasswordWithKey(
    masterKeyHash,
    password,
    unlockKey.hashKey,
  )) { return false; }
  const decryptedEncryptionKey = AESdecrypt(
    encryptionKey,
    unlockKey.encryptionKey,
    encryptionKeyIv,
  );
  return decryptedEncryptionKey;
}

function getMasterPassword(password, encryptionKey) {
  const masterKey = deriveMasterKey(password);
  const masterKeyHash = generateMAC(password, masterKey.hashKey);
  const encryptedEncryptionKey = AESencrypt(encryptionKey, masterKey.encryptionKey);
  return ({
    encryptionKey: encryptedEncryptionKey.cipherText,
    encryptionKeyIv: encryptedEncryptionKey.iv,
    masterKeySalt: masterKey.salt,
    masterKeyHash,
  });
}
