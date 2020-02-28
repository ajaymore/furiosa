const express = require('express');
const next = require('next');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { Strategy } = require('passport-local');
const puppeteer = require('puppeteer');
const compression = require('compression');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const { compareSync } = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// simple nodemailer setup example
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '43f12e1ab123c2', // replace with your Mailtrap credentials
    pass: 'your_password'
  },
  debug: true, // show debug output
  logger: true // log information in console
});
const prisma = new PrismaClient();
const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const FileStore = require('session-file-store')(session);

passport.use(
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, cb) => {
      try {
        const user = await prisma.user.findOne({ where: { email } });
        if (!user) {
          return cb(null, false, { message: 'User not found!' });
        }
        const valid = compareSync(password, user.password);
        if (!valid) {
          return cb(null, false, { message: 'Password incorrect!' });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await prisma.user.findOne({ where: { id } });
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

const server = express();

// server.use(morgan("combined"));
server.use(compression());
server.use(flash());
server.use((req, res, nextMiddleware) => {
  if (req.url === '/api/graphql') {
    return nextMiddleware();
  }
  return express.json()(req, res, nextMiddleware);
});
server.use(express.urlencoded({ extended: false }));
server.use(
  session({
    store: new FileStore({
      path: path.join(__dirname, 'sessions'),
      secret: 'eith7Yi0quigeadeXa'
    }),
    secret: 'eith7Yi0quigeadeXa',
    resave: false,
    saveUninitialized: false
  })
);
server.use(passport.initialize());
server.use(passport.session());
server.use(async (req, res, nextMiddleware) => {
  req.puppeteer = puppeteer;
  req.prisma = prisma;
  nextMiddleware();
});

server.post(
  '/auth/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

server.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

server.post('/auth/returnTo', (req, res) => {
  req.session.returnTo = req.body.returnTo;
  res.end();
});

server.get('/auth/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(400).json({ message: 'User not logged in' });
  }
});

server.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

app.prepare().then(() => {
  server.use((req, res) => app.getRequestHandler()(req, res));
});
