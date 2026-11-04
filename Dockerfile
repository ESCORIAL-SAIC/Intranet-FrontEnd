# Imagen de produccion del front: build de React servido por nginx.
# La construye el workflow .github/workflows/deploy.yml en el servidor
# y la levanta el docker-compose.yml de /opt/docker/intranet (servicio "web").

# --- build ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# nginx.conf reenvia /api/ al contenedor de la API, asi que por defecto
# el front le pega al mismo host que lo sirve (sin CORS ni otro puerto).
ARG REACT_APP_BASE_URL=/api
ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}

RUN npm run build

# --- serve ---
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
