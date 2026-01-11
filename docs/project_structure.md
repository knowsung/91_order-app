# Project Structure

This document summarizes the current folder layout of the app and what each area does.

```
91_order-app/
├── DEPLOYMENT.md
├── QUICK_START.md
├── docs/
│   ├── PRD.md
│   └── project_structure.md
├── server/
│   ├── README.md
│   ├── START_SERVER.md
│   ├── package.json
│   ├── package-lock.json
│   ├── render.yaml
│   ├── env.example
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── menuController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── menus.js
│   │   └── orders.js
│   └── scripts/
│       ├── check-env.js
│       ├── create-database.sql
│       ├── create-db.js
│       ├── init-db.js
│       ├── init-db.sql
│       ├── seed-data.js
│       ├── seed-data.sql
│       └── test-db.js
└── ui/
    ├── README.md
    ├── IMPROVEMENTS.md
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.js
    ├── env.production.example
    ├── public/
    │   └── images/
    │       ├── README.md
    │       ├── americano-hot_1.jpg
    │       ├── americano-ice_2.jpg
    │       └── cafe-latte.jpg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── services/
        │   └── api.js
        └── components/
            ├── AdminDashboard.jsx
            ├── AdminDashboard.css
            ├── Cart.jsx
            ├── Cart.css
            ├── Header.jsx
            ├── Header.css
            ├── InventoryStatus.jsx
            ├── InventoryStatus.css
            ├── MenuCard.jsx
            ├── MenuCard.css
            ├── OrderStatus.jsx
            └── OrderStatus.css
```

## Root
- `DEPLOYMENT.md` — Production and hosting notes.
- `QUICK_START.md` — Local setup and quick run steps.
- `docs/` — Project documentation.

## docs/
- `PRD.md` — Product requirements and scope.
- `project_structure.md` — This folder map and file roles.

## server/ (backend API)
- `README.md` — Backend overview and usage.
- `START_SERVER.md` — Simple server start guide.
- `package.json`, `package-lock.json` — Backend dependencies and scripts.
- `render.yaml` — Render deployment configuration.
- `env.example` — Environment variable template.
- `server.js` — API server entry point.

### server/config/
- `database.js` — Database connection and settings.

### server/controllers/
- `menuController.js` — Menu business logic.
- `orderController.js` — Order business logic.

### server/routes/
- `menus.js` — Menu API routes.
- `orders.js` — Order API routes.

### server/scripts/
- `check-env.js` — Environment validation helper.
- `create-database.sql` — SQL to create the database.
- `create-db.js` — DB creation script wrapper.
- `init-db.js`, `init-db.sql` — DB initialization scripts.
- `seed-data.js`, `seed-data.sql` — Seed data scripts.
- `test-db.js` — DB connectivity test.

## ui/ (frontend)
- `README.md` — Frontend overview and usage.
- `IMPROVEMENTS.md` — UI improvement notes.
- `package.json`, `package-lock.json` — Frontend dependencies and scripts.
- `index.html` — Vite HTML entry.
- `vite.config.js` — Vite configuration.
- `env.production.example` — Production env template.

### ui/public/
- `images/` — Static product images and notes.

### ui/src/
- `main.jsx` — React app bootstrap.
- `App.jsx` — Main application component.
- `App.css`, `index.css` — Global styles.

#### ui/src/services/
- `api.js` — API client calls.

#### ui/src/components/
- `AdminDashboard.jsx` — Admin screen for order/menu management.
- `Cart.jsx` — Cart UI and interactions.
- `Header.jsx` — App header/navigation.
- `InventoryStatus.jsx` — Inventory view for admins.
- `MenuCard.jsx` — Menu item display card.
- `OrderStatus.jsx` — Order status tracking UI.
- `*.css` — Component-level styles.
