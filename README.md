# Ithena IMTS Scraper

Scrapes all exhibitors from IMTS directory and exports to Excel/Google Sheets.

## Setup (5 minutes)

Choose your operating system:
- [Windows Setup](#windows-setup)
- [macOS Setup](#macos-setup)

---

## Windows Setup

### 1. Install Python
1. Download: https://www.python.org/downloads/
2. Run installer
3. **CHECK "Add Python to PATH"** ✓
4. Click "Install Now"

### 2. Open Command Prompt
- Press `Windows Key + R`
- Type `cmd`
- Press Enter

### 3. Install
Copy and paste these commands one at a time:

```cmd
cd Desktop
mkdir imts-scraper
cd imts-scraper
python -m venv venv
venv\Scripts\activate
pip install playwright
playwright install chromium
```

### 4. Add Files
- Copy `scrape.py` into the `imts-scraper` folder on your Desktop
- Copy `requirements.txt` into the same folder

### 5. Run
```cmd
python scrape.py
```

Wait 10-20 minutes. When done, open the `output` folder.

---

## macOS Setup

### 1. Install Python
Python 3 usually comes pre-installed on macOS. To verify:
1. Open Terminal (Applications → Utilities → Terminal)
2. Type `python3 --version`
3. If not installed, download from: https://www.python.org/downloads/

### 2. Open Terminal
- Press `Command + Space`
- Type `Terminal`
- Press Enter

### 3. Install
Copy and paste these commands one at a time:

```bash
cd ~/Desktop
mkdir imts-scraper
cd imts-scraper
python3 -m venv venv
source venv/bin/activate
pip install playwright
playwright install chromium
```

### 4. Add Files
- Copy `scrape.py` into the `imts-scraper` folder on your Desktop
- Copy `requirements.txt` into the same folder

### 5. Run
```bash
python3 scrape.py
```

Wait 10-20 minutes. When done, open the `output` folder.

---

## Output Files

Two files in `output/` folder:
- `imts_exhibitors.csv` ← Open in Excel
- `imts_exhibitors.json` ← Raw data

### Open in Excel
1. Open Excel
2. File → Open
3. Browse to Desktop → imts-scraper → output
4. Select `imts_exhibitors.csv`

### Open in Google Sheets
1. Go to sheets.google.com
2. File → Import → Upload
3. Upload `imts_exhibitors.csv`
