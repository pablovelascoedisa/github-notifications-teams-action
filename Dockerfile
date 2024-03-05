# Usa una imagen de Node.js como base
FROM node:16

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY . .

# Instala las dependencias
RUN npm install axios

# Comando por defecto para ejecutar la acción
CMD ["node", "script.js"]
