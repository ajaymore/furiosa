## Setting up project

```
git clone
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
