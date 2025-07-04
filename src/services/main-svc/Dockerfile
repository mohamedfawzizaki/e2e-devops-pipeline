# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies files
COPY package*.json ./

RUN apt-get update && apt-get install -y iputils-ping


# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port (Express default)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]



# docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=my_db -e MYSQL_PASSWORD=root --network my-net -d mysql
# docker container run --name my-app -e MYSQL_HOST=some-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=my_db -e MYSQL_PASSWORD=root -p 3000:3000 --network my-net test-image