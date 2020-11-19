import { passwordGenerator } from './randomGenerator.js';
import { deriveMasterKey } from './generateMasterKey.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import Vault from './Vault.js';  

export function setMasterPassword(password){
    // const randomPassword = passwordGenerator();
    const encryptionKey = deriveMasterKey(randomPassword); // Encryption Key that will be used to encrypt all passwords, should be based on a randomly generated secure password
    // The above two lines can/should be replaced to directly generate a cryptographically secure random Key for AES encryption
    // encryptionKey will be used to encrypt decrypt all our passwords and protection is utmost priority
    const masterKey = deriveMasterKey(password);
    const encryptedEncryptionKey = AESencrypt(encryptionKey.encryptionKey, masterKey.encryptionKey);
    Vault.setMasterPassword(encryptedEncryptionKey.cipherText, encryptedEncryptionKey.iv, masterKey.salt);
}

// export function verifyMasterPassword(password) {
    // To cover if master password is not set and if set, then it is right or not
// }

// Not to be used before verification mechanisms are added
// function changeMasterPassword(oldPassword, newPassword){
//     changeMasterPassword(oldPassword)
// }

export function getEncryptionKey(password){
    const masterPassword = Vault.getMasterPassword();
    const encryptedEncryptionKey = masterPassword.encryptionKey;
    const unlockKey = deriveMasterKey(password, masterPassword.masterSalt);
    const encryptionKey = AESdecrypt(encryptedEncryptionKey, unlockKey.encryptionKey, masterPassword.encryptionKeyIV);
    return encryptionKey;
}
