# Trace Data Flow for Pricing to Fix 'RNaN' Issue

The 'RNaN' issue is caused by a mismatch between the property name returned by the backend API and the property name expected by the frontend components.

## Findings

### Backend
- In `src/controllers/productController.ts`, the `projectPublicProduct` function maps the product's conditions to return `sellingPriceZAR` instead of `price`.
- Code: `sellingPriceZAR: c.sellingPriceZAR || c.price` (Line 20).

### Frontend
The frontend is still looking for the `price` property in several places:

1. **`client/src/pages/ContainersPage.tsx`**:
   - Interface `Product` defines `price: number` (Line 19).
   - Calculation of `minPrice` uses `product.conditions?.[0]?.price` (Line 66).

2. **`client/src/pages/ProductPage.tsx`**:
   - Display of condition prices uses `formatCurrency(c.price)` (Line 77).

3. **`client/src/pages/OrderForm.tsx`**:
   - Interface `OrderFormProps` defines `price: number` (Line 12).
   - Display of unit price uses `product.price.toLocaleString()` (Line 107).

## Proposed Fixes

### 1. `client/src/pages/ContainersPage.tsx`
- Update the `Product` interface to use `sellingPriceZAR` instead of `price`.
- Update line 66 to use `product.conditions?.[0]?.sellingPriceZAR`.

### 2. `client/src/pages/ProductPage.tsx`
- Update line 77 to use `formatCurrency(c.sellingPriceZAR)`.

### 3. `client/src/pages/OrderForm.tsx`
- Update the `OrderFormProps` interface to use `sellingPriceZAR` instead of `price`.
- Update line 107 to use `product.sellingPriceZAR.toLocaleString()`.

## Verification Plan
- Verify that the price is correctly displayed on the Containers page.
- Verify that the price is correctly displayed on the Product page.
- Verify that the price is correctly displayed on the Order form.
