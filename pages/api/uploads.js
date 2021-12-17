const nextConnect = require('next-connect');
const mongo = require('mongodb');
const assert = require('assert');
import fs from 'fs';
import middleware from '../../middleware/middleware';
import { useDrive } from './google/gapi';

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

apiRoute.post(({ files }, res) => {
    const { temp = {} } = files;
    const {mimetype, filepath } = temp;
    useDrive((drive) => {
        const fileMetadata = {
            name: `temp`,
            mimetype
        };
        const media = {
            mimetype,
            body: fs.createReadStream(filepath)
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, (err, file) => {
            if (err) console.log({ err });
            const id = file?.data?.id;
            return res.status(200).json({ id });
        });
    });
});

apiRoute.delete(({ query }, res) => {
    const { fileId, filename } = query;
    useDrive((drive) => {
        drive.files.delete({ fileId }, (err, data) => {
            if (!filename) return res.status(200).json({ err, data });
            client.connect(async (err) => {
                assert.equal(null, err);
                const db = client.db(dbName);
                const collection = db.collection('user');

                const update = await collection.updateOne({ [filename]: fileId }, { $set: { [filename]: undefined } }, { upsert: true })
                console.log('image deleted', { update })
                return res.status(200).json({ data })
            });
        })
    });
});

export default apiRoute;