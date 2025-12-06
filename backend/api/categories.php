<?php
require_once '../config/database.php';
require_once '../utils/Response.php';

class CategoryController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->createTablesIfNotExist();
    }

    private function createTablesIfNotExist() {
        try {
            // Check if categories table exists
            $stmt = $this->db->prepare("SHOW TABLES LIKE 'categories'");
            $stmt->execute();
            
            if ($stmt->rowCount() == 0) {
                // Create categories table
                $sql = "CREATE TABLE categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    image_url TEXT,
                    status ENUM('active', 'inactive') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )";
                $this->db->exec($sql);
                
                // Create category_items table
                $sql = "CREATE TABLE category_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    category_id INT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    part_number VARCHAR(100),
                    price DECIMAL(10, 2),
                    stock_quantity INT DEFAULT 0,
                    image_url TEXT,
                    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
                )";
                $this->db->exec($sql);
                
                // Insert sample categories
                $sampleCategories = [
                    ['Brakes & Wheel End', 'Rotors, pads, calipers, and more.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlQl6ysDSDr_q6PiNOLamiX8tNHHJ3X6kHTgpnxj7E5ebbTqX1N20aAPky7AgvEEBMH37opKm9zbTR_tXA6OQOuskNSXoERv0fGd9pXNanaJdgfIYXvD9O5XFeIyuk1V6Xpi4WrsLTlQ3z9O3gqy3kG-qhf6dMboyi9_a_95kkMmi4ZTmPgOlQUjXU9tceIik0erYTR1uXoQNNRwOmSSyCq45qdcwdiQrOuRmkPynUGr2GuRW7DrerlhOiXJk1MUjQHbG9fJJud7vM'],
                    ['Engine Components', 'Filters, pistons, gaskets, and complete engine kits.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuANcZwb3nPvrrSWVYXFVweDw0w9-1NirWNDfUOybVoRjRNmU_nzrIASEuSTowP1_3IVmYYPHMH0S5lfDYivIWW1dhctVApB3ViW64mEvUXkBYG2ctMEm6lHFSv6lLZPJe5V1P7vourSZenx6-1A_-yWNz0kqaT1RH4_X9VicqxDHMuWzaj9SjQDJ4tZ1NL2KxX8g9dZs5p96wTcbbr80t5L-NmZrZWoPeld64Qcj9Ij8T_XD32my4qZHtKWhbPue14AyqUtObMzDG0A'],
                    ['Lighting & Electrical', 'Headlights, wiring, batteries, and sensors.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxCh7ltcBT05Qw7_CnSks3SBLwmp3cObMUQJtP0d0qni6jwmkHRNkP-DHe_Ng_z61kWz9UPz5gAhYvNUPtVt7dDdV9PU_0NUExopQCeRowLKpMwyf5ry8AbOExaCQprPUv-N8PHJonGchPQOxxgpJkO5HwisaqWCPQujmlbPwSOduLLyzcQhp8QnTGA1XKBOnhxmzpYe9zvL0-7LmWS09hN7mY07UistMDIyaBSxfYMCq31fd1mDFRsWeIIohBA3pDKU-Wze4Isk2X'],
                    ['Suspension', 'Shocks, struts, and air springs for a smooth ride.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSYtUDmh6GFKabPuwAwh9Z42iE6N4R6xkaX80XfgHqtDijmMg733jf_LnFcO-ekkAL6u0oFJIdvZAN1bxADJdxuJ2B7fKcHDKHi-B5iTv8OBwsUjT__b6gx92xCHXoKB8xZu-ihH3wGDoZX50cVWTVSEnk_Zc2Wl_RxvPJBLlBvvpuHe9mq8L4OlanSyd8BRoj1EpaXs5pX5vK53cZ2ZHaTXUwYirJzgCD_rFfhVSB1EyKAs4DBaH7DM3HAX5bczmP05Kv_0wXyCyg']
                ];
                
                $stmt = $this->db->prepare("INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)");
                foreach ($sampleCategories as $category) {
                    $stmt->execute($category);
                }
            }
        } catch (Exception $e) {
            error_log("Table creation error: " . $e->getMessage());
        }
    }

    public function getCategories() {
        try {
            $stmt = $this->db->prepare("SELECT * FROM categories ORDER BY name ASC");
            $stmt->execute();
            $categories = $stmt->fetchAll();

            // Get item count for each category
            foreach ($categories as &$category) {
                $countStmt = $this->db->prepare("SELECT COUNT(*) as count FROM category_items WHERE category_id = ?");
                $countStmt->execute([$category['id']]);
                $category['item_count'] = $countStmt->fetch()['count'];
            }

            Response::json($categories);
        } catch (Exception $e) {
            Response::error('Failed to fetch categories', 500);
        }
    }

    public function getCategoryItems($categoryId) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM category_items WHERE category_id = ? ORDER BY name ASC");
            $stmt->execute([$categoryId]);
            $items = $stmt->fetchAll();

            Response::json($items);
        } catch (Exception $e) {
            Response::error('Failed to fetch category items', 500);
        }
    }

    public function createCategory() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['name'])) {
                Response::error('Category name is required', 400);
                return;
            }

            $stmt = $this->db->prepare("INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['description'] ?? '',
                $data['image_url'] ?? ''
            ]);

            $categoryId = $this->db->lastInsertId();
            Response::json(['id' => $categoryId, 'message' => 'Category created successfully'], 201);
        } catch (Exception $e) {
            Response::error('Failed to create category', 500);
        }
    }

    public function updateCategory($id) {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            $stmt = $this->db->prepare("UPDATE categories SET name = ?, description = ?, image_url = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['description'] ?? '',
                $data['image_url'] ?? '',
                $id
            ]);

            Response::json(['message' => 'Category updated successfully']);
        } catch (Exception $e) {
            Response::error('Failed to update category', 500);
        }
    }

    public function deleteCategory($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$id]);

            Response::json(['message' => 'Category deleted successfully']);
        } catch (Exception $e) {
            Response::error('Failed to delete category', 500);
        }
    }

    public function createCategoryItem() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['category_id']) || !isset($data['name'])) {
                Response::error('Category ID and item name are required', 400);
                return;
            }

            $stmt = $this->db->prepare("INSERT INTO category_items (category_id, name, description, part_number, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['category_id'],
                $data['name'],
                $data['description'] ?? '',
                $data['part_number'] ?? '',
                $data['price'] ?? 0,
                $data['stock_quantity'] ?? 0,
                $data['image_url'] ?? ''
            ]);

            $itemId = $this->db->lastInsertId();
            Response::json(['id' => $itemId, 'message' => 'Item created successfully'], 201);
        } catch (Exception $e) {
            Response::error('Failed to create item', 500);
        }
    }

    public function updateCategoryItem($id) {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            $stmt = $this->db->prepare("UPDATE category_items SET name = ?, description = ?, part_number = ?, price = ?, stock_quantity = ?, image_url = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['description'] ?? '',
                $data['part_number'] ?? '',
                $data['price'] ?? 0,
                $data['stock_quantity'] ?? 0,
                $data['image_url'] ?? '',
                $id
            ]);

            Response::json(['message' => 'Item updated successfully']);
        } catch (Exception $e) {
            Response::error('Failed to update item', 500);
        }
    }

    public function deleteCategoryItem($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM category_items WHERE id = ?");
            $stmt->execute([$id]);

            Response::json(['message' => 'Item deleted successfully']);
        } catch (Exception $e) {
            Response::error('Failed to delete item', 500);
        }
    }
}

// Handle routing
$controller = new CategoryController();
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));

switch ($method) {
    case 'GET':
        if (empty($path[0])) {
            $controller->getCategories();
        } elseif ($path[0] === 'items' && isset($path[1])) {
            $controller->getCategoryItems($path[1]);
        }
        break;
    case 'POST':
        if (empty($path[0])) {
            $controller->createCategory();
        } elseif ($path[0] === 'items') {
            $controller->createCategoryItem();
        }
        break;
    case 'PUT':
        if (isset($path[0]) && is_numeric($path[0])) {
            $controller->updateCategory($path[0]);
        } elseif ($path[0] === 'items' && isset($path[1])) {
            $controller->updateCategoryItem($path[1]);
        }
        break;
    case 'DELETE':
        if (isset($path[0]) && is_numeric($path[0])) {
            $controller->deleteCategory($path[0]);
        } elseif ($path[0] === 'items' && isset($path[1])) {
            $controller->deleteCategoryItem($path[1]);
        }
        break;
}
?>