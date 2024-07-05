const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const sendEmailNotification =  require('./notification');
const emailTemplate = require('./emailTemplate')
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
app.use(csrf());

const sendEmail = (email) => {
  // Email
const emailOptions = {
  to: email,
  subject: 'CSRF Attack: Countermeasure',
  html: emailTemplate(),
};
sendEmailNotification(emailOptions);
}

app.get('/', function (req, res) {
  console.log("1");
  res.render('index', {
    isValidSession: req.session.isValid, 
    username: req.session.username,
    csrfToken: req.csrfToken(),
    reviews
  });
});

app.post('/reviews', async function (req, res) {
  console.log("2");
  if (req.session.isValid && req.body.newReview) reviews.push(req.body.newReview);
  await sendEmail(req.session.email);
	res.render('index', {
    isValidSession: req.session.isValid,
    username: req.session.username,
    csrfToken: req.csrfToken(),
    reviews
  });
});

app.get('/session/new', function (req, res) {
  console.log("3");
  req.session.isValid = true;
  req.session.username = 'Parth';
  req.session.email = 'psshah0411@gmail.com';
  res.redirect('/');
});

app.get('/user', function (req, res) {
  console.log("4");
  if (req.session.isValid) {
    res.render('user', {
      username: req.session.username, 
      email: req.session.email,
      csrfToken: req.csrfToken()
    });
  } else {
    res.redirect('/');
  }
});

app.post('/user', function (req, res) {
  console.log("5");
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
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log('Success:', responseData);
        res.send('Action performed successfully!');
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      console.error('Error:', error);
      res.send('Invalid csrf token');
    }
  });

app.listen(port, () => console.log(`The server is listening at http://localhost:${port}`));

