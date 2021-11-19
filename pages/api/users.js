const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uuid = require('uuid-random');
// const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

const saltRounds = 10;
const url = 'mongodb://localhost:27017';
const dbName = 'ptestaffing';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, profileId, callback) {
  const collection = db.collection('user');
  collection.findOne({ $or: [{ email }, { profileId }]}, callback);
}

async function createUser(db, firstName, lastName, email, password, profileId, callback) {
  const collection = db.collection('user');
  const confirmationCode = uuid();

  // let transporter = nodemailer.createTransport({
  //   host: "smtp-relay.gmail.com",
  //   port: 587,
  //   requireTLS: true,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "management@ptestaffing.com", 
  //     pass: "********",
  //   },
  // });
  
  // // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: '<management@ptestaffing.com>', // sender address
  //   to: "marcoswade@gmail.com", // list of recipients
  //   subject: "Hello ✔", // Subject line
  //   text: "Hello world?", // plain text body
  //   html: `<a href="https://www.ptestaffing.com">${confirmationCode}</a>`, // html body
  // });
  // console.log("info: %s", info.messageId);

  bcrypt.hash(password, saltRounds, function(err, hash) {

    collection.insertOne(
      {
        userId: v4(),
        firstName,
        lastName,
        email,
        profileId,
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
      assert.notEqual(null, req.body.profileId, 'Profile ID required');
    } catch (bodyError) {
      res.status(403).json({error: true, message: bodyError.message});
    }

    // verify email does not exist already
    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const { email, password, firstName, lastName, profileId } = req.body;

      findUser(db, email, profileId, function(err, user) {
        console.log({ err, user })
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          // proceed to Create
          createUser(db, firstName, lastName, email, password, profileId, function({ ops, ops: [createdUser] }) {
            if (ops.length === 1) {
              const { userId, email, firstName, lastName, profileId } = createdUser;
              const token = jwt.sign(
                {userId, email, firstName, lastName, profileId },
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
          res.status(200).json({error: true, message: 'Profile exists'});
          return;
        }
      });
    });
  } else if (req.method === "GET") {
    client.connect(async (err) => {
      assert.equal(null, err);
      const db = client.db(dbName);
      const collection = db.collection('user');

      const data = await collection.find().toArray();
      
      return res.status(200).json({ data })
    });
  } else {
    // Handle any other HTTP method
    res.status(200).json({users: ['John Doe']});
  }
};
