<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        // Ensure MySQL testing database exists for test runs.
        // This avoids failures like "Unknown database 'testing'" when using RefreshDatabase.
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '3306');
        $user = env('DB_USERNAME', 'root');
        $pass = env('DB_PASSWORD', '');
        $dbname = env('DB_DATABASE', 'testing');

        try {
            $pdo = new \PDO("mysql:host={$host};port={$port};charset=utf8mb4", (string) $user, (string) $pass, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ]);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        } catch (\Throwable $e) {
            // Swallow errors to not block tests if the DB already exists or driver is unavailable.
        }
    }
}
