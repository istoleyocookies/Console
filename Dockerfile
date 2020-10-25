FROM node:15.0-alpine3.12

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
RUN apk --no-cache add --virtual native-deps git \
    g++ gcc libgcc libstdc++ linux-headers make python2 && \
    npm install && \
    npm run build

FROM nginx:1.19-alpine
COPY --from=0 /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
