# FleetX API Deployment Checklist

## Files to Upload to Hostinger public_html:

### Essential Files:
- [x] test.php (test endpoint)
- [x] categories.php (main categories API)

### File Locations:
```
public_html/
├── test.php
├── categories.php
└── (your other website files)
```

## Testing URLs:

1. **Test PHP Works:**
   https://sandybrown-squirrel-472536.hostingersite.com/test.php

2. **Test Categories API:**
   https://sandybrown-squirrel-472536.hostingersite.com/categories.php

## Expected Responses:

### test.php should return:
```json
{
  "success": true,
  "message": "PHP API is working!",
  "timestamp": "2025-12-06 21:30:00",
  "server_info": {
    "php_version": "8.x",
    "server_software": "nginx"
  }
}
```

### categories.php should return:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Cooling System",
      "description": "...",
      "image_url": "...",
      "status": "active"
    }
  ]
}
```

## If API doesn't work:
1. Check file permissions (should be 644)
2. Verify files are in public_html root
3. Check PHP error logs in Hostinger control panel