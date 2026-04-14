import jwt from 'jsonwebtoken';

export default function verify_token(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ success: false, error: 'Authorization token is required' });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user_id = decoded.user_id; // { userId, email } so now we will remove userID headache from frontend  now browser only need to send a jwt 

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ success: false, error: 'Token expired' });
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};