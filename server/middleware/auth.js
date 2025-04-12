import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for the header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token found in header");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, "prasoon"); // Use env var in production!
    req.user = decoded;
    console.log("✅ Token verified. User:", decoded);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
