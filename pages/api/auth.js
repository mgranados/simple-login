const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

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

function authUser(db, email, password, hash, callback) {
  const collection = db.collection('user');
  bcrypt.compare(password, hash, callback);
}

export default (req, res) => {
  if (req.method === 'POST') {
    //login
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;

      findUser(db, email, function(err, user) {
        if (err) {
          res.status(500).end('Error finding user');
          return;
        }
        if (!user) {
          res.status(404).end('User not found');
          return;
        } else {
          authUser(db, email, password, user.password, function(err, match) {
            if (err) {
              res.status(500).send('Server error matching password');
            }
            if (match) {
              const token = jwt.sign(
                {userId: user.userId, email: user.email},
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
              return;
            } else {
              res.status(401).send('Auth Failed');
              return;
            }
          });
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.statusCode = 401;
    res.end();
  }
};
