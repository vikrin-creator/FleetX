-- Create table for storing multiple images per sub-item
CREATE TABLE IF NOT EXISTS sub_item_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_item_id INT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sub_item_id) REFERENCES item_sub_items(id) ON DELETE CASCADE,
    INDEX idx_sub_item_id (sub_item_id),
    INDEX idx_display_order (display_order)
);

-- Migrate existing single images from item_sub_items to sub_item_images
INSERT INTO sub_item_images (sub_item_id, image_url, display_order, is_primary)
SELECT id, image_url, 0, TRUE
FROM item_sub_items
WHERE image_url IS NOT NULL AND image_url != '';

-- Note: We keep the image_url column in item_sub_items for backward compatibility
-- It will store the primary image URL for quick access
