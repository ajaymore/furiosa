require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

(async () => {
  const password = await hash('nooneknows', 10);
  await prisma.user.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.user.create({
    data: {
      email: 'furiosa@madmax.com',
      name: 'Furiosa',
      password,
      groups: {
        create: {
          name: 'Super Admins'
        }
      }
    }
  });
})().then(() => {
  console.log('Seeding complete...');
  process.exit(0);
});
