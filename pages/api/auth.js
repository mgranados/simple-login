const nextConnect = require('next-connect');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';
import middleware from '../../middleware/middleware';

export const config = {
  api: {
    bodyParser: false,
  },
}

const url = 'mongodb://localhost:27017';
const dbName = 'ptestaffing';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, callback) {
  const collection = db.collection('user');
  collection.findOne({ email }, callback);
}

function authUser(db, email, password, hash, callback) {
  const collection = db.collection('user');
  bcrypt.compare(password, hash, callback);
}

const apiRoute = nextConnect({
  onError(err, req, res, next) {
    if (err) console.log({ err })
    return res.status(403)
  },
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(middleware);

apiRoute.post((req, res) => {
    //login
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function(err) {
      assert.equal(null, err);
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;

      findUser(db, email, function(err, user) {
        if (err) {
          client.close();
          res.status(299).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          client.close();
          res.status(200).json({error: true, message: 'User not found'});
          return;
        } else {
          const { password: userPassword, userId, profileId, emailConfirmed } = user;
          authUser(db, email, password, userPassword, function(err, match) {
            if (err) {
              client.close();
              res.status(200).json({error: true, message: 'Auth Failed'});
            }
            if (match) {
              const token = jwt.sign(
                { userId, email, profileId, emailConfirmed },
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              client.close();
              return res.status(200).json({token});
            } else {
              client.close();
              res.status(200).json({error: true, message: 'Auth Failed'});
              return;
            }
          });
        }
      });
    });
});

export default apiRoute;


