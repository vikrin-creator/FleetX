<?php
require_once '../config/database.php';
require_once '../utils/Response.php';

class SearchController {
    private $db;
    private $baseUrl;

    public function __construct() {
        $database = Database::getInstance();
        $this->db = $database->getConnection();
        
        // Get the base URL for converting relative image paths
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $this->baseUrl = $protocol . '://' . $host . '/backend/';
    }

    private function formatImageUrl($imageUrl) {
        if (empty($imageUrl)) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (strpos($imageUrl, 'http://') === 0 || strpos($imageUrl, 'https://') === 0) {
            return $imageUrl;
        }
        
        // Convert relative path to absolute URL
        return $this->baseUrl . $imageUrl;
    }

    public function search() {
        try {
            // Get search query from request
            $query = $_GET['q'] ?? $_GET['query'] ?? '';
            
            if (empty(trim($query))) {
                Response::error('Search query is required', 400);
                return;
            }

            $searchTerm = '%' . $query . '%';
            $results = [
                'categories' => [],
                'items' => [],
                'sub_items' => []
            ];

            // Search in categories
            $stmt = $this->db->prepare("
                SELECT 
                    id, 
                    name, 
                    description, 
                    image_url,
                    'category' as type
                FROM categories 
                WHERE status = 'active' 
                AND (
                    name LIKE ? 
                    OR description LIKE ?
                )
                ORDER BY name ASC
                LIMIT 50
            ");
            $stmt->execute([$searchTerm, $searchTerm]);
            $categories = $stmt->fetchAll();
            
            // Format image URLs for categories
            foreach ($categories as &$category) {
                $category['image_url'] = $this->formatImageUrl($category['image_url']);
            }
            $results['categories'] = $categories;

            // Search in category_items (items)
            $stmt = $this->db->prepare("
                SELECT 
                    ci.id,
                    ci.category_id,
                    ci.name,
                    ci.description,
                    ci.part_number,
                    ci.price,
                    ci.stock_quantity,
                    ci.image_url,
                    c.name as category_name,
                    c.id as categoryId,
                    'item' as type
                FROM category_items ci
                LEFT JOIN categories c ON ci.category_id = c.id
                WHERE ci.status = 'active'
                AND (
                    ci.name LIKE ?
                    OR ci.description LIKE ?
                    OR ci.part_number LIKE ?
                )
                ORDER BY ci.name ASC
                LIMIT 50
            ");
            $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
            $items = $stmt->fetchAll();
            
            // Add categoryName for consistency with frontend and format image URLs
            foreach ($items as &$item) {
                $item['categoryName'] = $item['category_name'];
                $item['image_url'] = $this->formatImageUrl($item['image_url']);
            }
            $results['items'] = $items;

            // Search in item_sub_items (sub-items)
            $stmt = $this->db->prepare("
                SELECT 
                    isi.id,
                    isi.item_id,
                    isi.name,
                    isi.description,
                    isi.part_number,
                    isi.price,
                    isi.stock_quantity,
                    isi.image_url,
                    isi.brand,
                    isi.manufacturer,
                    isi.dtna_classification,
                    ci.name as item_name,
                    ci.category_id,
                    c.name as category_name,
                    c.id as categoryId,
                    'sub_item' as type
                FROM item_sub_items isi
                LEFT JOIN category_items ci ON isi.item_id = ci.id
                LEFT JOIN categories c ON ci.category_id = c.id
                WHERE isi.status = 'active'
                AND (
                    isi.name LIKE ?
                    OR isi.description LIKE ?
                    OR isi.part_number LIKE ?
                    OR isi.brand LIKE ?
                    OR isi.manufacturer LIKE ?
                    OR isi.dtna_classification LIKE ?
                )
                ORDER BY isi.name ASC
                LIMIT 50
            ");
            $stmt->execute([
                $searchTerm, 
                $searchTerm, 
                $searchTerm, 
                $searchTerm, 
                $searchTerm, 
                $searchTerm
            ]);
            $subItems = $stmt->fetchAll();
            
            // Add categoryName for consistency with frontend and format image URLs
            foreach ($subItems as &$subItem) {
                $subItem['categoryName'] = $subItem['category_name'];
                $subItem['image_url'] = $this->formatImageUrl($subItem['image_url']);
            }
            $results['sub_items'] = $subItems;

            // Calculate total results
            $totalResults = count($results['categories']) + 
                          count($results['items']) + 
                          count($results['sub_items']);

            Response::json([
                'query' => $query,
                'total_results' => $totalResults,
                'results' => $results,
                'success' => true
            ]);

        } catch (Exception $e) {
            error_log("Search error: " . $e->getMessage());
            Response::error('Search failed', 500);
        }
    }
}

// Handle the request
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $controller = new SearchController();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $controller->search();
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("Search API error: " . $e->getMessage());
    Response::error('Internal server error', 500);
}
