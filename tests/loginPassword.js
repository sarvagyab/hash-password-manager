/* eslint-disable no-console */
import { deriveMasterKey, setMasterPassword } from '../masterPassword.js';
import { AESdecrypt, AESencrypt } from '../AESUtils.js';
import { decryptLoginPassword, encryptLoginPassword } from '../passwordUtils.js';

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

export { AesEncryptionTesting, loginPasswordEncryptionTesting };
