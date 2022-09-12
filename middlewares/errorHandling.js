const status = require("http-status");

const error = (err, req, res, next) => {
  const code = status[err.cause] || 500;
  // console.log(err);
  res.status(code).json({
    error: {
      status: code,
      name: err.name,
      message: err.message,
    },
  });
};

module.exports = error;
