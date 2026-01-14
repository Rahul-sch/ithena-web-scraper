ithena IMTS Exhibitor Scraper
Production web scraper for JavaScript-heavy exhibitor directories. Built for IMTS directory but reusable for other sites.
What This Does
Scrapes all exhibitors from the IMTS directory including:

Company names
Profile URLs
Booth numbers
Locations (city, state, country)
Descriptions
Featured/starred status
Categories/tags

Outputs to:

output/imts_exhibitors.json
output/imts_exhibitors.csv

Requirements

Python 3.10 or newer
Internet connection

Installation for Beginners
Step 1: Install Python
Windows:

Go to https://www.python.org/downloads/
Download Python 3.10 or newer
Run installer - CHECK "Add Python to PATH"
Click "Install Now"

Mac:
bashbrew install python@3.10
Linux:
bashsudo apt update
sudo apt install python3.10 python3.10-venv
Step 2: Create Project Folder
Windows:
cmdmkdir ithena-imts-scraper
cd ithena-imts-scraper
Mac/Linux:
bashmkdir ithena-imts-scraper
cd ithena-imts-scraper
Step 3: Create Virtual Environment
Windows:
cmdpython -m venv venv
venv\Scripts\activate
Mac/Linux:
bashpython3 -m venv venv
source venv/bin/activate
You'll see (venv) in your terminal when activated.
Step 4: Install Dependencies
bashpip install -r requirements.txt
playwright install chromium
This downloads Playwright and a Chromium browser (~300MB).
Running the Scraper
Make sure your virtual environment is activated (you see (venv)).
bashpython scrape.py
The scraper will:

Launch a headless browser
Load the IMTS directory
Scroll and load all exhibitors
Extract data
Save to output/ folder

Expected runtime: 10-20 minutes depending on connection.
Output Files
After running, check the output/ folder:

imts_exhibitors.json - All data in JSON format
imts_exhibitors.csv - Spreadsheet-friendly format

Opening the CSV
Excel:

Open Excel
File → Open
Select imts_exhibitors.csv

Google Sheets:

Go to sheets.google.com
File → Import → Upload
Select imts_exhibitors.csv

Customizing for Other Directories
Edit the CONFIG dictionary in scrape.py:
pythonCONFIG = {
    "url": "YOUR_TARGET_URL",
    "exhibitor_card_selector": ".your-card-class",
    "scroll_pause": 2,
    "max_scroll_attempts": 100
}
Troubleshooting
"python: command not found"

Use python3 instead of python
Reinstall Python with "Add to PATH" checked

"playwright not found"

Run: playwright install chromium

Scraper hangs

Increase scroll_pause to 3-4 seconds
Check internet connection

No data extracted

The website may have changed HTML structure
Inspect the page and update selectors in extract_exhibitor_data()

Deactivating Virtual Environment
When done:
bashdeactivate
License
Internal Ithena.ai use only.
