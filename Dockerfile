FROM uninode/puppeteer
WORKDIR /usr/src/app
RUN mkdir prisma
COPY package*.json ./
RUN npm install
COPY .env ./
COPY prisma/schema.prisma ./prisma/
RUN npx prisma2 generate
COPY .next .next
RUN ls -a
COPY public ./
COPY server.js ./
COPY style.css ./
EXPOSE 3000
CMD [ "npm", "start" ]