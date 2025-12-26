#!/bin/sh
# validate-imports.sh
# This script checks for common import path issues

echo "Checking for problematic import paths..."

# Check for imports starting with 'app/' instead of '@/'
DIRECT_APP_IMPORTS=$(grep -r "from 'app/" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" ./app)
if [ -n "$DIRECT_APP_IMPORTS" ]; then
  echo "❌ Found imports starting with 'app/' which should be changed to '@/components/':"
  echo "$DIRECT_APP_IMPORTS"
  echo ""
fi

# Check for @/app/components instead of @/components
APP_COMPONENTS_IMPORTS=$(grep -r "from '@/app/components" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" ./app)
if [ -n "$APP_COMPONENTS_IMPORTS" ]; then
  echo "❌ Found imports starting with '@/app/components' which should be changed to '@/components/':"
  echo "$APP_COMPONENTS_IMPORTS"
  echo ""
fi

# Check for any other problematic paths here...

if [ -z "$DIRECT_APP_IMPORTS" ] && [ -z "$APP_COMPONENTS_IMPORTS" ]; then
  echo "✅ No problematic import paths found."
  exit 0
else
  echo "Please fix the import paths above before building."
  exit 1
fi