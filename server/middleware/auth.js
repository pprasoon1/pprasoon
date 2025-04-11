import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "prasoon");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};