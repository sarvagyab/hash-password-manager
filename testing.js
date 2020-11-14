// #! /usr/bin/env node
// 'use strict';

var CryptoJS = require('crypto-js');

const ITERATIONS = 100203;

const salt = CryptoJS.lib.WordArray.random(512 / 8); // Creating a 512 bit/ 64 bytes salt (Salt size is ideally equal to keysize)

// console.log("Salt - ", salt)

const key512Bits1000Iterations = CryptoJS.PBKDF2("Secret Passphrase", salt, {
  keySize: 512 / 32, // keySize is the size of the key in 4-byte blocks
  iterations: ITERATIONS
});

// console.log("Key - ",key512Bits1000Iterations);
console.log(key512Bits1000Iterations.toString());
console.log(salt.toString());
