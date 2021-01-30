import { generatePBK, generateMAC, generatePassword } from './generators.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';

function deriveMasterKey(password = 'development', salt = null) {
  const key = generatePBK(password, salt);
  const masterKey = {};
  masterKey.encryptionKey = key.key.substr(0, key.key.length / 2);
  masterKey.hashKey = key.key.substr(key.key.length / 2);
  masterKey.salt = key.salt;
  return masterKey;
}

function setMasterPassword(password) {
  const randomPassword = generatePassword({
    length: 30, numbers: true, symbols: true, lowercase: true, uppercase: true,
  });
  const encryptionKey = deriveMasterKey(randomPassword);
  const masterPasswordObject = getMasterPassword(
    password,
    encryptionKey.encryptionKey,
  );
  return masterPasswordObject;
}

function verifyMasterPassword(_masterKeyObject, password) {
  const { masterKeySalt, masterKeyHash } = _masterKeyObject;
  const masterKey = deriveMasterKey(password, masterKeySalt);
  return verifyMasterPasswordWithKey(masterKeyHash, password, masterKey.hashKey);
}

function verifyMasterPasswordWithKey(masterKeyHash, password, hashKey) {
  const currentHash = generateMAC(password, hashKey);
  if (currentHash === masterKeyHash) { return true; }
  return false;
}

function changeMasterPassword(
  _masterKeyObject,
  _encryptionKeyObject,
  oldPassword,
  newPassword,
  oldPasswordObject = null,
) {
  const ekey = getEncryptionKey(
    _masterKeyObject,
    _encryptionKeyObject,
    oldPassword,
    oldPasswordObject,
  );
  if (ekey === false) { return false; }
  const newMasterPasswordObject = getMasterPassword(
    newPassword,
    ekey,
  );
  return newMasterPasswordObject;
}

function getEncryptionKey(
  _masterKeyObject,
  _encryptionKeyObject,
  password,
  passwordObject = null,
) {
  const { masterKeySalt, masterKeyHash } = _masterKeyObject;
  const { encryptionKey, encryptionKeyIv } = _encryptionKeyObject;
  const unlockKey = passwordObject || deriveMasterKey(password, masterKeySalt);
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

export {
  deriveMasterKey,
  setMasterPassword,
  verifyMasterPassword,
  verifyMasterPasswordWithKey,
  changeMasterPassword,
  getEncryptionKey,
};
