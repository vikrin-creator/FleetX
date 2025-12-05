<?php

require_once __DIR__ . '/../../models/Vehicle.php';

$database = new Database();
$db = $database->getConnection();
$vehicle = new Vehicle($db);

// Get request data
$data = json_decode(file_get_contents("php://input"));

switch ($request_method) {
    case 'GET':
        if ($id) {
            // Get single vehicle
            $result = $vehicle->getById($id);
            if ($result) {
                echo json_encode([
                    'success' => true,
                    'data' => $result
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Vehicle not found'
                ]);
            }
        } else {
            // Get all vehicles
            $result = $vehicle->getAll();
            echo json_encode([
                'success' => true,
                'data' => $result
            ]);
        }
        break;

    case 'POST':
        // Create new vehicle
        if ($vehicle->create($data)) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Vehicle created successfully',
                'id' => $db->lastInsertId()
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to create vehicle'
            ]);
        }
        break;

    case 'PUT':
        // Update vehicle
        if ($id && $vehicle->update($id, $data)) {
            echo json_encode([
                'success' => true,
                'message' => 'Vehicle updated successfully'
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update vehicle'
            ]);
        }
        break;

    case 'DELETE':
        // Delete vehicle
        if ($id && $vehicle->delete($id)) {
            echo json_encode([
                'success' => true,
                'message' => 'Vehicle deleted successfully'
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete vehicle'
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
        break;
}
