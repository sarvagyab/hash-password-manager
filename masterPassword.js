import { passwordGenerator } from 'randomGenerator';
import { deriveMasterKey } from 'generateMasterKey';

function setMasterPassword(password){
    const randomPassword = passwordGenerator();
    const encryptionKey = deriveMasterKey(randomPassword); // Encryption Key that will be used to encrypt all passwords, should be based on a randomly generated secure password
    // The above two lines can/should be replaced to directly generate a cryptoghically secure random Key for AES encryption
    // encryptionKey will be used to encrypt decrypt all our passwords and protection is utmost priority
    const masterKey = deriveMasterKey(password);
    // masterKey.salt to be stored for future when the user will enter the Master Password again
    encryptedEncry
}


function changeMasterPassword(oldPassword, newPassword){

}

function getMasterPassword(){

}

fucntion setMasterPassword(){

}

