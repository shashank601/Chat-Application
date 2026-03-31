export default function error_handler(err, req, res, next) {
    console.error(err.stack || err);

    const status = err.code || 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({ error: message });
};
