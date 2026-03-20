// src/@types/express/index.d.ts

declare module "express-serve-static-core" {
  interface Request {
    user_id?: string;
  }
}