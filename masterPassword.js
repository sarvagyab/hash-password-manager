import { passwordGenerator } from './randomGenerator.js';
import { generatePBK, generateMAC } from './generators.js';
import { AESdecrypt, AESencrypt } from './AESUtils.js';
import * as Vault from './Vault.js';

export function deriveMasterKey(password = 'development', salt = null){
    const key = generatePBK(password, salt);
    const masterKey = {};
    masterKey.encryptionKey = key.key.substr(0,key.key.length/2);
    masterKey.hashKey = key.key.substr(key.key.length/2);
    masterKey.salt = key.salt;
    return masterKey;
}

export function setMasterPassword(password){
    // const randomPassword = passwordGenerator.generatePassword();
    const randomPassword = 'adfsdfuwhfwemfdf';
    const encryptionKey = deriveMasterKey(randomPassword); // Encryption Key that will be used to encrypt all passwords, should be based on a randomly generated secure password
    // The above two lines can/should be replaced to directly generate a cryptographically secure random Key for AES encryption
    // encryptionKey will be used to encrypt decrypt all our passwords and protection is utmost priority
    const masterKey = deriveMasterKey(password);
    const masterKeyHash = generateMAC(password, masterKey.hashKey);
    const encryptedEncryptionKey = AESencrypt(encryptionKey.encryptionKey, masterKey.encryptionKey);
    Vault.setMasterPassword(encryptedEncryptionKey.cipherText, encryptedEncryptionKey.iv, masterKey.salt, masterKeyHash);
}

export function askForMasterPassword() {
    const masterPassword = Vault.getDecryptedMasterPassword();
    if (typeof masterPassword === 'undefined' || masterPassword === null)
        return true;
    else return false;
}

export function setAskForMasterPassword() {
    Vault.deleteDecryptedMasterPassword();
}

export function getDecryptedMasterPassword(){
    return Vault.getDecryptedMasterPassword();
}

export function verifyMasterPassword(password) {
    // To cover if master password is not set and if set, then it is right or not
    const {masterSalt, masterHash} = Vault.getMasterPassword();
    const masterKey = deriveMasterKey(password, masterSalt);
    const currentHash = generateMAC(password, masterKey.hashKey);
    if (currentHash === masterHash)
        return true;
    return false;
}

export function verifyMasterPasswordWithKey(password, hashKey) {
    const currentHash = generateMAC(password, hashKey);
    if (currentHash === Vault.getMasterPassword().master_key_hash)
        return true;
    return false;
}

export function checkMasterPasswordPresent() {
    const val = Vault.getMasterPassword();
    if (typeof val === 'undefined' || val === null || typeof val.masterSalt === 'undefined' || val.masterSalt === null || typeof val.masterHash === 'undefined' || val.masterHash === null) return false;
    return true;
}

// Not to be used before verification mechanisms are added
// function changeMasterPassword(oldPassword, newPassword){
//     changeMasterPassword(oldPassword)
// }

export function getEncryptionKey(password){
    const masterPassword = Vault.getMasterPassword();
    const unlockKey = deriveMasterKey(password, masterPassword.masterSalt);
    if (!verifyMasterPasswordWithKey(password, unlockKey.hashKey)){
        return false;
    }
    const encryptionKey = Vault.getEncryptionKey();
    const encryptedEncryptionKey = encryptionKey.encryptionKey;
    const decryptedEncryptionKey = AESdecrypt(encryptedEncryptionKey, unlockKey.encryptionKey, encryptionKey.encryptionKeyIV);
    return decryptedEncryptionKey;
}
