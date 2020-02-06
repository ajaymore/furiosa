import Mail from "nodemailer/lib/mailer";
import { NextApiRequest } from "next";
import { PrismaClient, User } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  user: User;
  transporter: Mail;
}

export interface Request extends NextApiRequest, Context {
  puppeteer: any;
}
