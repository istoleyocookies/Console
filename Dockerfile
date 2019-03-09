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
    chown -R www:www /var/tmp/nginx/ && \
    openssl req -newkey rsa:4096 -x509 -keyout /etc/ssl/private/faction-self-signed.key -out /etc/ssl/certs/faction-self-signed.pem -days 365 -nodes -subj "/C=''/ST=''/L=''/O=''/OU=''/CN=''"


# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
COPY ./docker_build/nginx.conf /etc/nginx/nginx.conf

RUN npm install --only=production && npm run build && \
    cp -R /app/dist/* /var/www/ && \
    chmod +x ./wait-for-it.sh

EXPOSE 443

# CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT [ "/bin/bash", "startup.sh" ]