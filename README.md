The purpose of this starter kit is to let you quickly develop your ideas with as little effort as possible.

## Features

1. NextJS api routes
2. GraphQL api with prisma2 CRUD operations support
3. Higher order components for Authentications, WindowSize etc.
4. Material UI as style library
5. Express for setting up custom middlewares
6. Puppeteer for PDF support
7. Passport based session authentication
8. Nodemailer setup for sending emails

## Prerequisites MySQL DB Connection

## OR you can install via docker

```
docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 --restart always -d mysql:latest
docker run --name phpmyadmin -d --link mysql-db:db -p 4444:80 phpmyadmin/phpmyadmin
```

## Setting up project

```
git clone https://github.com/ajaymore/furiosa.git
cd furiosa
npm install
npx prisma2 migrate save --experimental
npx prisma2 migrate up --experimental
npx prisma2 generate
```

## Setting up data

```
npx ts-node --project tsconfig.scripts.json scripts/seed.ts
```

## Whenver schema.prisma is changed

```
npx prisma2 migrate save --experimental
npx prisma2 migrate up --experimental
npx prisma2 generate
```

## Client development

```
# Make sure below comman is run and apollo-cli is installed
npm i -g apollo

# To generate types for a query or mutation
npm run codegen
```

### Docker Test

```
# Change NODE_ENV in Dockerfile to "production"
npm run build
docker build -t furiosa:1.0.0 .
docker run --name furiosa -v $PWD/data:/usr/src/app/data --restart always -p 3000:3000 furiosa:1.0.0
```
