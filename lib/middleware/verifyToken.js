import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Authorization token is missing or invalid.", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decodedToken.userId };
  } catch (err) {
    return { error: "Invalid or expired token.", status: 401 };
  }
}
