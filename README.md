# WEB-RSA-NODE-
WEB前后端RSA加密NODE解密   前端使用 JSEncrypt   后端使用 node-rsa 

## 后端node-rsa 来自于[node-rsa](https://github.com/rzcoder/node-rsa)
// 自加密 自解密 案例 
```
const Rsa = require('node-rsa');
const fs = require('fs');
const pri = fs.readFileSync('pri.key', 'utf-8').toString(); //JSEncrypt 生成的私钥和公钥
const pub = fs.readFileSync('pub.key', 'utf-8').toString();

const text = '233333';

const pri_key = new Rsa(pri);
const pub_key = new Rsa(pub);

pri_key.setOptions({ encryptionScheme: 'pkcs1' });
pub_key.setOptions({ encryptionScheme: 'pkcs1' });

const encrypted = pub_key.encrypt(text, 'base64');
const decrypt = pri_key.decrypt(encrypted, 'utf8');
console.log(decrypt);
```
# 正式node 代码 使用koa2框架 
```js
const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');

// 解析------------------
const Rsa = require('node-rsa');
const pri = fs.readFileSync('pri.key', 'utf-8').toString();
const pri_key = new Rsa(pri);
pri_key.setOptions({ encryptionScheme: 'pkcs1' });
// 解析------------------

const index = fs.readFileSync('./web/index.html')
const app = new Koa();
const router = new Router();

router.get('/', ctx => {
    ctx.response.type = 'html';
    ctx.response.body = index;
})

router.post('/post', ctx => {
    const encrypted = ctx.request.body.data;
    // 解析发送回来的内容
    console.time('time');
    const decrypt = pri_key.decrypt(encrypted, 'utf8');
    console.timeEnd('time');
    console.log(decrypt);
    ctx.response.type = 'json';
    ctx.response.body = { data: decrypt }
})

app.use(require('koa-static')(__dirname))
app.use(require('koa-bodyparser')())
app.use(router.routes())
    .use(router.allowedMethods())
    .listen(2000);
console.log(' start 2000')
```


## 前端 [JSEncrypt](https://github.com/travist/jsencrypt)
```js 
const pub_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+jAmi6MKnky+JTv3tmO
SiXAkmk2G4cLTzlCJjWvzb8QnZ3HiG9qDgBJaDlrNGdmAvUkeJxKTpMiPrySmFen
iNJ6Kt/W9VGZdd7n3mQyCO2UyVp3bJxTqWMvwXmYGYVErnZx1hio259Mq1OjAH1Q
xOwwlcmO4QfRsI8t11eWu4nF2KTW+83JxtLmX4iAJEunnUxXC58y1kqeI1AGZkBg
nFSDGaJ26gGNMZ5hNDkpNOsPJb/xMi8+PZMUBBn9UetmUMXS9yj9W4cDFHleF+PT
nad40ELoNRaUs4IXQkenyRqGCChwP/uhtfwO/wxi1z9+RxCdCztt0oKMa28VnxV3
UQIDAQAB
-----END PUBLIC KEY-----`
// const text = 'longlong';

const pri_key = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAr+jAmi6MKnky+JTv3tmOSiXAkmk2G4cLTzlCJjWvzb8QnZ3H
iG9qDgBJaDlrNGdmAvUkeJxKTpMiPrySmFeniNJ6Kt/W9VGZdd7n3mQyCO2UyVp3
bJxTqWMvwXmYGYVErnZx1hio259Mq1OjAH1QxOwwlcmO4QfRsI8t11eWu4nF2KTW
+83JxtLmX4iAJEunnUxXC58y1kqeI1AGZkBgnFSDGaJ26gGNMZ5hNDkpNOsPJb/x
Mi8+PZMUBBn9UetmUMXS9yj9W4cDFHleF+PTnad40ELoNRaUs4IXQkenyRqGCChw
P/uhtfwO/wxi1z9+RxCdCztt0oKMa28VnxV3UQIDAQABAoIBAEnBxtgfAkhgzx1p
nXYMNFwkni0FjllWc0iBkpng0tjq7vWXjW1Igehi+GSKBshPPneo/+TOa12s1aQG
f1T/E9ELp4vIlSIBV94TW5dk3ZHexA71LrPMjEuuufxelobE2TppkWuapVqI3aXM
iMEQykf3XJvBinYSSDrGngr3v8zb0pWxvDUwV6xOGcC0xiHivgdBQ74W/p8Siyi9
YrzCmPAsrLW+7KYPkJl/UUhLJ1AQaArdEMcQTE4b9Yui0V7BqKOned/pjZwoNcR/
XvROddzuRB7+F200Xam/FVlDsyN6nhMejKdwvRArmY7MNdAwDWtydAwg1gnD49tl
PBzQW70CgYEA2/Pg40H5JiR1FTmlX2vfWCbTY3lC5vKxZrOTzYoGcXam3s3IOcc+
9YlHK2mFc8h9+qrgkZErjT1kGrbXjX5ORtNWJjL1qSAHCciQ6l75pfyrnN7Omf5+
KUBGU4sebQZBwn7pKb/OOwo5QandWmN5BFITnLXuuLYpTTpDR9VK6M8CgYEAzL0H
YjeASEE/RMOPIAZdFqlysORwUdUJJgpcTErhjdw0ee59KCypSI/6xHkdrMRKMvqM
1ddRYDTwTpOooE/mpvHXVNO+yap3hlP0t58wWKggzoaC+YHv/kgjmO6l3gaknais
mmluzjGGsksddPt59O0eBcvgnCgFwi9ASRQVZd8CgYA3c1I8uMMhFIvX4AKK/dz+
kjs0lruBEaobpCYc6TEapbkH7oUN2+dJa2Rf02hreh4Ydb/Lsvdx0gpMmc/Zwf/l
5x2O38YC7yoXE1NFYtA5QmvZTmpzdC9GIwgXw7jV73/gkrIhblOFmtw4a6R8RxuZ
NT/wgAVA19uttoSDtYf/DQKBgQC10hVxkup4wIEId0du4FfhHUB+eZCKC9AhGUhY
dJOUoP91XWeGuwrnJv5DZ3AEExn15e4Wpi5dawYSMi2pmOu0TMe3TIh9ncah44NL
YrLTuRPRdUFxhYR1ZOlAEof5AhtE7BvE0WcW9IKzaePSFNZ8vetQqHtjEmPyzHWh
sJVELwKBgF9hv5dT31WngEDJLstZ8KVNG6SgHOY5d03IvUFPhEBf3ENJXw1SGiST
pQ1iKYu+UJeV8nnpgcir071mMonEXlMLeKDK0H7EndecSSZmIAKnLpne3sMM1R+S
X2WURqHeL5Kp2BLqg2J50+HnUsDFgsKfTw/IpU5EMU6RPEyJ6PRM
-----END RSA PRIVATE KEY-----`
$(function () {
    // Run a quick encryption/decryption when they click.
    $('#btn').click(function () {
        const text = $('#input').val();
        // Encrypt with the public key...
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pub_key);
        //加密
        console.time('time');
        var encrypted = encrypt.encrypt(text);
        console.timeEnd('time');
        //这是发给服务端
        $.post('post',
            { data: encrypted },
            function (result) {
                $("#output").html(result.data);
                console.log(result.data);
            }, 'json')

        // JSEncrypt的自解密 Demo 这里官方DEMO
        // Decrypt with the private key...
        // var decrypt = new JSEncrypt();
        // decrypt.setPrivateKey(pri_key);
        // var uncrypted = decrypt.decrypt(encrypted);

        // // Now a simple check to see if the round-trip worked.
        // if (uncrypted == text) {
        //     alert('It works!!!');
        // }
        // else {
        //     alert('Something went wrong....');
        // }
    });
});
```
### html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <style>
    html,
    body {padding: 0;margin: 0;height: 100%;width: 100%;}
    .all {text-align: center;margin: 50px auto;display: block;}
  </style>
  <script src="http://code.jquery.com/jquery-1.8.0.min.js"></script>
  <!-- <script src="./node_modules/node-rsa/src/NodeRSA.js"></script> -->
  <script src="./web/node_modules/jsencrypt/bin/jsencrypt.min.js"></script>
  <script src="./web/index.js"></script>
  <title>Document</title>
</head>
<body>
  <div class="all">
    <textarea id="input" placeholder="请输入要加密的内容" name="" cols="30" rows="10"></textarea>
    <button style="display:block; margin: 0 auto;" id="btn">发送</button>
    <textarea name="" id="output" placeholder="解密后的加密的内容" cols="30" rows="10"></textarea>
  </div>
</body>
</html>
```
# 这里有一个困惑就是关于 publickey放在服务端 然后每次发给客户端,在这个网络上面传输的时候也可以被截获,xss攻击?

