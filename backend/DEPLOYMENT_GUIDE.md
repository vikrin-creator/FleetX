# FleetX Backend Deployment Guide - Hostinger

## Files to Upload to Hostinger

Upload these files to your Hostinger public_html directory:

### 1. Root Files
- `.htaccess` (for URL rewriting and CORS)

### 2. API Directory Structure
```
public_html/
├── .htaccess
├── api/
│   ├── index.php (main router)
│   ├── categories.php (categories controller)
│   └── v1/
│       └── categories.php (backup controller)
├── config/
│   ├── config.php
│   └── database.php
└── utils/
    └── Response.php
```

## Steps to Deploy:

1. **Access Hostinger File Manager:**
   - Log in to Hostinger control panel
   - Go to File Manager
   - Navigate to public_html folder

2. **Upload Files:**
   - Upload .htaccess to root of public_html
   - Create 'api' folder in public_html
   - Upload api/index.php and api/categories.php to api/ folder
   - Create 'config' folder and upload config files
   - Create 'utils' folder and upload Response.php

3. **Database Setup:**
   - Your database is already created with tables
   - Database credentials are configured in config/database.php

4. **Test API:**
   After uploading, test these endpoints:
   - https://sandybrown-squirrel-472536.hostingersite.com/api/v1/categories

## Important Notes:
- Make sure .htaccess is uploaded to enable URL rewriting
- Verify that config/database.php has correct Hostinger database credentials
- Test API endpoints after deployment