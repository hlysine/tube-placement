FROM node:18

# Set up a new user named "user" with user ID 1000
RUN useradd -o -u 1000 user

# Install pip
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3.11 \
    python3-pip \
    unzip

# Install kaggle silently
RUN yes | pip3 install kaggle --exists-action i --break-system-packages

# Install pm2
RUN npm install pm2 -g

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Copy the current directory contents into the container at $HOME/app setting the owner to the user
COPY --chown=user . $HOME/app

# Install npm dependencies
RUN npm install

# Build client and server
ARG VITE_SERVER_URL='/'
RUN echo "VITE_SERVER_URL=$VITE_SERVER_URL" | cat > .env
RUN cat .env
RUN npm run build

# Download tube placement dataset from Kaggle
RUN --mount=type=secret,id=KAGGLE_USERNAME,mode=0444,required=true \
    --mount=type=secret,id=KAGGLE_KEY,mode=0444,required=true \
    export KAGGLE_USERNAME=$(cat /run/secrets/KAGGLE_USERNAME) && \
    export KAGGLE_KEY=$(cat /run/secrets/KAGGLE_KEY) && \
    kaggle competitions download -c ranzcr-clip-catheter-line-classification --unzip -p $HOME/app/dist/app/tube-placement

RUN cd $HOME/app/dist/app/tube-placement && \
    unzip ranzcr-clip-catheter-line-classification.zip \
    cd $HOME/app

EXPOSE 7860
# CMD [ "npm", "run", "start" ]
CMD ["pm2-runtime", "processes.json"]