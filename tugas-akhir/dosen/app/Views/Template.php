<!DOCTYPE html>
<html lang="en" data-bs-theme="light">

<head>
   <title><?php echo $title; ?></title>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <link rel="shortcut icon" href="/assets/favicon-uin.png" />
   <?php
   echo link_tag('https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700');
   echo $linkTag;
   ?>
</head>

<body id="kt_app_body" data-kt-app-layout="light-sidebar" data-kt-app-header-fixed="true" data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-hoverable="true" data-kt-app-sidebar-push-header="true" data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" data-kt-app-toolbar-enabled="true" class="app-default">
   <div class="d-flex flex-column flex-root app-root" id="kt_app_root"></div>
   <?php echo $scriptTag; ?>
</body>

</html>