import dotenv from 'dotenv';
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByEmail, createAuthUser } from '../repositories/user.js';

dotenv.config();

const router = Router();

const JWT_SECRET = "secret"; 
const JWT_EXPIRES_IN = "24h";

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName} = req.body;
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }
      const name = `${firstName} ${lastName}`;
      const existing = await findUserByEmail(email);
      if (existing) {
        res.status(409).json({ error: 'Email already in use' });
        return;
      }
      const user = await createAuthUser(email, password, name);
      res.status(201).json({ userId: user.userId, email: user.email, name: user.name });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
      }
      const user = await findUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      const isValid = await bcrypt.compare(password, user.password!);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
      const token = jwt.sign({ sub: user.userId }, JWT_SECRET, options);
      res.json({ token, user: { userId: user.userId, email: user.email, name: user.name } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;