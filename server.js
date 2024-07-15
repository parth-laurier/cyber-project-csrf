const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const sendEmailNotification = require('./notification');
const emailTemplate = require('./emailTemplate');
const fetch = require("node-fetch");

const port = 3000;
const app = express();

let reviews = [];

app.set('views', './templates');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(session({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(csrf());

const sendEmail = (email, csrfToken) => {
  const emailOptions = {
    to: email,
    subject: 'CSRF Attack: Countermeasure',
    html: emailTemplate(csrfToken),
  };
  sendEmailNotification(emailOptions);
};

app.get('/', function (req, res) {
  console.log('1');
  res.render('index', {
    isValidSession: req.session.isValid,
    username: req.session.username,
    csrfToken: req.csrfToken(),
    reviews
  });
});

app.post('/reviews', async function (req, res) {
  console.log('2');
  if (req.session.isValid && req.body.newReview) reviews.push(req.body.newReview);
  await sendEmail(req.session.email, req.csrfToken());
  res.render('index', {
    isValidSession: req.session.isValid,
    username: req.session.username,
    csrfToken: req.csrfToken(),
    reviews
  });
});

app.get('/session/new', function (req, res) {
  console.log('3');
  req.session.isValid = true;
  req.session.username = 'Guneet';
  req.session.email = 'sid.alpha13@gmail.com';
  res.redirect('/');
});

app.get('/user', function (req, res) {
  console.log('4');
  if (req.session.isValid) {
    res.render('user', {
      username: req.session.username,
      email: req.session.email,
      csrfToken: req.csrfToken()
    });
  } else {
    console.log('5');
    res.redirect('/');
  }
});

app.post('/user', function (req, res) {
  console.log('6');
  if (req.session.isValid) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
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
          res.send(responseBody);
        }
      } else {
        res.status(response.status).send(responseBody);
      }
    } catch (error) {
      console.error('Error:', error);
      res.send(error);
    }
  } else {
    res.redirect('/');
  }
});

app.listen(port, () => console.log(`The server is listening at http://localhost:${port}`));
