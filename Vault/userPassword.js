import { getVaultData, setVaultData } from './vaultManager.js';

const getUsernamesForWebsite = (url) => {
  const vaultData = getVaultData();
  const urlPasswords = vaultData[url];
  return (urlPasswords || []);
};

const getPasswordForWebsite = (url, index) => {
  const vaultData = getVaultData();
  const urlPasswords = vaultData[url];
  return urlPasswords[index];
};

const addPasswordForWebsite = ({
  url, username, password, iv,
}) => {
  const vaultData = getVaultData();
  const urlPasswords = vaultData[url] || [];
  urlPasswords.push({
    username, password, iv, created_at: new Date(),
  });
  setVaultData(vaultData);
};

const deleteSavedPassword = (url, index) => {
  const vaultData = getVaultData();
  const urlPasswords = vaultData[url];
  urlPasswords[index] = null;
  setVaultData(vaultData);
};

export {
  getUsernamesForWebsite,
  getPasswordForWebsite,
  addPasswordForWebsite,
  deleteSavedPassword,
};
