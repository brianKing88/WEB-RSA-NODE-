// 自加密 自解密 案例
const Rsa = require('node-rsa');
const fs = require('fs');
const pri = fs.readFileSync('pri.key', 'utf-8').toString();
const pub = fs.readFileSync('pub.key', 'utf-8').toString();

const text = 'longlong';

const pri_key = new Rsa(pri);
const pub_key = new Rsa(pub);
// console.log(pub_key);
pri_key.setOptions({ encryptionScheme: 'pkcs1' });
pub_key.setOptions({ encryptionScheme: 'pkcs1' });

const encrypted = pub_key.encrypt(text, 'base64');
// console.log(encrypted);
const decrypt = pri_key.decrypt(encrypted, 'utf8');
console.log(decrypt);