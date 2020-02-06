require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

(async () => {
  const password = await hash('nooneknows', 10);
  await prisma.user.deleteMany({});
  await prisma.user.create({
    data: {
      email: 'furiosa@madmax.com',
      name: 'Furiosa',
      password,
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'First post content',
            published: true,
            type: 'AUDIO'
          },
          {
            title: 'Second Post',
            content: 'Second post content',
            published: false,
            type: 'QUOTE'
          }
        ]
      }
    }
  });
})().then(() => {
  console.log('Seeding complete...');
  process.exit(0);
});
