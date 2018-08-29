# Stage 1 - the build process
FROM node:9.6.1 as builder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN yarn

COPY . /usr/src/app

RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]