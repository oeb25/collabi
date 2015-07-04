import koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';

const app = koa();

app.use(logger());

app.use(serve('app/build'));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
