import CryptoJS from 'crypto-js';

const AES_KEY_SIZE = 256;

export function AESencrypt (plainText, key) {
    const iv = CryptoJS.lib.WordArray.random(AES_KEY_SIZE/8);
    key = CryptoJS.enc.Hex.parse(key);
    const encryptedText = CryptoJS.AES.encrypt( 
        plainText, 
        key,
        { 
            iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );
    const cipherText = encryptedText.ciphertext.toString(CryptoJS.enc.Hex);
    return {
        cipherText,
        iv: iv.toString(CryptoJS.enc.Hex),
    }
}

export function AESdecrypt (cipherText, key, iv) {
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(cipherText),
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        CryptoJS.enc.Hex.parse(key),
        { iv: CryptoJS.enc.Hex.parse(iv),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}