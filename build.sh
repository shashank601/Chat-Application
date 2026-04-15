#!/bin/bash

set -e

echo "Installing client..."
npm install --prefix client

echo "Building client..."
npm run build --prefix client

echo "Installing backend..."
npm install --prefix backend

echo "Done"