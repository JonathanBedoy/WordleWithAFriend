FROM node:16-alpine AS build
WORKDIR /src
COPY ./FrontEnd/package*.json ./
RUN npm install
COPY ./FrontEnd ./
RUN npm run build
CMD ["npm", "run", "build"]

FROM node:lts-alpine
WORKDIR /usr/app
COPY ./BackEnd/package*.json ./
RUN npm install
COPY ./BackEnd ./
RUN rm -rf public
RUN mkdir public
COPY --from=build /src/dist/ ./public
EXPOSE 5005
CMD ["node", "app.js"]