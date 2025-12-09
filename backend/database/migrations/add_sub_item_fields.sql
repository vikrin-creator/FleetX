-- Add brand, manufacturer, and dtna_classification columns to item_sub_items table

ALTER TABLE item_sub_items 
ADD COLUMN brand VARCHAR(100) DEFAULT NULL AFTER image_url,
ADD COLUMN manufacturer VARCHAR(100) DEFAULT NULL AFTER brand,
ADD COLUMN dtna_classification VARCHAR(50) DEFAULT NULL AFTER manufacturer;

-- Add index for filtering
CREATE INDEX idx_brand ON item_sub_items(brand);
CREATE INDEX idx_manufacturer ON item_sub_items(manufacturer);
CREATE INDEX idx_dtna_classification ON item_sub_items(dtna_classification);
