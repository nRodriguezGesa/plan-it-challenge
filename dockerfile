FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN mkdir -p /usr/src/app/data
EXPOSE 3000
CMD ["npm", "run", "start:prod"]