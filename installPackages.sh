#!/bin/bash

echo "Installing root npm packages..."
npm install

echo "Changing directory to ilp and installing npm packages..."
cd ilp
npm install

echo "All packages installed successfully."
