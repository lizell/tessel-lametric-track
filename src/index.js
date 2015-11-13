// Configuration
const lmAppUrl = 'https://developer.lametric.com/api/V1/dev/widget/update/com.lametric.311efb053874042d3aa0cf8f35426e7e/2';
const lmAccessToken = process.env.LM_ACCESS_TOKEN;

const port = process.env.PORT || 3000;

import request from 'co-request';
import koa from 'koa';
const app = koa();

import views from 'co-views';
const render = views(__dirname + '/assets', { map: { html: 'swig' } });

import routerFactory from 'koa-router';
const router = routerFactory({ prefix: '/' });

function* personal() {
    this.body = yield render('personal.html', { name: this.params.name });
}

function* track() {
    const text = this.params.item.replace(/[\\n\\r]+/, '');
    request({
        method: 'POST',
        url: lmAppUrl,
        headers: {
            Accept: 'application/json',
            'X-Access-Token': lmAccessToken,
            'Cache-Control': 'no-cache',
        },
        body: `{
            "frames": [
                {
                    "index": 0,
                    "text": "${text}",
                    "icon": "i1856"
                }
              ]
            }`,
    }, function error(err) {
        if (err) {
            console.log("Failed", err);
        } else {
            console.log(`Sent ${text} to device`);
        }
    });
    this.body = yield render('track.html', { text: text });
}

router.get('p/:name', personal);
router.get('t/:item', track);

app.use(router.routes());

app.listen(port);

console.log(`Server listening on port ${port}`);
