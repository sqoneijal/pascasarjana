FROM alpine:3.19

# Install Nginx
RUN apk --no-cache --update add \
   nginx \
   php83 \
   php83-fpm \
   php83-pecl-redis \
   php83-fileinfo \
   tzdata \
   && rm -rf /var/cache/apk/*

ENV TZ=Asia/Jakarta

RUN mkdir -p /var/www/html
WORKDIR /var/www/html
COPY . /var/www/html

RUN ln -s /usr/bin/php83 /usr/bin/php

COPY ./nginx.conf /etc/nginx/http.d/default.conf

RUN chmod -R 777 media
RUN chown -R nginx:nginx media

# Port yang akan digunakan oleh Nginx
EXPOSE 80

# Command untuk menjalankan Nginx pada background
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "-c", "nginx && php-fpm83 -F"]