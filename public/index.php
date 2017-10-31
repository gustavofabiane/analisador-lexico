<?php

use Slim\App;

require '../vendor/autoload.php';

spl_autoload_register(function ($class) {

    require __DIR__ . '/../src/' . $class . '.php';
});

$app = new App(require '../src/settings.php');

require '../src/dependencies.php';

require '../src/routes.php';

require '../src/middleware.php';

$app->run();
