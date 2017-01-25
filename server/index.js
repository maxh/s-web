import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import morgan from 'morgan';

import auth from './routes/auth';
import permissions from './routes/permissions';

import settings from './settings';


const app = express();

app.use(cookieParser());
app.use(cookieSession({ secret: settings.keys.scoutWebSessionKey }));

if (true || process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const forceHttpsUnlessDev = (req, res, next) => {
  if ((process.env.NODE_ENV === 'production' ||
       process.env.NODE_ENV === 'staging') &&
      req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  return next();
};
app.use(forceHttpsUnlessDev);
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/auth', auth);
app.use('/permissions', permissions);

app.listen(settings.port, () => {
  // eslint-disable-next-line no-console
  console.log('Server listening on: ', settings.port);
});
