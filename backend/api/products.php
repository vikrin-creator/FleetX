<?php
require_once '../config/database.php';
require_once '../utils/Response.php';

class ProductController {
    private $db;
    private $uploadDir;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->uploadDir = '../uploads/products/';
        
        // Create upload directory if it doesn't exist
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    public function getProducts($categoryId = null) {
        try {
            if ($categoryId) {
                // Get products for specific category
                $stmt = $this->db->prepare("
                    SELECT ci.*, c.name as category_name 
                    FROM category_items ci 
                    LEFT JOIN categories c ON ci.category_id = c.id 
                    WHERE ci.category_id = ? 
                    ORDER BY ci.name ASC
                ");
                $stmt->execute([$categoryId]);
            } else {
                // Get all products with category info
                $stmt = $this->db->prepare("
                    SELECT ci.*, c.name as category_name 
                    FROM category_items ci 
                    LEFT JOIN categories c ON ci.category_id = c.id 
                    ORDER BY c.name, ci.name ASC
                ");
                $stmt->execute();
            }
            
            $products = $stmt->fetchAll();

            Response::success($products, 'Products retrieved successfully');
        } catch (Exception $e) {
            Response::error('Failed to fetch products', 500);
        }
    }

    public function getProduct($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT ci.*, c.name as category_name 
                FROM category_items ci 
                LEFT JOIN categories c ON ci.category_id = c.id 
                WHERE ci.id = ?
            ");
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if ($product) {
                Response::success($product, 'Product retrieved successfully');
            } else {
                Response::error('Product not found', 404);
            }
        } catch (Exception $e) {
            Response::error('Failed to fetch product', 500);
        }
    }

    private function handleFileUpload($fileKey) {
        if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $file = $_FILES[$fileKey];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.');
        }

        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $maxSize) {
            throw new Exception('File size too large. Maximum 5MB allowed.');
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('product_') . '.' . $extension;
        $filepath = $this->uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Failed to upload file.');
        }

        return 'uploads/products/' . $filename;
    }

    public function createProduct() {
        try {
            $category_id = $_POST['category_id'] ?? null;
            $name = $_POST['name'] ?? null;
            $description = $_POST['description'] ?? '';
            $part_number = $_POST['part_number'] ?? '';
            $price = $_POST['price'] ?? 0;
            $stock_quantity = $_POST['stock_quantity'] ?? 0;
            $image_url = $_POST['image_url'] ?? null;

            if (!$category_id || !$name) {
                Response::error('Category ID and product name are required', 400);
                return;
            }

            // Handle file upload if image is provided
            if (isset($_FILES['image'])) {
                $image_url = $this->handleFileUpload('image');
            }

            $stmt = $this->db->prepare("
                INSERT INTO category_items (category_id, name, description, part_number, price, stock_quantity, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$category_id, $name, $description, $part_number, $price, $stock_quantity, $image_url]);

            $productId = $this->db->lastInsertId();
            Response::success(['id' => $productId], 'Product created successfully');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function updateProduct($id) {
        try {
            $category_id = $_POST['category_id'] ?? null;
            $name = $_POST['name'] ?? null;
            $description = $_POST['description'] ?? '';
            $part_number = $_POST['part_number'] ?? '';
            $price = $_POST['price'] ?? 0;
            $stock_quantity = $_POST['stock_quantity'] ?? 0;
            $status = $_POST['status'] ?? 'active';
            $image_url = $_POST['image_url'] ?? null;

            if (!$category_id || !$name) {
                Response::error('Category ID and product name are required', 400);
                return;
            }

            // Get current product info
            $stmt = $this->db->prepare("SELECT image_url FROM category_items WHERE id = ?");
            $stmt->execute([$id]);
            $currentProduct = $stmt->fetch();

            if (!$currentProduct) {
                Response::error('Product not found', 404);
                return;
            }

            // Handle file upload if new image is provided
            if (isset($_FILES['image'])) {
                // Delete old image if it exists and is a local file
                if ($currentProduct['image_url'] && strpos($currentProduct['image_url'], 'uploads/') === 0) {
                    $oldImagePath = '../' . $currentProduct['image_url'];
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                $image_url = $this->handleFileUpload('image');
            } else if (!$image_url) {
                // Keep existing image if no new image is uploaded and no URL provided
                $image_url = $currentProduct['image_url'];
            }

            $stmt = $this->db->prepare("
                UPDATE category_items 
                SET category_id = ?, name = ?, description = ?, part_number = ?, 
                    price = ?, stock_quantity = ?, status = ?, image_url = ? 
                WHERE id = ?
            ");
            $stmt->execute([$category_id, $name, $description, $part_number, $price, $stock_quantity, $status, $image_url, $id]);

            Response::success(null, 'Product updated successfully');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function deleteProduct($id) {
        try {
            // Get product info before deletion to delete associated image
            $stmt = $this->db->prepare("SELECT image_url FROM category_items WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if ($product && $product['image_url'] && strpos($product['image_url'], 'uploads/') === 0) {
                $imagePath = '../' . $product['image_url'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $stmt = $this->db->prepare("DELETE FROM category_items WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                Response::success(null, 'Product deleted successfully');
            } else {
                Response::error('Product not found', 404);
            }
        } catch (Exception $e) {
            Response::error('Failed to delete product', 500);
        }
    }
}

// Handle routing
$controller = new ProductController();
$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));

switch ($method) {
    case 'GET':
        if (empty($path[0])) {
            // Get all products
            $controller->getProducts();
        } elseif (isset($_GET['category_id'])) {
            // Get products by category
            $controller->getProducts($_GET['category_id']);
        } elseif (is_numeric($path[0])) {
            // Get single product
            $controller->getProduct($path[0]);
        } else {
            Response::error('Invalid request', 400);
        }
        break;
    case 'POST':
        $controller->createProduct();
        break;
    case 'PUT':
        if (isset($path[0]) && is_numeric($path[0])) {
            $controller->updateProduct($path[0]);
        } else {
            Response::error('Product ID is required for update', 400);
        }
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id']) && is_numeric($data['id'])) {
            $controller->deleteProduct($data['id']);
        } else {
            Response::error('Invalid delete request. Product ID is required.', 400);
        }
        break;
    default:
        Response::error('Method not allowed', 405);
}
?>