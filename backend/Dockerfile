# Gunakan Node versi yang sama seperti di development
FROM node:18

# Set working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json dulu
COPY package*.json ./

# Install dependensi langsung di container
RUN npm install --production

# Salin seluruh source code setelah npm install
COPY . .

# Expose port backend
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]