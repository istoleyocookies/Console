FROM node:alpine

RUN apk add --no-cache \
            nginx \
            git \
            bash \
            openssl && \
    adduser -D -g 'www' www && \
    rm -rf /var/www/* && \
    chown -R www:www /var/lib/nginx && \
    chown -R www:www /var/www && \
    chown -R www:www /var/tmp/nginx/


# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
COPY ./docker_build/nginx.conf /etc/nginx/nginx.conf

RUN npm install && npm run build && \
    cp -R /app/dist/* /var/www/ && \
    rm -rf /app/node_modules && \
    rm -rf /app/dist && \
    rm -rf /app/docker_build && \
    rm -rf *.json && \
    rm -rf *.js && \
    rm -rf Dockerfile && \
    rm -rf CODE_OF_CONDUCT.md && \
    chmod +x ./wait-for-it.sh 

EXPOSE 443

# CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT [ "/bin/bash", "startup.sh" ]