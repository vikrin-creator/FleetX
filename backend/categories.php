<?php
// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Database configuration
class Database {
    private $host = 'localhost';
    private $db_name = 'u177524058_Fleetx';
    private $username = 'u177524058_Fleetx';
    private $password = 'Devima@0812';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
        }
        return $this->conn;
    }
}

// Response helper
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit();
    }

    public static function success($data = null, $message = 'Success') {
        return self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function error($message = 'Error', $status = 400) {
        return self::json([
            'success' => false,
            'message' => $message
        ], $status);
    }
}

// Categories controller
class CategoryController {
    private $db;

    public function __construct() {
        $database = Database::getInstance();
        $this->db = $database->getConnection();
        
        if (!$this->db) {
            Response::error('Database connection failed', 500);
        }
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                $this->getCategories();
                break;
            case 'POST':
                $this->createCategory();
                break;
            case 'PUT':
                $this->updateCategory();
                break;
            case 'DELETE':
                $this->deleteCategory();
                break;
            default:
                Response::error('Method not allowed', 405);
        }
    }

    private function getCategories() {
        try {
            $stmt = $this->db->prepare("SELECT * FROM categories WHERE status = 'active' ORDER BY created_at DESC");
            $stmt->execute();
            $categories = $stmt->fetchAll();
            
            Response::success($categories, 'Categories retrieved successfully');
        } catch (PDOException $e) {
            error_log("Get categories error: " . $e->getMessage());
            Response::error('Failed to retrieve categories', 500);
        }
    }

    private function createCategory() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['name']) || empty(trim($input['name']))) {
                Response::error('Category name is required', 400);
            }

            $stmt = $this->db->prepare("INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)");
            $stmt->execute([
                trim($input['name']),
                $input['description'] ?? '',
                $input['image_url'] ?? ''
            ]);

            $categoryId = $this->db->lastInsertId();
            Response::success(['id' => $categoryId], 'Category created successfully');
        } catch (PDOException $e) {
            error_log("Create category error: " . $e->getMessage());
            Response::error('Failed to create category', 500);
        }
    }

    private function updateCategory() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id']) || !isset($input['name']) || empty(trim($input['name']))) {
                Response::error('Category ID and name are required', 400);
            }

            $stmt = $this->db->prepare("UPDATE categories SET name = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([
                trim($input['name']),
                $input['description'] ?? '',
                $input['image_url'] ?? '',
                $input['id']
            ]);

            if ($stmt->rowCount() === 0) {
                Response::error('Category not found', 404);
            }

            Response::success(null, 'Category updated successfully');
        } catch (PDOException $e) {
            error_log("Update category error: " . $e->getMessage());
            Response::error('Failed to update category', 500);
        }
    }

    private function deleteCategory() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                Response::error('Category ID is required', 400);
            }

            $stmt = $this->db->prepare("UPDATE categories SET status = 'inactive' WHERE id = ?");
            $stmt->execute([$input['id']]);

            if ($stmt->rowCount() === 0) {
                Response::error('Category not found', 404);
            }

            Response::success(null, 'Category deleted successfully');
        } catch (PDOException $e) {
            error_log("Delete category error: " . $e->getMessage());
            Response::error('Failed to delete category', 500);
        }
    }
}

// Initialize and handle request
try {
    $controller = new CategoryController();
    $controller->handleRequest();
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    Response::error('Internal server error', 500);
}
?>