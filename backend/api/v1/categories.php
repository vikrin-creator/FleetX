<?php
require_once '../config/database.php';
require_once '../utils/Response.php';

class CategoryController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
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