const jwt = require('jsonwebtoken');
module.exports.authenticateJsonWebToken = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
  
    try {
      const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
      req.decodedTokenData = decodedToken;
      next();
    } catch (error) {
      return res.status(401).send(error.message);
    }
  };
  