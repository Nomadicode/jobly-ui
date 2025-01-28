#!/bin/sh

# Get all VITE_APP_ environment variables
ENV_VARS=$(env | grep '^VITE_APP_')

# Create temp file
TMP_FILE=$(mktemp)

# Process config.js with all VITE_APP_ variables
while IFS= read -r line; do
  # Replace each variable placeholder
  for var in $ENV_VARS; do
    var_name=$(echo "$var" | cut -d= -f1)
    var_value=$(echo "$var" | cut -d= -f2-)
    line=$(echo "$line" | sed "s|%%${var_name}%%|${var_value}|g")
  done
  echo "$line"
done < /usr/share/nginx/html/config.js > $TMP_FILE

# Replace original config.js
mv $TMP_FILE /usr/share/nginx/html/config.js

# Start Nginx
exec "$@"
