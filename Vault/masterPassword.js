import { getVaultData, setVaultData } from './vaultManager.js';

const setMasterPassword = (cipherText, iv, masterSalt, masterHash) => {
  const vaultData = {};
  vaultData.master_pwd_salt = masterSalt;
  vaultData.encryption_key = cipherText;
  vaultData.encryption_key_iv = iv;
  vaultData.master_key_hash = masterHash;
  setVaultData(vaultData);
};

const getMasterPassword = () => {
  const vaultData = getVaultData();
  return {
    masterSalt: vaultData.master_pwd_salt,
    masterHash: vaultData.master_key_hash,
  };
};

const getDecryptedMasterPassword = () => {
  const vaultData = getVaultData();
  const masterPassword = vaultData.DecryptedMasterPassword;
  return masterPassword;
};

const setDecryptedMasterPassword = (password) => {
  const vaultData = getVaultData();
  vaultData.DecryptedMasterPassword = password;
  setVaultData(vaultData);
};

const deleteDecryptedMasterPassword = () => {
  const vaultData = getVaultData();
  delete vaultData.DecryptedMasterPassword;
  setVaultData(vaultData);
};

const getEncryptionKey = () => {
  const vaultData = getVaultData();
  return {
    encryptionKey: vaultData.encryption_key,
    encryptionKeyIV: vaultData.encryption_key_iv,
  };
};

export {
  setMasterPassword,
  getMasterPassword,
  getDecryptedMasterPassword,
  setDecryptedMasterPassword,
  deleteDecryptedMasterPassword,
  getEncryptionKey,
};
