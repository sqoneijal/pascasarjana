#!/bin/bash

# Generate SHA1 hash of the file content using openssl
hash_js=$(openssl sha1 < ../../cdn/bundle/tugas-akhir/mahasiswa/App.js | awk '{print $2}')
hash_css=$(openssl sha1 < ../../cdn/bundle/tugas-akhir/mahasiswa/App.css | awk '{print $2}')

# Copy the file
cp ../../cdn/bundle/tugas-akhir/mahasiswa/App.js ../../cdn/bundle/tugas-akhir/mahasiswa/app.$hash_js.js
cp ../../cdn/bundle/tugas-akhir/mahasiswa/App.css ../../cdn/bundle/tugas-akhir/mahasiswa/app.$hash_css.css

cp app/Common.php.sample app/Common.php
echo "define('HASH_JS', '$hash_js');" >> app/Common.php
echo "define('HASH_CSS', '$hash_css');" >> app/Common.php

rm ../../cdn/bundle/tugas-akhir/mahasiswa/App.js
rm ../../cdn/bundle/tugas-akhir/mahasiswa/App.css

file_path="app/Controllers/BaseController.php"
temp_file=$(mktemp)

# Change the value of $publish to true using sed
sed 's/protected \$publish = false;/protected \$publish = true;/' "$file_path" > "$temp_file"

# Replace original file with modified content
mv "$temp_file" "$file_path"