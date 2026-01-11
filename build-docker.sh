#!/bin/bash

# Build script for AtLiTeG Docker containers
# This script prepares the required artifacts before building Docker images

set -e  # Exit on error

echo "🔨 Building AtLiTeG Docker containers..."
echo ""

# Step 1: Build frontend
echo "📦 Step 1/3: Installing frontend dependencies..."
cd lemmario-dashboard
npm install

echo "🏗️  Step 2/3: Building frontend application..."
NEXT_PUBLIC_API_URL=http://backend:3001 NEXT_PUBLIC_API_KEY=default_dev_key npm run build

# Step 2: Build backend dependencies
echo "📦 Step 3/3: Installing backend dependencies..."
cd server
npm install
cd ../..

# Step 3: Build Docker images
echo "🐳 Building Docker images..."
docker compose build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "To start the containers, run:"
echo "  docker compose up -d"
echo ""
echo "To verify the containers are running:"
echo "  docker compose ps"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
