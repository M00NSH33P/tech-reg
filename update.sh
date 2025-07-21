#!/bin/bash

# Navigate to the project directory (optional, but good practice)
# cd /home/pi/your-vite-project || exit

echo "▶️  Stopping the web application service..."
sudo systemctl stop webapp.service

echo "▶️  Pulling latest changes from Git..."
git pull

echo "▶️  Installing/updating dependencies..."
npm install

echo "▶️  Building the production project..."
npm run build

echo "▶️  Restarting the web application service..."
sudo systemctl restart webapp.service

echo "✅ Update complete! The service is back online."
echo "   Run 'sudo systemctl status webapp.service' to check its status."