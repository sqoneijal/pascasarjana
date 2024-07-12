#!/bin/bash

# Generate SHA1 hash of the file content using openssl
hash_js=$(openssl sha1 < ./public/bundle/App.js | awk '{print $2}')
hash_css=$(openssl sha1 < ./public/bundle/App.css | awk '{print $2}')

# Copy the file
cp ./public/bundle/App.js ./public/bundle/app.$hash_js.js
cp ./public/bundle/App.css ./public/bundle/app.$hash_css.css

cp app/Common.php.sample app/Common.php
echo "define('HASH_JS', '$hash_js');" >> app/Common.php
echo "define('HASH_CSS', '$hash_css');" >> app/Common.php

rm ./public/bundle/App.js
rm ./public/bundle/App.css

file_path="app/Controllers/BaseController.php"
temp_file=$(mktemp)

# Change the value of $publish to true using sed
sed 's/protected \$publish = false;/protected \$publish = true;/' "$file_path" > "$temp_file"

# Replace original file with modified content
mv "$temp_file" "$file_path"