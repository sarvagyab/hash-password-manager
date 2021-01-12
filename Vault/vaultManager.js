const vault = localStorage;

function getVaultData() {
  const data = vault.getItem('HASH_PASSWORD_MANAGER');
  const vaultData = JSON.parse(data);
  return vaultData || {};
}

function setVaultData(data) {
  const vaultData = JSON.stringify(data);
  vault.setItem('HASH_PASSWORD_MANAGER', vaultData);
}

export { getVaultData, setVaultData };
