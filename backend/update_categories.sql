-- Clear existing categories and insert new ones from Home page
-- First delete any category_items that reference categories
DELETE FROM category_items;
-- Then delete all categories
DELETE FROM categories;
-- Reset auto increment
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Insert new categories from Home page
INSERT INTO categories (name, description, image_url, created_at) VALUES
('Cooling System', 'Radiators, water pumps, thermostats, and cooling components for heavy-duty vehicles', 'uploads/categories/Cooling System.png', NOW()),

('Steering System', 'Power steering pumps, steering gears, tie rods, and steering components', 'uploads/categories/Steering System.png', NOW()),

('Body and Cabin', 'Cab parts, body panels, doors, windows, and interior components', 'uploads/categories/Body and Cabin.png', NOW()),

('Air Spring & Shocks', 'Air suspension systems, shock absorbers, and ride control components', 'uploads/categories/Air Spring & Shocks.png', NOW()),

('Air Brake & Wheel', 'Air brake systems, brake components, wheels, and tire accessories', 'uploads/categories/Brake & Wheel.png', NOW()),

('Chrome & Stainless', 'Chrome accessories, stainless steel parts, and decorative components', 'uploads/categories/Chrome & Stainless.png', NOW());