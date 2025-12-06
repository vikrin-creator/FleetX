<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Connected to database successfully!\n";
    
    // Read and execute the SQL file
    $sql = file_get_contents('database/migrations/create_categories_tables.sql');
    
    // Split SQL by semicolons and execute each statement
    $statements = explode(';', $sql);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            $db->exec($statement);
            echo "Executed: " . substr($statement, 0, 50) . "...\n";
        }
    }
    
    echo "\nDatabase setup completed successfully!\n";
    echo "Tables created:\n";
    echo "- categories\n";
    echo "- category_items\n";
    echo "- Sample categories inserted\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>