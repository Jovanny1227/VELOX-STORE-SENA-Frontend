# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Reemplaza "velox-store-sena-frontend" por el nombre de tu proyecto en package.json si es diferente
COPY --from=build /app/dist/velox-store-sena-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
