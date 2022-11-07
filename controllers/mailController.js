import { useGmail } from '../pages/api/google/gapi';
const Buffer = require('safer-buffer').Buffer;

function makeBody(to, from, subject, message) {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    const encodedMail = Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

export const sendMail = ({ to = '', from = '', subject = '', message = '' }, callback) => {
    // console.log('email success');
    // callback({ to, from, subject, message });
    // return;
    useGmail((gmail, auth) => {
        const raw = makeBody(to, from, subject, message);
        gmail.users.messages.send({
            auth,
            userId: 'me',
            resource: { raw }
        }, function(err, data) {
            callback(err || data)
        });
    })
};