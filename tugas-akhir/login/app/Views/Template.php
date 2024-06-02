<!DOCTYPE html>
<html lang="en" data-bs-theme="light">

<head>
   <title><?php echo $title; ?></title>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <link rel="shortcut icon" href="<?php echo CDN_PATH . 'media/favicon-uin.png'; ?>">
   <?php
   echo link_tag('https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700');
   echo $linkTag;
   ?>
</head>

<body id="kt_body" class="app-blank">
   <div class="d-flex flex-column flex-root" id="kt_app_root"></div>
   <?php echo $scriptTag; ?>
</body>

</html>