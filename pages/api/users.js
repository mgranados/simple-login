const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uuid = require('uuid-random');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

const saltRounds = 10;
const url = 'mongodb://localhost:27017';
const dbName = 'simple-login-db';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, callback) {
  const collection = db.collection('user');
  collection.findOne({email}, callback);
}

async function createUser(db, firstName, lastName, email, password, callback) {
  const collection = db.collection('user');
  const confirmationCode = uuid();

  let transporter = nodemailer.createTransport({
    host: "smtp-relay.gmail.com",
    port: 587,
    requireTLS: true,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "management@ptestaffing.com", 
      pass: "PTES2021!",
    },
  });
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '<management@ptestaffing.com>', // sender address
    to: "marcoswade@gmail.com", // list of recipients
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<a href="https://www.ptestaffing.com">${confirmationCode}</a>`, // html body
  });
  console.log("info: %s", info.messageId);

  bcrypt.hash(password, saltRounds, function(err, hash) {

    collection.insertOne(
      {
        userId: v4(),
        firstName,
        lastName,
        email,
        confirmationCode,
        password: hash,
      },
      function(err, userCreated) {
        assert.equal(err, null);
        callback(userCreated);
      },
    );
  });
}

export default (req, res) => {
  if (req.method === 'POST') {
    // signup
    try {
      assert.notEqual(null, req.body.lastName, 'Last Name required');
      assert.notEqual(null, req.body.firstName, 'First Name required');
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).json({error: true, message: bodyError.message});
    }

    // verify email does not exist already
    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const { email, password, firstName, lastName } = req.body;

      findUser(db, email, function(err, user) {
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          // proceed to Create
          createUser(db, firstName, lastName, email, password, function(creationResult) {
            if (creationResult.ops.length === 1) {
              const { userId, email, firstName, lastName } = creationResult.ops[0];
              const token = jwt.sign(
                {userId, email, firstName, lastName },
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
              return;
            }
          });
        } else {
          // User exists
          res.status(403).json({error: true, message: 'Email exists'});
          return;
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.status(200).json({users: ['John Doe']});
  }
};
