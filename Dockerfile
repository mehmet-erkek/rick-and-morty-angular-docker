# Aşama 1: Angular Uygulamasını Derleme
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Aşama 2: Angular Uygulamasını HTTPD ile Sunma
FROM httpd:alpine3.15

COPY --from=build /app/dist/rick-and-morty-angular/browser /usr/local/apache2/htdocs/

EXPOSE 80
