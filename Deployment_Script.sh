#!/bin/bash
#Script for deploying the application, pulls from git, checks if docker is installed, runs docker compose

git pull

if [ -x "$(command -v docker)" ]; then
    echo "Docker Installed"
    # command
else
    echo "Install docker"
    # command
fi

docker-compose build

