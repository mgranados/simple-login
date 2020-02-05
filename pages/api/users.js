const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;

const saltRounds = 10;
const url = 'mongodb://localhost:27017';
const dbName = 'postin';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, callback) {
  const collection = db.collection('user');
  collection.findOne({email}, callback);
}

function createUser(db, email, password, callback) {
  const collection = db.collection('user');
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        userId: v4(),
        email,
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
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    // verify email does not exist already
    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;

      findUser(db, email, function(err, user) {
        if (err) {
          res.status(500).end('Error finding User');
        }
        if (!user) {
          // proceed to Create
          createUser(db, email, password, function(creationResult) {
            if (creationResult.ops.length === 1) {
              res.status(201).json(creationResult.ops[0]);
            }
          });
        } else {
          // User exists
          res.status(403).send('Email exists');
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.status(200).json({users: ['John Doe']});
  }
};
