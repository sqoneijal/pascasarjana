<!DOCTYPE html>
<html lang="en" data-bs-theme="light">

<head>
   <title><?php echo $title; ?></title>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <link rel="shortcut icon" href="/assets/favicon-uin.png">
   <?php
   echo link_tag('https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700');
   echo $linkTag;
   ?>
</head>

<body id="kt_body" class="app-blank">
   <div class="d-flex flex-column flex-root" id="kt_app_root"></div>
   <?php echo $scriptTag; ?>
   <script type="text/javascript">
      var baseURL = "<?php echo config('App\Config\App')->baseURL; ?>",
         adminBaseURL = "<?php echo config('App\Config\App')->adminBaseURL; ?>",
         dosenBaseURL = "<?php echo config('App\Config\App')->dosenBaseURL; ?>",
         mahasiswaBaseURL = "<?php echo config('App\Config\App')->mahasiswaBaseURL; ?>",
         akademikBaseURL = "<?php echo config('App\Config\App')->akademikBaseURL; ?>";
   </script>
</body>

</html>