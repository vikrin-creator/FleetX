# FleetX Deployment Checklist

## Files to Upload to Hostinger

### 1. Backend Files (Upload to `/backend/` directory)
- [ ] `api/categories.php` - Updated API with file upload handling
- [ ] `uploads/categories/` - Create directory and upload all 6 PNG images
- [ ] `uploads/.htaccess` - Security configuration for uploads

### 2. Frontend Files (Upload to `/frontend/` or root directory)
- [ ] `src/pages/ProductCategories.js` - Updated admin interface with file upload
- [ ] `src/services/categoryService.js` - Updated service for FormData handling

### 3. Database Updates
- [x] Run `update_categories.sql` in phpMyAdmin (already completed)

## Deployment Steps

### Step 1: Upload Backend Files
1. Connect to your Hostinger file manager or FTP
2. Navigate to your website root directory
3. Upload the following files:

```
/backend/
├── api/
│   └── categories.php (UPDATED - file upload support)
└── uploads/
    ├── .htaccess (security)
    └── categories/
        ├── Air Spring & Shocks.png
        ├── Body and Cabin.png
        ├── Brake & Wheel.png
        ├── Chrome & Stainless.png
        ├── Cooling System.png
        └── Steering System.png
```

### Step 2: Upload Frontend Files
```
/frontend/src/
├── pages/
│   └── ProductCategories.js (UPDATED - file upload interface)
└── services/
    └── categoryService.js (UPDATED - FormData support)
```

### Step 3: Set Directory Permissions
- Set `/backend/uploads/` to 755 or 775
- Set `/backend/uploads/categories/` to 755 or 775
- Ensure web server can read/write to uploads directory

### Step 4: Test Deployment
1. Visit your admin panel: `https://your-domain.com/frontend/`
2. Navigate to Product Categories
3. Test:
   - [ ] Categories load with local images
   - [ ] File upload functionality works
   - [ ] Image preview displays correctly
   - [ ] CRUD operations work properly

## Important URLs
- **Frontend**: https://sandybrown-squirrel-472536.hostingersite.com/frontend/
- **API Endpoint**: https://sandybrown-squirrel-472536.hostingersite.com/backend/api/categories.php
- **Database**: u177524058_Fleetx

## Verification Commands
After deployment, test these URLs:
- GET: `https://sandybrown-squirrel-472536.hostingersite.com/backend/api/categories.php`
- Images: `https://sandybrown-squirrel-472536.hostingersite.com/backend/uploads/categories/Cooling%20System.png`

## Rollback Plan
If issues occur:
1. Keep backup of old files before uploading
2. Restore previous versions if needed
3. Check error logs in Hostinger control panel