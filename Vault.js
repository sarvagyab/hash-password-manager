import * as LOCAL_STORAGE from 'node-localstorage';
const { LocalStorage } = LOCAL_STORAGE.default;

let vault = null;
if (typeof localStorage === "undefined" || localStorage === null) {
    vault = new LocalStorage('./scratch');
} else {
    vault = localStorage;
}

const setMasterPassword = (cipherText, iv, masterSalt)=>{
    const vaultData = {};
    vaultData.master_pwd_salt = masterSalt;
    vaultData.encryption_key = cipherText;
    vaultData.encryption_key_iv = iv;
    setVaultData(vaultData);
}

const getMasterPassword = ()=>{
    const vaultData = getVaultData();
    return {
        encryptionKey: vaultData.encryption_key,
        masterSalt: vaultData.master_pwd_salt,
        encryptionKeyIV: vaultData.encryption_key_iv
    }
}

const getUnenecryptedMasterPassword = ()=>{
    const vaultData = getVaultData();
    const masterPassword = vaultData.unencryptedMasterPassword;
    return masterPassword;
}

const setUnencryptedMasterPassword = ()=>{
    const vaultData = getVaultData();
    vaultData.unencryptedMasterPassword = password;
    setVaultData(vaultData);
}

const deleteUnencryptedMasterPassword = ()=>{
    const vaultData = getVaultData();
    delete vaultData["unencryptedMasterPassword"];
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
    getUnenecryptedMasterPassword, 
    deleteUnencryptedMasterPassword, 
    setUnencryptedMasterPassword,
    deleteSavedPassword,
    getUsernamesForWebsite,
    getPasswordForWebsite,
};