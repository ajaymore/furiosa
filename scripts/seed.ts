// require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import faker from 'faker';

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
  await Promise.all(
    Array.from(Array(10).keys()).map(async () => {
      return prisma.group.create({
        data: {
          name: faker.random.word(),
          users: {
            create: Array.from(Array(20).keys()).map(() => {
              return {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password
              };
            })
          }
        }
      });
    })
  );
})().then(() => {
  console.log('Seeding complete...');
  process.exit(0);
});
