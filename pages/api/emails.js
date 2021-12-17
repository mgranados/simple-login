const nextConnect = require('next-connect');
const mongo = require('mongodb');
const assert = require('assert');
import fs from 'fs';
import middleware from '../../middleware/middleware';
import { sendMail } from '../../controllers/mailController';
const nodemailer = require("nodemailer");

export const config = {
  api: {
    bodyParser: false,
  },
}

const url = 'mongodb://localhost:27017';
const dbName = 'ptestaffing';

const client = new mongo.MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

apiRoute.post(async (req, res) => {
    sendMail({ to: 'marcoswadae@gmail.com', from: 'marcoswade@gmail.com', subject: 'test subject', message: 'test message' }, (data) => {
        return res.status(200).json(data);
    });
});

export default apiRoute;