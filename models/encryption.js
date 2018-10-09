'use strict';

const crypto = require('crypto');
var Base64 = require('js-base64').Base64;
var serialize = require('php-serialize');
var CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = "SoftjeddahWN27bha45c65jeraalbank";
const IV_LENGTH = 16;

function encrypt_latest_old(text) {
    text = text.toString();
 let iv = crypto.randomBytes(IV_LENGTH);
 let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function encrypt(text){
    return text;
}
function decrypt(text){
    return text;
}
function decrypt_latest_old(text) {
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

const encryptionKey = "12345678912345678912345678912345";
var dec = "";
function decryptx(data) {
    // If no data - return blank string
    if (data !== "") {
        // Check localised cache to save time
            try {
                //  Decode and parse required properties
                var b64 = Base64.decode(data);
                var json = JSON.parse(b64);
                var iv = Buffer.from(json.iv, "base64");
                var value = Buffer.from(json.value, "base64");
                console.log("11");

                // Create decipher
                var decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);

                // Decrypt
                var decrypted = decipher.update(value, 'binary', 'utf8');
                decrypted += decipher.final('utf8');

                // Unserialize
                var unserialized = serialize.unserialize(decrypted);

                // Store in cache
                dec = unserialized;

                return unserialized;
            }
            catch(e) {
                console.log(e);
                return "";
            }
        
    }
    else {
        return "";
    }

}

function encryptx(text) {
    console.log("in encrypt")
    text = text.toString();
    console.log("1")
    let iv = crypto.randomBytes(16);
    console.log("2")
    var encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(encryptionKey), { iv: CryptoJS.enc.Utf8.parse(iv) });
    
//  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
//  let encrypted = cipher.update(text);
//  encrypted = Buffer.concat([encrypted, cipher.final()]);
//  return iv.toString('hex') + ':' + encrypted.toString('hex');
return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
 
}

module.exports = { decrypt, encrypt };