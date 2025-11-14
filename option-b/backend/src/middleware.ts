import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
  try {
    const token = hdr.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as any;
    (req as any).user = decoded;
    next();
  } catch (_e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
