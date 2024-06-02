#!/bin/bash

BaseController_path="app/Controllers/BaseController.php"
BaseController_file=$(mktemp)
sed 's/protected \$publish = true;/protected \$publish = false;/' "$BaseController_path" > "$BaseController_file"
mv "$BaseController_file" "$BaseController_path"

echo "define('HASH_JS', '');" >> app/Common.php.sample
echo "define('HASH_CSS', '');" >> app/Common.php.sample

cp app/Common.php.sample app/Common.php