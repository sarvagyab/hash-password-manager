import * as LOCAL_STORAGE from 'node-localstorage';
const { LocalStorage } = LOCAL_STORAGE.default;

let vault = null;
if (typeof localStorage === "undefined" || localStorage === null) {
    vault = new LocalStorage('./scratch');
} else {
    vault = localStorage;
}

const Vault = {
    setMasterPassword : (cipherText, iv, masterSalt)=>{
        vault.setItem('HASH_master_pwd_salt', masterSalt);
        vault.setItem('HASH_encryption_key_iv', iv);
        vault.setItem('HASH_encryption_key', cipherText);
    },
    getMasterPassword : ()=>{
        return {
            encryptionKey: vault.getItem('HASH_encryption_key'),
            masterSalt: vault.getItem('HASH_master_pwd_salt'),
            encryptionKeyIV: vault.getItem('HASH_encryption_key_iv')
        }
    },

}


export default Vault;