$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host " AL HIDAYA - Quran Competition Website Setup" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor DarkCyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js was not found. Install Node.js LTS from https://nodejs.org and reopen PowerShell." -ForegroundColor Red
  exit 1
}
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example. Add your Supabase and UPI details before accepting registrations." -ForegroundColor Yellow
}
Write-Host "Installing project packages..." -ForegroundColor Cyan
npm install
Write-Host ""
Write-Host "Starting the website. Press Ctrl+C to stop." -ForegroundColor Green
npm run dev
