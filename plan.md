# PLAN.md — Inventory & Order Management System

## React Frontend with shadcn/ui

---

## 1. Project Overview

A full-stack Inventory & Order Management System frontend built in React (JavaScript),
containerized with Docker, and connected to a FastAPI + PostgreSQL backend.

**Design Philosophy**

- Clean, professional, sidebar-based layout
- Server state managed entirely by TanStack Query (no Redux)
- Modals for simple CRUD, dedicated page only for Create Order
- shadcn/ui as the sole component library — no mixing

---

## 2. Tech Stack

| Layer            | Technology                 | Purpose                                 |
| ---------------- | -------------------------- | --------------------------------------- |
| Framework        | React 18 (JavaScript)      | UI rendering                            |
| Build Tool       | Vite                       | Fast dev server, lightweight build      |
| Routing          | React Router v6            | Client-side navigation                  |
| Component Lib    | shadcn/ui                  | UI components                           |
| Styling          | Tailwind CSS               | Utility-first styling (ships w/ shadcn) |
| Server State     | TanStack Query v5          | API calls, caching, loading states      |
| HTTP Client      | Axios                      | API communication                       |
| Form Handling    | React Hook Form + Zod      | Forms + schema validation               |
| Notifications    | shadcn/ui Toaster (Sonner) | Success/error feedback                  |
| Containerization | Docker + Docker Compose    | Production deployment                   |

---

## 3. Folder Structure

frontend/
├── public/
├── src/
│ ├── components/
│ │ ├── layout/
│ │ │ ├── AppLayout.jsx ← root layout wrapper
│ │ │ ├── Sidebar.jsx ← nav links + logo
│ │ │ └── Header.jsx ← page title + breadcrumb
│ │ ├── shared/
│ │ │ ├── DataTable.jsx ← reusable table w/ loading skeleton
│ │ │ ├── ConfirmDialog.jsx ← delete confirmation dialog
│ │ │ ├── StatCard.jsx ← dashboard metric card
│ │ │ ├── PageHeader.jsx ← page title + CTA button
│ │ │ ├── EmptyState.jsx ← empty list state
│ │ │ └── ErrorState.jsx ← API error state
│ │ ├── products/
│ │ │ ├── ProductTable.jsx
│ │ │ ├── ProductFormModal.jsx ← add + edit (same modal, different mode)
│ │ │ └── StockBadge.jsx ← colored qty badge
│ │ ├── customers/
│ │ │ ├── CustomerTable.jsx
│ │ │ └── CustomerFormModal.jsx
│ │ └── orders/
│ │ ├── OrderTable.jsx
│ │ ├── OrderDetailModal.jsx
│ │ └── LineItemRow.jsx ← product picker row in CreateOrder
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Products.jsx
│ │ ├── Customers.jsx
│ │ ├── Orders.jsx
│ │ └── CreateOrder.jsx
│ ├── services/
│ │ ├── api.js ← axios instance with base URL + interceptors
│ │ ├── productService.js
│ │ ├── customerService.js
│ │ └── orderService.js
│ ├── hooks/
│ │ ├── useProducts.js ← TanStack Query hooks
│ │ ├── useCustomers.js
│ │ └── useOrders.js
│ ├── lib/
│ │ └── utils.js ← shadcn default + custom helpers (cn, formatCurrency)
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env
├── .env.example
├── .dockerignore
├── Dockerfile
├── vite.config.js
├── tailwind.config.js
└── package.json

---

## 4. Environment Variables

**.env**
VITE_API_BASE_URL=http://localhost:8000

**.env.example**
VITE_API_BASE_URL=http://<backend-service-name>:8000

In Docker Compose, `VITE_API_BASE_URL` will point to the backend service name,
e.g., `http://backend:8000`. Do not hardcode.

---

## 5. API Service Layer

### `src/services/api.js`

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Global error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.detail || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;
```

### `src/services/productService.js`

```js
import api from "./api";

export const getProducts = () => api.get("/products").then((r) => r.data);
export const getProduct = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);
export const createProduct = (data) =>
  api.post("/products", data).then((r) => r.data);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((r) => r.data);
```

### `src/services/customerService.js`

```js
import api from "./api";

export const getCustomers = () => api.get("/customers").then((r) => r.data);
export const getCustomer = (id) =>
  api.get(`/customers/${id}`).then((r) => r.data);
export const createCustomer = (data) =>
  api.post("/customers", data).then((r) => r.data);
export const deleteCustomer = (id) =>
  api.delete(`/customers/${id}`).then((r) => r.data);
```

### `src/services/orderService.js`

```js
import api from "./api";

export const getOrders = () => api.get("/orders").then((r) => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const createOrder = (data) =>
  api.post("/orders", data).then((r) => r.data);
export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`).then((r) => r.data);
```

---

## 6. TanStack Query Hooks

### `src/hooks/useProducts.js`

```js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { toast } from "sonner";

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: getProducts });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries(["products"]);
      toast.success("Product created");
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries(["products"]);
      toast.success("Product updated");
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries(["products"]);
      toast.success("Product deleted");
    },
    onError: (err) => toast.error(err.message),
  });
};
```

> Repeat the same pattern for `useCustomers.js` and `useOrders.js`.

---

## 7. Pages — Detailed Spec

---

### 7.1 Dashboard `/`

**Purpose:** At-a-glance health check of the entire system.

**Data Sources:**

- `GET /products` → total count, low stock list (qty < 10)
- `GET /customers` → total count
- `GET /orders` → total count

**Layout:**
┌──────────────────────────────────────────────────┐
│ [StatCard: Total Products] [StatCard: Customers] │
│ [StatCard: Total Orders] [StatCard: Low Stock] │
├──────────────────────────────────────────────────┤
│ Low Stock Alert Table │
│ Name | SKU | Price | Qty ← sorted asc by qty │
└──────────────────────────────────────────────────┘

**shadcn/ui Components:**

- `Card`, `CardHeader`, `CardContent` → StatCard
- `Table`, `TableBody`, `TableRow`, `TableCell` → Low stock table
- `Badge` (variant: destructive) → qty warning

**StatCard fields:** icon + label + value + optional subtext

---

### 7.2 Products `/products`

**Purpose:** Full CRUD for products.

**Layout:**
┌──────────────────────────────────────────────────┐
│ Products [+ Add Product] │
├──────────────────────────────────────────────────┤
│ [Search input] │
├──────────────────────────────────────────────────┤
│ Name | SKU | Price | Stock | Actions │
│ .... | ... | ..... | [badge]| [Edit] [Delete] │
└──────────────────────────────────────────────────┘

**Interactions:**

- **Add Product** button → opens `ProductFormModal` in `create` mode
- **Edit** icon → opens `ProductFormModal` in `edit` mode, pre-filled
- **Delete** icon → opens `ConfirmDialog`
- Search filters table client-side by name or SKU

**ProductFormModal Fields (React Hook Form + Zod):**
| Field | Type | Validation |
|----------|--------|-----------------------------------|
| name | text | required, min 2 chars |
| sku | text | required, unique enforced by API |
| price | number | required, > 0 |
| quantity | number | required, >= 0 |

**StockBadge logic:**

- qty = 0 → Badge destructive "Out of Stock"
- qty < 10 → Badge warning "Low Stock"
- qty >= 10 → Badge success "In Stock"

**shadcn/ui Components:**

- `Dialog`, `DialogContent`, `DialogHeader` → modal
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` → form
- `Input`, `Button`, `Badge`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`

---

### 7.3 Customers `/customers`

**Purpose:** Add, view, and delete customers.

**Layout:**
┌──────────────────────────────────────────────────┐
│ Customers [+ Add Customer] │
├──────────────────────────────────────────────────┤
│ Full Name | Email | Phone | Actions │
│ ..... | ..... | ..... | [Delete] │
└──────────────────────────────────────────────────┘

**Note:** No edit endpoint in spec → no Edit button. Only Add + Delete.

**CustomerFormModal Fields:**
| Field | Type | Validation |
|--------|-------|--------------------------------|
| name | text | required, min 2 chars |
| email | email | required, valid email format |
| phone | text | required, min 10 chars |

**shadcn/ui Components:** Same pattern as Products.

---

### 7.4 Orders `/orders`

**Purpose:** View all orders, inspect details, cancel orders.

**Layout:**
┌──────────────────────────────────────────────────┐
│ Orders [+ Create Order] │
├──────────────────────────────────────────────────┤
│ Order ID | Customer | Items | Total | Actions │
│ #001 | John Doe | 3 | ₹900 | [View][Del]│
└──────────────────────────────────────────────────┘

**Interactions:**

- **Create Order** → navigates to `/orders/new`
- **View** → opens `OrderDetailModal`
- **Delete** → opens `ConfirmDialog`

**OrderDetailModal shows:**

- Order ID, Customer name, Created date
- Line items table: Product Name | Qty | Unit Price | Subtotal
- Total amount (bottom right)

**shadcn/ui Components:**

- `Dialog`, `Separator`, `Table`, `Badge`, `ScrollArea`

---

### 7.5 Create Order `/orders/new`

**Purpose:** Multi-step order builder — most complex page.

**Layout:**
┌──────────────────────────────────────────────────┐
│ ← Back to Orders Create New Order │
├──────────────────────────┬───────────────────────┤
│ Step 1: Select Customer │ Order Summary │
│ [Searchable Select] │ Customer: John Doe │
│ │ ───────────────── │
│ Step 2: Add Products │ Product A x2 ₹400 │
│ [Product dropdown] │ Product B x1 ₹200 │
│ [Qty input] │ ───────────────── │
│ [+ Add Item] │ Total: ₹600 │
│ │ │
│ Line Items list below │ [Place Order] │
└──────────────────────────┴───────────────────────┘

**State (local React state, not TanStack Query):**

```js
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [lineItems, setLineItems] = useState([
  // { product_id, product_name, price, quantity }
]);
```

**Business Logic on Frontend:**

- Prevent adding same product twice → check existing lineItems
- Qty input max = product's available stock (fetched from products list)
- Live total = `lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0)`
- Disable Place Order if no customer or no line items

**On Submit:**

```js
POST /orders
{
  customer_id: selectedCustomer.id,
  items: lineItems.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
}
```

Backend calculates total. On success → `toast.success` → `navigate('/orders')`.

**shadcn/ui Components:**

- `Select`, `Command`, `Popover` → searchable customer/product dropdowns
- `Input`, `Button`, `Separator`, `Card`, `ScrollArea`
- `Table` → line items preview

---

## 8. Shared Components — Spec

### `DataTable.jsx`

- Props: `columns`, `data`, `isLoading`, `emptyMessage`
- Shows `Skeleton` rows (5 rows) when `isLoading = true`
- Shows `EmptyState` when data is empty

### `ConfirmDialog.jsx`

- Props: `open`, `onConfirm`, `onCancel`, `title`, `description`, `isLoading`
- Uses shadcn `AlertDialog`
- Confirm button shows spinner when `isLoading = true`

### `StatCard.jsx`

- Props: `title`, `value`, `icon`, `subtext`
- Uses shadcn `Card`

### `PageHeader.jsx`

- Props: `title`, `actionLabel`, `onAction`
- Renders page title (left) + primary Button (right)

---

## 9. Routing Setup (`App.jsx`)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 10. Sidebar Nav Config

```js
const navLinks = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Package },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Orders", path: "/orders", icon: ShoppingCart },
];
```

Active link detected via `useLocation()` — apply active styles with shadcn `cn()`.

---

## 11. shadcn/ui Components to Install

Run these after project scaffold:

```bash
npx shadcn@latest init

npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add select
npx shadcn@latest add skeleton
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add sonner
```

---

## 12. Docker Setup

### `frontend/Dockerfile`

```dockerfile
# Stage 1 — Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2 — Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `frontend/nginx.conf`

```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;  # SPA fallback
  }
  location /api/ {
    proxy_pass http://backend:8000/;
  }
}
```

### `frontend/.dockerignore`

node_modules
dist
.env
\*.local

### `docker-compose.yml` (root level)

```yaml
version: "3.9"

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    restart: always
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_BASE_URL: http://localhost:8000
    restart: always
    depends_on:
      - backend
    ports:
      - "3000:80"

volumes:
  postgres_data:
```

### `.env` (root level — never commit)

POSTGRES_DB=inventory_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=supersecretpassword

---

## 13. Implementation Order (Execution Phases)

### Phase 1 — Scaffold (Day 1)

- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install dependencies: `react-router-dom`, `@tanstack/react-query`, `axios`,
      `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`
- [ ] Run `npx shadcn@latest init`
- [ ] Install all shadcn components (Section 11)
- [ ] Set up folder structure
- [ ] Build `AppLayout`, `Sidebar`, `Header`
- [ ] Set up routing in `App.jsx`
- [ ] Configure `QueryClientProvider` in `main.jsx`

### Phase 2 — Service Layer (Day 1)

- [ ] `api.js` with axios instance + error interceptor
- [ ] All three service files
- [ ] All three hook files

### Phase 3 — Products Page (Day 2)

- [ ] `DataTable` shared component with skeleton
- [ ] `ConfirmDialog` shared component
- [ ] `ProductTable`
- [ ] `ProductFormModal` (create + edit mode)
- [ ] `StockBadge`
- [ ] Wire up `Products.jsx` page — full CRUD working

### Phase 4 — Customers Page (Day 2)

- [ ] `CustomerTable`
- [ ] `CustomerFormModal`
- [ ] Wire up `Customers.jsx` page

### Phase 5 — Orders Pages (Day 3)

- [ ] `OrderTable`
- [ ] `OrderDetailModal`
- [ ] Wire up `Orders.jsx` page
- [ ] `LineItemRow` component
- [ ] Wire up `CreateOrder.jsx` — full flow working

### Phase 6 — Dashboard (Day 3)

- [ ] `StatCard`
- [ ] Low stock table
- [ ] Wire up `Dashboard.jsx` with all three queries

### Phase 7 — Polish + Docker (Day 4)

- [ ] `EmptyState` + `ErrorState` for all pages
- [ ] Mobile responsiveness pass (sidebar collapse)
- [ ] Toast notifications audit
- [ ] Write `Dockerfile` + `nginx.conf`
- [ ] Write `docker-compose.yml`
- [ ] End-to-end test with all three containers running
- [ ] Write `README.md`

---

## 14. Key Design Decisions

| Decision                        | Choice                                       | Reason                             |
| ------------------------------- | -------------------------------------------- | ---------------------------------- |
| No Redux                        | TanStack Query only                          | Server state is 100% of state here |
| Modals for simple CRUD          | Fewer page navigations, snappier UX          |                                    |
| Dedicated page for Create Order | Too complex for a modal                      |                                    |
| nginx for frontend container    | Proper SPA routing + reverse proxy           |                                    |
| Multi-stage Docker build        | Keeps image lean (~25MB final)               |                                    |
| Zod schemas                     | Validates before hitting API, clean errors   |                                    |
| Client-side search              | No need for backend search on small datasets |                                    |
