import { passwordGenerator } from 'randomGenerator';
import { deriveMasterKey } from 'generateMasterKey';

function setMasterPassword(password){
    randomPassword = passwordGenerator();
    encryptionKey = deriveMasterKey(randomPassword); // Encryption Key that will be used to encrypt all passwords, should be based on a randomly generated secure password
    // The above two lines can/should be replaced to directly generate a cryptoghically secure random Key for AES encryption

}


function changeMasterPassword(oldPassword, newPassword){

}

