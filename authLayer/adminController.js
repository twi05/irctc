function isApiKeyValid(req, res, next) {
  const { "x-api-key": apiKey } = req.headers;
  if (!apiKey) {
    return res.status(401).send({ msg: "You are not authorized " });
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).send({ msg: "You are not authorized " });
  }

  next();
}

module.exports = isApiKeyValid;
