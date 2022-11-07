const nextConnect = require('next-connect');
import middleware from '../../middleware/middleware';
import { sendMail } from '../../controllers/mailController';

export const config = {
  api: {
    bodyParser: false,
  },
}

const apiRoute = nextConnect({
  onError(err, req, res) {
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