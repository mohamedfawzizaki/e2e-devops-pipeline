#!/bin/bash
# This script generates a Docker config file for authentication with Docker Hub.
# It uses base64 encoding for the username and password.
# Usage: ./gen-docker-config-file.sh
set -e
# Ensure the script is run with the necessary permissions
if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root or with sudo." >&2
  exit 1
fi
# Check if base64 is installed
if ! command -v base64 &> /dev/null; then
    echo "base64 command not found. Please install it." >&2
    exit 1
fi

# Generate the Docker config file
# The file will be named config.json.
DOCKER_USER="your-username"
DOCKER_PASS="your-password-or-token"
AUTH=$(echo -n "${DOCKER_USER}:${DOCKER_PASS}" | base64)

cat <<EOF > config.json
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "${AUTH}"
    }
  }
}
EOF
