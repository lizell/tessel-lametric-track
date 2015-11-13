import koa from 'koa';
const app = koa();

import views from 'co-views';
const render = views(__dirname + '/assets', { map: { html: 'swig' } });

const port = process.env.PORT || 3000;

app.use(function* index() {
    this.body = yield render('personal.html', { name: 'Chrille'});
});

app.listen(port);

console.log(`Server listening on port ${port}`);
