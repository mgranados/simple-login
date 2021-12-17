import nextConnect from 'next-connect';
import formidable from 'formidable';

const middleware = nextConnect();

middleware.use((req, res, next) => {
    const { method, headers } = req;
    if ((method == "POST" || method == "PATCH") && headers?.['content-type']?.includes('multipart/form-data')) {
        const form = formidable({ multiples: true });
    
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log({ err });
                next();
                return;
            }
            
            req.files = files;
            req.body = fields;
            next();
        });
    } else {
        next();
    }
})

export default middleware;