# Al Hidaya Quran Interpretation Competition 2027

Responsive public registration website starter for **Al Hidaya Islamic University, Uliyil, Mattannur, Kannur**.

## Included
- Event landing page with the supplied official poster
- Programme-heading PNG and college-logo image slots
- 27 January 2027 event date and ₹200 fee
- UPI deep link (requires your real UPI ID)
- Registration form and private payment-proof upload
- Supabase database schema with public insert-only access
- `/admin` organiser sign-in, registration list, payment status review and CSV export
- PowerShell setup script

## 1. Requirements
Install:
- Node.js LTS (includes npm)
- PowerShell (Windows 10/11)

## 2. Run on Windows
Extract the ZIP, open PowerShell in the extracted folder, then run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

The script installs dependencies, creates `.env` from `.env.example` if needed, and starts the local development server.

Open the URL printed by Vite, usually http://localhost:5173.

## 3. Configure UPI
Open `.env` and replace:
- `VITE_UPI_ID` with the college's verified UPI ID
- `VITE_UPI_NAME` with the exact payee name
- `VITE_CONTACT_WHATSAPP` with the official WhatsApp number including country code, digits only

The UPI button opens a UPI payment app with ₹200 pre-filled. It does **not** automatically verify payment. Organisers must check the UTR/reference and uploaded proof in the payment account.

## 4. Connect the registration database
1. Create a Supabase project at https://supabase.com.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy Project URL and anon/public key from Project Settings > API.
4. Put them in `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Restart `npm run dev`.

Never put a Supabase `service_role` key in this website or in `.env` variables starting with `VITE_`.

## 5. Add the two identity images
Copy your transparent PNG files into `public/assets/` using these exact names:
- `programme-heading.png` — shown at the top of the home page
- `college-logo.png` — shown in the header and footer

The page already includes the supplied poster at `public/assets/event-poster.jpg`.

## 6. Admin / payment verification
This starter deliberately does not expose participant data publicly. Admin access must be configured in Supabase:
1. Create the organiser/admin account in Supabase Authentication > Users.
2. Copy the admin user's UUID.
3. In `supabase/schema.sql`, uncomment the admin policies and replace `REPLACE-WITH-ADMIN-USER-UUID` with that UUID.
4. Run those policy statements in SQL Editor.

Open your deployed site at `/admin` to sign in, review registrations, open payment proofs, update payment status and export CSV. The SQL admin policies must be enabled with your admin user's UUID before the dashboard can read/update records.

## 7. Publish the public site
1. Push this folder to a private/public GitHub repository (do not commit `.env`).
2. Import the repository into Vercel.
3. Add the four `.env` values in Vercel Project Settings > Environment Variables.
4. Deploy. The public URL can then be shared.

## Important launch checklist
- Confirm event date: **27 January 2027** (poster English paragraph currently mentions 21 January; this project uses the date you confirmed).
- Add programme heading PNG and official college logo.
- Replace placeholder UPI ID and WhatsApp number.
- Test a registration end-to-end with a small test payment before public launch.
- Confirm eligibility/category rules and contact details with the organisers.
