# Plan: Analyze Pricing Data Flow for 'RNaN' Root Cause

## Objective
Find the root cause of 'RNaN' appearing in pricing data by tracing the flow from backend to frontend.

## Steps
1. **Backend Analysis**
    - [x] Read `src/controllers/productController.ts` to see how prices are sent.
    - [x] Identify relevant DTOs or Models to confirm the field name (e.g., `sellingPriceZAR`).
2. **Frontend Analysis**
    - [x] Verify existence of `C:\Users\cassi\Desktop\AOR\aor-containers\client`.
    - [x] Read `client/src/pages/ProductPage.tsx`.
    - [x] Read `client/src/components/common/ProductCard.tsx`.
    - [x] Read `client/src/utils/currency.ts` to analyze formatting logic.
3. **Comparison & Hypothesis**
    - [x] Compare backend field name with frontend expected field name.
    - [x] Check if `price` vs `sellingPriceZAR` is the cause.
4. **Data Integrity Check**
    - [x] Review `supabase_schema.sql` for constraints on price fields.
    - [x] Search for seed data or mocks with 0 or null prices.
5. **Final Report**
    - [ ] Summarize findings and pinpoint the root cause.

