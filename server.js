const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const sendEmailNotification = require('./notification');
const emailTemplate = require('./emailTemplate');
const fetch = require("node-fetch");
const cookieParser = require('cookie-parser');

const port = 3000;
const app = express();

let pays = [];

app.set('views', './templates');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 60000
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sendEmail = (email) => {
  const emailOptions = {
    to: email,
    subject: 'CSRF Attack: Demo',
    html: emailTemplate(),
  };
  sendEmailNotification(emailOptions);
};

app.get('/', function (req, res) {
  console.log("1");
  res.render('index', {
    isValidSession: req.session.isValid,
    username: req.session.username,
    cardDetails:req.session.cardDetails,
    cvv:req.session.cvv,
    pays
  });
});

app.post('/pay', async function (req, res) {
  console.log("2");
  if (req.session.isValid && req.body.pay) pays.push(req.body.pay);
  await sendEmail(req.session.email);
  res.render('index', {
    isValidSession: req.session.isValid,
    username: req.session.username,
    email:req.session.email,
    cardDetails:req.session.cardDetails,
    cvv:req.session.cvv,
    pays
  });
});

app.get('/session/new', function (req, res) {
  console.log("3");
  req.session.isValid = true;
  req.session.username = 'Parth';
  req.session.email = 'sid.alpha13@gmail.com';
  req.session.cardDetails = '9097878934562456';
  req.session.cvv = '369';
  res.redirect('/');
});

app.get('/user', function (req, res) {
  console.log("4");
  if (req.session.isValid) {
    res.render('user', {
      username: req.session.username,
      email: req.session.email,
    cardDetails:req.session.cardDetails,
    cvv:req.session.cvv,
    });
  } else {
    res.redirect('/');
  }
});

app.post('/user', function (req, res) {
  console.log("5");
  if (req.session.isValid) {
    console.log("inside");
    console.log("req.body", req.body);
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.cardDetails =req.body.cardDetails;
    req.session.cvv=req.body.cvv;
    res.redirect('/user');
  } else {
    res.redirect('/');
  }
});

app.get('/perform-action', async function (req, res) {
  const url = 'http://localhost:3000/user';
  const data = {
    username: 'The Attacker',
    email: 'theattacker@attacker.com'
  };

  if (req.session.isValid) {
    const sessionCookie = req.headers.cookie; // Extract session cookie from the request

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': sessionCookie // Include the session cookie in the headers
        },
        body: JSON.stringify(data),
        redirect: 'manual' // Prevent fetch from automatically following redirects
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.raw());

      const responseBody = await response.text();
      console.log('Response body:', responseBody);
      if (response.ok || response.status === 302) {
        // Follow the redirection manually
        const location = response.headers.get('location');
        if (location) {
          req.session.username = data.username;
          req.session.email = data.email;
          res.setHeader('Location', location);
          res.status(302).json({
            message: 'Session values updated',
            username: req.session.username,
            email: req.session.email
          });
        } else {
          const body = await response.text();
          res.send(body);
        }
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      console.error('Error:', error);
      res.send('Failed to perform the action.');
    }
  } else {
    res.redirect('/');
  }
});

app.listen(port, () => console.log(`The server is listening at http://localhost:${port}`));
