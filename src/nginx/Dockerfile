FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Also remove any existing config to avoid conflicts
RUN rm -f /etc/nginx/nginx.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 