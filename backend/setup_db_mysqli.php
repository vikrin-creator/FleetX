<?php

// Database connection using mysqli
$host = 'localhost';
$username = 'u177524058_Fleetx';
$password = 'Devima@0812';
$database = 'u177524058_Fleetx';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected to database successfully!\n\n";

// Read SQL file
$sql_content = file_get_contents('database/migrations/create_categories_tables.sql');

// Split by semicolon and execute each statement
$statements = explode(';', $sql_content);

foreach ($statements as $statement) {
    $statement = trim($statement);
    if (!empty($statement)) {
        if ($conn->query($statement)) {
            echo "✓ Executed: " . substr($statement, 0, 50) . "...\n";
        } else {
            echo "✗ Error: " . $conn->error . "\n";
            echo "Statement: " . substr($statement, 0, 100) . "...\n\n";
        }
    }
}

echo "\n✅ Database setup completed!\n";
echo "Tables created:\n";
echo "- categories\n";
echo "- category_items\n";
echo "- Sample data inserted\n";

$conn->close();
?>