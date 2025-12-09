CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE category_items (
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
);

CREATE TABLE item_sub_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    part_number VARCHAR(100),
    price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    specifications JSON,
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES category_items(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES 
('Brakes & Wheel End', 'Rotors, pads, calipers, and more.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlQl6ysDSDr_q6PiNOLamiX8tNHHJ3X6kHTgpnxj7E5ebbTqX1N20aAPky7AgvEEBMH37opKm9zbTR_tXA6OQOuskNSXoERv0fGd9pXNanaJdgfIYXvD9O5XFeIyuk1V6Xpi4WrsLTlQ3z9O3gqy3kG-qhf6dMboyi9_a_95kkMmi4ZTmPgOlQUjXU9tceIik0erYTR1uXoQNNRwOmSSyCq45qdcwdiQrOuRmkPynUGr2GuRW7DrerlhOiXJk1MUjQHbG9fJJud7vM'),
('Engine Components', 'Filters, pistons, gaskets, and complete engine kits.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuANcZwb3nPvrrSWVYXFVweDw0w9-1NirWNDfUOybVoRjRNmU_nzrIASEuSTowP1_3IVmYYPHMH0S5lfDYivIWW1dhctVApB3ViW64mEvUXkBYG2ctMEm6lHFSv6lLZPJe5V1P7vourSZenx6-1A_-yWNz0kqaT1RH4_X9VicqxDHMuWzaj9SjQDJ4tZ1NL2KxX8g9dZs5p96wTcbbr80t5L-NmZrZWoPeld64Qcj9Ij8T_XD32my4qZHtKWhbPue14AyqUtObMzDG0A'),
('Lighting & Electrical', 'Headlights, wiring, batteries, and sensors.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxCh7ltcBT05Qw7_CnSks3SBLwmp3cObMUQJtP0d0qni6jwmkHRNkP-DHe_Ng_z61kWz9UPz5gAhYvNUPtVt7dDdV9PU_0NUExopQCeRowLKpMwyf5ry8AbOExaCQprPUv-N8PHJonGchPQOxxgpJkO5HwisaqWCPQujmlbPwSOduLLyzcQhp8QnTGA1XKBOnhxmzpYe9zvL0-7LmWS09hN7mY07UistMDIyaBSxfYMCq31fd1mDFRsWeIIohBA3pDKU-Wze4Isk2X'),
('Suspension', 'Shocks, struts, and air springs for a smooth ride.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSYtUDmh6GFKabPuwAwh9Z42iE6N4R6xkaX80XfgHqtDijmMg733jf_LnFcO-ekkAL6u0oFJIdvZAN1bxADJdxuJ2B7fKcHDKHi-B5iTv8OBwsUjT__b6gx92xCHXoKB8xZu-ihH3wGDoZX50cVWTVSEnk_Zc2Wl_RxvPJBLlBvvpuHe9mq8L4OlanSyd8BRoj1EpaXs5pX5vK53cZ2ZHaTXUwYirJzgCD_rFfhVSB1EyKAs4DBaH7DM3HAX5bczmP05Kv_0wXyCyg');