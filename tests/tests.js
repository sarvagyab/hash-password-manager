/* eslint-disable no-console */
// import CryptoJS from 'crypto-js';

import {
  deriveMasterKey, setMasterPassword, verifyMasterPassword, changeMasterPassword,
} from '../masterPassword.js';
import { AESdecrypt, AESencrypt } from '../AESUtils.js';
import { passwordGenerator } from '../randomGenerator.js';
import { decryptLoginPassword, encryptLoginPassword } from '../passwordControl.js';

verifyTests();
// encryptionKeyAvailability();

// Run Tests for all Functions
function verifyTests() {
  let working = true;
  working = working && deriveMasterKeyTesting();
  working = working && masterHashVerification();
  working = working && changeMasterPasswordVerification();
  working = working && AesEncryptionTesting();
  working = working && loginPasswordEncryptionTesting();
  // if (typeof window !== 'undefined' && window !== null) {
  //   working = working && RandomPasswordGeneratorTesting();
  // }

  if (working) {
    console.log('All Functions are working correctly');
  } else { console.log("Something's wrong"); }
}

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
  const masterKeyObject = setMasterPassword('myNameIsSarvagya');
  const result = verifyMasterPassword(masterKeyObject, 'myNameIsSarvagya')
    && (!verifyMasterPassword(masterKeyObject, 'myNameIssarvagya'));
  if (result) {
    console.log('Master Password Hash Verification - True');
  } else { console.log('Master Password Hash Verification - False'); }

  return result;
}

// Testing changing of MasterPasswordFunctionality
function changeMasterPasswordVerification() {
  const masterPasswordObject = setMasterPassword('myNameIsSarvagya');
  const { masterKeyHash, masterKeySalt } = masterPasswordObject;
  const { encryptionKey, encryptionKeyIv } = masterPasswordObject;
  const masterKeyObject = { masterKeyHash, masterKeySalt };
  const encryptionkeyObject = { encryptionKey, encryptionKeyIv };
  let result = changeMasterPassword(
    masterKeyObject,
    encryptionkeyObject,
    'myNameIsSarvagya',
    'myNameIsStillSarvagya',
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
    console.log('Change Master Password Verification - True');
  } else { console.log('Change Master Password Verification - False'); }
  return result;
}

// Testing AES encrypt decrypt functions
function AesEncryptionTesting() {
  const passphrase = 'Loreum Ipsum';
  const masterKey = deriveMasterKey('myNameIsSarvagya');
  const encryptedKey = masterKey.encryptionKey;
  const encrypted = AESencrypt(passphrase, encryptedKey);
  const decrytped = AESdecrypt(encrypted.cipherText, encryptedKey, encrypted.iv);
  const result = (passphrase === decrytped);
  if (result) {
    console.log('AESencrypt/AESdecrypt - True');
  } else { console.log('AESencrypt/AESdecrypt - False'); }
  return result;
}

// Testing encyrption decryption of passwords
function loginPasswordEncryptionTesting() {
  const masterPasswordObject = setMasterPassword('myNameIsSarvagya');
  const { masterKeyHash, masterKeySalt } = masterPasswordObject;
  const { encryptionKey, encryptionKeyIv } = masterPasswordObject;
  const masterKeyObject = { masterKeyHash, masterKeySalt };
  const encryptionkeyObject = { encryptionKey, encryptionKeyIv };
  const loginPassword = 'tismyloginpassword';
  const encryptedPassword = encryptLoginPassword(
    masterKeyObject, encryptionkeyObject, 'myNameIsSarvagya', loginPassword,
  );
  const decryptedPassword = decryptLoginPassword(
    masterKeyObject, encryptionkeyObject, 'myNameIsSarvagya', encryptedPassword,
  );
  const result = (decryptedPassword === loginPassword);
  if (result) {
    console.log('Login Password Encryption Working - True');
  } else { console.log('Login Password Encryption Working - False'); }
  return result;
}

// Testing random password generator
function RandomPasswordGeneratorTesting() {
  // preparations
  const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const SPECIAL_CASE = "$#@!%^&*()+-,/:;<>[]_~|{}`'?";
  const DIGITS = '0123456789';

  const _countOccurance = (str) => {
    let LL = 0; let LU = 0; let LS = 0; let
      LD = 0;
    for (const ch of str) {
      if (LOWER_CASE.indexOf(ch) != -1) { ++LL; } else if (UPPER_CASE.indexOf(ch) != -1) { ++LU; } else if (DIGITS.indexOf(ch) != -1) { ++LD; } else if (SPECIAL_CASE.indexOf(ch) != -1) { ++LS; }
    }
    return [LL, LU, LD, LS];
  };

  const _checkError = (func, expectedMsg, ...params) => {
    try {
      func.apply(this, params);
      return false;
    } catch (err) {
      return (expectedMsg == err.message);
    }
  };
  //

  // Check length of generated password
  let password = passwordGenerator.generatePassword(10);
  let result = (password.length == 10);

  // Check correct number of characters are generated or not
  password = passwordGenerator.generatePassword(10, 3, 4, 2, 1);
  const fArray = _countOccurance(password);
  result &= (fArray[0] <= 3 && fArray[1] <= 4 && fArray[2] <= 2 && fArray[3] <= 1);

  // Checking Errors
  result &= _checkError(passwordGenerator.generatePassword, 'Requested password length is too long', 1e10);
  result &= _checkError(passwordGenerator.generatePassword, 'Requested password length is too short', 2);
  result &= _checkError(passwordGenerator.generatePassword, 'minLengthLower + minLengthUpper + minLengthDigit + minLengthSpecial should be less than length', 10, 3, 4, 10, 3);

  if (result) { console.log('Random Password Generation - True'); } else { console.log('Random Password Generation - False'); }

  return result;
}
