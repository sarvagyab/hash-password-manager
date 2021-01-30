/* eslint-disable no-console */
import {
  deriveMasterKeyTesting,
  masterHashVerification,
  changeMasterPasswordTesting,
} from './masterPassword.js';

import {
  AesEncryptionTesting,
  loginPasswordEncryptionTesting,
} from './loginPassword.js';

verifyTests();

// Run Tests for all Functions
function verifyTests() {
  let working = true;
  working = working && deriveMasterKeyTesting();
  working = working && masterHashVerification();
  working = working && changeMasterPasswordTesting();
  working = working && AesEncryptionTesting();
  working = working && loginPasswordEncryptionTesting();

  if (working) {
    console.log('All Functions are working correctly');
  } else { console.log("Something's wrong"); }
}
