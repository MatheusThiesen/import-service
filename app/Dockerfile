FROM node:latest
WORKDIR /usr/src
COPY ./package*.json ./package.json
RUN yarn

COPY . .

# EXPOSE 6368
CMD ["npm","run", "dev:app"]