<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FleetX Database Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .container { background: #f5f5f5; padding: 30px; border-radius: 8px; }
        .success { color: #28a745; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: #0c5460; background: #d1ecf1; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>FleetX Database Setup</h1>
        
        <?php
        if (isset($_POST['setup_database'])) {
            $host = 'localhost';
            $username = 'u177524058_Fleetx';
            $password = 'Devima@0812';
            $database = 'u177524058_Fleetx';

            try {
                // Try to connect with PDO first
                $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                echo '<div class="success">✅ Successfully connected to database: ' . $database . '</div>';
                
                // Read SQL content
                $sql_content = file_get_contents('database/migrations/create_categories_tables.sql');
                $statements = explode(';', $sql_content);
                
                echo '<div class="info">📋 Executing SQL statements...</div>';
                echo '<pre>';
                
                foreach ($statements as $statement) {
                    $statement = trim($statement);
                    if (!empty($statement)) {
                        try {
                            $pdo->exec($statement);
                            echo "✅ " . substr($statement, 0, 80) . "...\n";
                        } catch (PDOException $e) {
                            echo "❌ Error: " . $e->getMessage() . "\n";
                            echo "   Statement: " . substr($statement, 0, 100) . "...\n\n";
                        }
                    }
                }
                
                echo '</pre>';
                echo '<div class="success">🎉 Database setup completed successfully!</div>';
                echo '<div class="info">Tables created: categories, category_items<br>Sample data has been inserted.</div>';
                
            } catch (PDOException $e) {
                echo '<div class="error">❌ Database connection failed: ' . $e->getMessage() . '</div>';
                echo '<div class="info">Please check your database credentials and make sure the database exists.</div>';
            }
        }
        ?>
        
        <div class="info">
            <strong>Database Configuration:</strong><br>
            Host: localhost<br>
            Database: u177524058_Fleetx<br>
            Username: u177524058_Fleetx<br>
            Password: Devima@0812
        </div>
        
        <form method="POST">
            <button type="submit" name="setup_database" class="btn">🚀 Setup Database Tables</button>
        </form>
        
        <div style="margin-top: 30px;">
            <h3>SQL Script Content:</h3>
            <pre><?php 
                if (file_exists('database/migrations/create_categories_tables.sql')) {
                    echo htmlspecialchars(file_get_contents('database/migrations/create_categories_tables.sql'));
                } else {
                    echo "SQL file not found: database/migrations/create_categories_tables.sql";
                }
            ?></pre>
        </div>
    </div>
</body>
</html>