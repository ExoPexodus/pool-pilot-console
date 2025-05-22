
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Add custom styling for nginx error pages
RUN echo '<html><head><style>body{background-color:#0f1523;color:white;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;}h1{color:#14b8a6;}p{color:#9ca3af;}</style></head><body><h1>AutoScaler</h1><p>Service temporarily unavailable</p></body></html>' > /usr/share/nginx/html/custom_50x.html

# Update default error pages
RUN echo 'error_page 500 502 503 504 /custom_50x.html;' >> /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
