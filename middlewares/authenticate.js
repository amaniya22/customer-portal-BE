import { verifyAccessToken } from "../utils/jwt";

export default authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "No authorization header",
    });
  }

  const [scheme, token] = authHeader.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") {
    return res.status(401).json({
      message: "Malformed authorization header",
    });
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = { id: payload.user_id, role: payload.user_role };
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};
