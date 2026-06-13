#!/bin/bash

# AMTMTI Platform Setup Script
# This script helps set up the AMTMTI platform for development or production

set -e

echo "🚀 AMTMTI Platform Setup"
echo "======================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Node version: $node_version"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
  pnpm install
elif command -v yarn &> /dev/null; then
  yarn install
else
  npm install
fi
echo "✓ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo "📝 Creating .env.local..."
  cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Admin Configuration
ADMIN_EMAIL=admin@amtmti.org
ADMIN_PASSWORD=your-secure-password
ADMIN_PASSWORD_HASH=

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
  echo "✓ .env.local created - Please fill in your Supabase credentials"
  echo ""
  echo "To get your Supabase credentials:"
  echo "1. Go to https://supabase.com and create a project"
  echo "2. Copy your project URL to NEXT_PUBLIC_SUPABASE_URL"
  echo "3. Get your service role key from Settings > API > Service Role Key"
  echo "4. Get your JWT secret from Settings > API > JWT Secret"
  echo ""
else
  echo "✓ .env.local already exists"
fi

# Generate admin password hash
echo "🔐 Generating admin password hash..."
echo "To generate a bcrypt hash for your admin password, run:"
echo "  node -e \"const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))\""
echo ""

# Check Supabase connection
echo "🔗 Checking Supabase connection..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "⚠️  Supabase credentials not set in environment"
  echo "   Please fill in .env.local and restart"
else
  echo "✓ Supabase credentials found"
fi
echo ""

# Build project
echo "🏗️  Building project..."
pnpm build
echo "✓ Build completed"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Fill in your Supabase credentials in .env.local"
echo "2. Generate an admin password hash with the command above"
echo "3. Update ADMIN_PASSWORD_HASH in .env.local"
echo "4. Run 'pnpm dev' to start the development server"
echo ""
