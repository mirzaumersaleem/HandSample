'use strict';

const crypto = require('crypto');

const ENCRYPTION_KEY = "SoftjeddahWN27bha45c65jeraalbank";
const IV_LENGTH = 16;

function encrypt(text) {
    text = text.toString();
 let iv = crypto.randomBytes(IV_LENGTH);
 let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
 let textParts = text.split(':');
 let iv = new Buffer(textParts.shift(), 'hex');
 let encryptedText = new Buffer(textParts.join(':'), 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let decrypted = decipher.update(encryptedText);

 decrypted = Buffer.concat([decrypted, decipher.final()]);
 decrypted = decrypted.toString();
 decrypted = parseInt(decrypted, 10);
 return decrypted;
}

module.exports = { decrypt, encrypt };