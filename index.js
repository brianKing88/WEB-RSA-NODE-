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
    // console.log(ctx.request.body);
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