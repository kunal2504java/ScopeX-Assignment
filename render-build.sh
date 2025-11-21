#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed the database (optional - comment out if you don't want to reseed on every deploy)
npm run db:seed

# Build the Next.js app
npm run build
