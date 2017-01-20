import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import http from 'http';
import path from 'path';

import auth from './routes/auth';

import settings from './settings';


const app = express();

app.use(cookieParser());
app.use(cookieSession({secret: settings.keys.session}));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const forceHttpsUnlessDev = (req, res, next) => {
  if ((process.env.NODE_ENV === 'production' ||
       process.env.NODE_ENV === 'staging') &&
      req.header('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.header('host') + req.url);
  } else {
    return next();
  }
};
app.use(forceHttpsUnlessDev);
app.use(bodyParser.json());


app.use('/auth', auth);


app.listen(settings.port, () => {
  console.log('Server listening on: ', settings.port);
});
