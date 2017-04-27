FROM alpine:3.4

# Update & install required packages
RUN apk add --update nodejs bash git
RUN npm install -g yarn

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; yarn install

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# set your port
ENV PORT 3000

# expose the port to outside world
EXPOSE  3000

# start command as per package.json
CMD ["npm", "start"]