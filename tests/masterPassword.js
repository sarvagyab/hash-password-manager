/* eslint-disable no-console */
import {
  deriveMasterKey, setMasterPassword, verifyMasterPassword, changeMasterPassword,
} from '../masterPassword.js';

// Testing deriveMasterKey
function deriveMasterKeyTesting() {
  const password = 'myNameIsSarvagya';
  const masterKey = deriveMasterKey(password);
  const verifyKey = deriveMasterKey(password, masterKey.salt);
  const result = (masterKey.encryptionKey === verifyKey.encryptionKey)
    && (masterKey.salt === verifyKey.salt);

  if (result) {
    console.log('deriveMasterKey - True');
  } else { console.log('deriveMasterKey - False'); }
  return result;
}

// Testing verification of masterKey
function masterHashVerification() {
  const masterKeyObject = setMasterPassword('myNameIsSarvagya'); // actually masterPasswordObject
  const result = verifyMasterPassword(masterKeyObject, 'myNameIsSarvagya')
    && (!verifyMasterPassword(masterKeyObject, 'myNameIssarvagya'));
  if (result) {
    console.log('Master Password Hash Verification - True');
  } else { console.log('Master Password Hash Verification - False'); }

  return result;
}

// Testing changing of MasterPasswordFunctionality
function changeMasterPasswordTesting() {
  const masterPasswordObject = setMasterPassword('myNameIsSarvagya');
  const { masterKeyHash, masterKeySalt } = masterPasswordObject;
  const { encryptionKey, encryptionKeyIv } = masterPasswordObject;
  const masterKeyObject = { masterKeyHash, masterKeySalt };
  const encryptionkeyObject = { encryptionKey, encryptionKeyIv };
  const passwordKeyObject = deriveMasterKey('myNameIsSarvagya');
  let result = changeMasterPassword(
    masterKeyObject,
    encryptionkeyObject,
    'myNameIsSarvagya',
    'myNameIsStillSarvagya',
    passwordKeyObject,
  );
  if (result !== false) {
    const newMasterKeyObject = {
      masterKeySalt: result.masterKeySalt,
      masterKeyHash: result.masterKeyHash,
    };
    result = verifyMasterPassword(newMasterKeyObject, 'myNameIsStillSarvagya')
      && !verifyMasterPassword(newMasterKeyObject, 'myNameIsSarvagya');
  }
  if (result) {
    console.log('Change Master Password Testing - True');
  } else { console.log('Change Master Password Testing - False'); }
  return result;
}

export { deriveMasterKeyTesting, masterHashVerification, changeMasterPasswordTesting };
