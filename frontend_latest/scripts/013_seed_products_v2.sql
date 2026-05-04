-- Re-seed products with correct column names
DELETE FROM products;

INSERT INTO products (name, brand, description, price, original_price, category, skin_types, rating, review_count, image_url, in_stock, stock_quantity, tags, specifications, highlights)
VALUES
  ('Vitamin C Brightening Serum', 'GlowLab', 'A powerful antioxidant serum that brightens skin tone and reduces dark spots', 45.99, 59.99, 'Serums', ARRAY['All', 'Dull', 'Aging'], 4.8, 324, '/vitamin-c-serum.jpg', true, 156, ARRAY['Bestseller'], '{"size": "30ml"}', ARRAY['20% Pure Vitamin C', 'Brightens skin tone']),
  ('Hyaluronic Acid Moisturizer', 'HydraGlow', 'Deep hydration cream with hyaluronic acid', 38.50, null, 'Moisturizers', ARRAY['Dry', 'Normal'], 4.9, 512, '/moisturizer-jar.jpg', true, 89, ARRAY['Top Rated'], '{"size": "50g"}', ARRAY['Triple HA', 'Locks moisture']),
  ('Retinol Night Cream', 'YouthRevive', 'Anti-aging night cream with retinol', 52.00, null, 'Treatments', ARRAY['Aging', 'Normal'], 4.7, 289, '/retinol-cream-jar.jpg', true, 234, ARRAY['Gold List'], '{"size": "50ml"}', ARRAY['0.5% Retinol', 'Reduces fine lines']),
  ('Gentle Foaming Cleanser', 'PureClean', 'pH-balanced cleanser removes impurities', 24.99, null, 'Cleansers', ARRAY['All', 'Sensitive'], 4.6, 445, '/facial-cleanser-bottle.jpg', true, 100, ARRAY['Gentle'], '{"size": "150ml"}', ARRAY['pH-balanced', 'Non-stripping']),
  ('SPF 50 Sunscreen', 'SunShield', 'Broad-spectrum protection lightweight formula', 28.50, null, 'Sunscreen', ARRAY['All'], 4.9, 621, '/sunscreen-bottle.jpg', true, 200, ARRAY['Essential'], '{"size": "50ml"}', ARRAY['SPF 50', 'No white cast']);
