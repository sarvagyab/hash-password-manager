import { AESdecrypt, AESencrypt } from "./AESUtils";
import { getEncryptionKey } from "./masterPassword";
import * as Vault from 'Vault.js';

export function addPasswordForWebsite(website, username, password, masterPassword = null) {
    masterPassword = masterPassword || (getUnencryptedMasterPassword());
    encryptionKey = getEncryptionKey(masterPassword);
    if (!encryptionKey) return false;
    encrypted = AESencrypt(password, encryptionKey);
    Vault.addPasswordForWebsite({
        url: website,
        username: username,
        password: encrypted.cipherText,
        iv: encrypted.iv,
    });
}

export function getUsernamesForWebsite(url) {
    urlPasswords = Vault.getUsernamesForWebsite(url);
    return urlPasswords;
}

export function getPasswordForWebsite(url, index, masterPassword = null) {
    encryptedPassword = Vault.getPasswordForWebsite(url,index);
    masterPassword ||= Vault.getUnencryptedMasterPassword();
    encryptionKey = getEncryptionKey(masterPassword);
    if (!encryptionKey) return false;
    decryptedPassword = AESdecrypt(encryptedPassword.password, encryptedPassword, encryptedPassword.iv);
    return decryptedPassword;
}