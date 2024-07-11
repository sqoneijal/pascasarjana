FROM alpine:3.19

# Install Nginx
RUN apk --no-cache --update add \
   curl \
   nginx \
   php83 \
   php83-fpm \
   php83-intl \
   php83-mysqli \
   php83-pdo_pgsql \
   php83-pgsql \
   php83-openssl \
   php83-iconv \
   php83-mbstring \
   php83-phar \
   php83-curl \
   php83-dom \
   php83-tokenizer \
   php83-ctype \
   php83-session \
   php83-pecl-redis \
   php83-fileinfo \
   tzdata \
   && rm -rf /var/cache/apk/*

ENV TZ=Asia/Jakarta

WORKDIR /var/www/html

RUN ln -s /usr/bin/php83 /usr/bin/php

COPY ./nginx.conf /etc/nginx/http.d/default.conf

# Port yang akan digunakan oleh Nginx
EXPOSE 80

# Command untuk menjalankan Nginx pada background
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "-c", "nginx && php-fpm83 -F"]