#!/bin/bash
#Script for deploying the application, pulls from git, checks if docker is installed, runs docker compose

git pull

if [ -x "$(command -v docker)" ]; then
    echo "Update docker"
    # command
else
    echo "Install docker"
    # command
fi

docker-compose -f /var/www/html/BrainBeats/BrainBeats_0.1/docker-compose.yml build

