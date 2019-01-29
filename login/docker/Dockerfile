FROM node:10.9.0 as builder

WORKDIR /auth

ARG SCOPE
ARG CORTEX_URL

ADD ./ /auth

RUN ["chmod", "+x", "/auth/docker/script.sh"]
RUN /auth/docker/script.sh

RUN npm install
RUN npm run build

FROM nginx:1.15.1

COPY --from=builder /auth/webpack/dist/ /usr/share/nginx/www

RUN rm /etc/nginx/nginx.conf

COPY --from=builder /auth/docker/nginx.conf /etc/nginx

EXPOSE 80
