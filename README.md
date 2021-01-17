
# Password Handling Library for Password Managers
A general purpose library which uses industry standard defaults and is easily extensible to use different security measures as per user requirements.

# API

## Variables

| Variables (also used as Data Types) | Type | Details |
| --- | --- | --- |
| `masterPasswordObject` | { `encryptionKey:string`, `encryptionKeyIv:string`, `masterKeySalt:string`, `masterKeyHash:string` } | Master password and encryption key details for first time setting up the password manager
| `masterKeyObject` | { `masterKeySalt:string`, `masterKeyHash:string` } | Details of User Master password |
| `encryptionKeyObject` | { `encryptionKey:string`, `encryptionKeyIv:string` } | Details of Encryption Key actually used to encrypt passwords |


## Functions

| Function | Output |
| --- | --- |
| `setMasterPassword(password:string)` | masterPasswordObject |
| `verifyMasterPassword(masterKeyObject, password:string)` | boolean |
| `changeMasterPassword(masterPasswordObject, encryptionKeyObject, oldPassword:string, newPassword:string)` | masterPasswordObject |
| `encryptLoginPassword(masterPasswordObject, encryptionKeyObject, masterPassword:string, loginPassword:string)` | encryptedLoginPassword:encryptionKeyObject|
| `decryptLoginPassword(masterPasswordObject, encryptionKeyObject, masterPassword:string, encryptedLoginPassword:encryptionKeyObject)` | decryptedPassword:string |
