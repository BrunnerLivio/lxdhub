FROM node:9.6.1

WORKDIR /var/lib/lxdhub

COPY package.json yarn.lock lerna.json ./
RUN yarn --pure-lockfile
COPY . .
RUN yarn bootstrap

ENTRYPOINT [ "yarn", "run" ]
CMD [ "start" ]
