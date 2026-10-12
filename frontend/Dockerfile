FROM node:18-alpine
WORKDIR /myapp/frontend
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]