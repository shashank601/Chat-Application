import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body.user_id = decoded.user_id; // { userId, email } so now we will remove userID headache from frontend  now browser only need to send a jwt

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};