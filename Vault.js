import * as LOCAL_STORAGE from 'node-localstorage';
const { LocalStorage } = LOCAL_STORAGE.default;

let vault = null;
if (typeof localStorage === "undefined" || localStorage === null) {
    vault = new LocalStorage('./scratch');
} else {
    vault = localStorage;
}

const setMasterPassword = (cipherText, iv, masterSalt, masterHash)=>{
    const vaultData = {};
    vaultData.master_pwd_salt = masterSalt;
    vaultData.encryption_key = cipherText;
    vaultData.encryption_key_iv = iv;
    vaultData.master_key_hash = masterHash;
    setVaultData(vaultData);
}

const getMasterPassword = ()=>{
    const vaultData = getVaultData();
    return {
        masterSalt: vaultData.master_pwd_salt,
        masterHash: vaultData.master_key_hash,
    }
}

const getEncryptionKey = ()=>{
    const vaultData = getVaultData();
    return {
        encryptionKey: vaultData.encryption_key,
        encryptionKeyIV: vaultData.encryption_key_iv
    }
}

const getDeecryptedMasterPassword = ()=>{
    const vaultData = getVaultData();
    const masterPassword = vaultData.DecryptedMasterPassword;
    return masterPassword;
}

const setDecryptedMasterPassword = ()=>{
    const vaultData = getVaultData();
    vaultData.DecryptedMasterPassword = password;
    setVaultData(vaultData);
}

const deleteDecryptedMasterPassword = ()=>{
    const vaultData = getVaultData();
    delete vaultData["DecryptedMasterPassword"];
    setVaultData(vaultData);
}

const getUsernamesForWebsite = (url)=>{
    const vaultData = getVaultData();
    const urlPasswords = vaultData[url];
    return (urlPasswords || []);
}

const getPasswordForWebsite = (url, index)=>{
    const vaultData = getVaultData();
    const urlPasswords = vaultData[url];
    return urlPasswords[index];
}

const addPasswordForWebsite = (details)=>{
    const vaultData = getVaultData();
    const urlPasswords = vaultData[`${details.url}`];
    if (urlPasswords === undefined || urlPasswords === null)
        urlPasswords = [];
    urlPasswords.push({username: details.username, password: details.password, iv: details.iv});
    setVaultData(vaultData);
}

const deleteSavedPassword = (url, index) => {
    const vaultData = getVaultData();
    const urlPasswords = vaultData[url];
    urlPasswords[index] = null;
    setVaultData(vaultData);
}

const getVaultData = ()=>{
    const data = vault.getItem('HASH_PASSWORD_MANAGER');
    const vaultData = JSON.parse(data);
    return vaultData;
}

const setVaultData = (data)=>{
    const vaultData = JSON.stringify(data);
    vault.setItem('HASH_PASSWORD_MANAGER', vaultData);
}

export { 
    setMasterPassword, 
    getMasterPassword, 
    addPasswordForWebsite, 
    getDeecryptedMasterPassword, 
    deleteDecryptedMasterPassword, 
    setDecryptedMasterPassword,
    deleteSavedPassword,
    getUsernamesForWebsite,
    getPasswordForWebsite,
    getEncryptionKey,
};