const { verifyAccessToken } = require("../utils/TokenHandling");

exports.userLogin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) throw new Error("Token required!", { cause: "UNAUTHORIZED" });
    const decoded = await verifyAccessToken(token);
    req.decoded = { id: decoded.id, name: decoded.name, email: decoded.email, type: decoded.type };
    next();
  } catch (error) {
    next(error);
  }
};

exports.isCompany = async (req, res, next) => {
  const { type } = req.decoded;
  try {
    if (type === "company") throw new Error("User authorized only!", { cause: "FORBIDDEN" });
    next();
  } catch (error) {
    next(error);
  }
};

exports.isRecruiter = async (req, res, next) => {
  const { type } = req.decoded;
  try {
    if (type === "jobseeker") throw new Error("Recuiter & company authorized only!", { cause: "FORBIDDEN" });
    next();
  } catch (error) {
    next(error);
  }
};
