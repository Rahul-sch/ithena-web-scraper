import asyncio
import json
import csv
from pathlib import Path
from playwright.async_api import async_playwright
import time

# CONFIGURATION - Change these for other directories
CONFIG = {
      "url": "https://directory.imts.com/8_0/explore/exhibitor-gallery.cfm?featured=false",
      "exhibitor_card_selector": ".directory-item",
      "scroll_pause": 2,
      "max_scroll_attempts": 100
}

class IthenaIMTSScraper:
      def __init__(self):
                self.exhibitors = []
                self.seen_urls = set()

    def log(self, message):
              print(f"[Ithena IMTS Scraper] {message}")

    async def scrape(self):
              self.log("Launching browser")

        async with async_playwright() as p:
                      browser = await p.chromium.launch(headless=True)
                      page = await browser.new_page()

            self.log("Loading exhibitors")
            await page.goto(CONFIG["url"], wait_until="networkidle", timeout=60000)

            # Wait for initial load
            await page.wait_for_selector(CONFIG["exhibitor_card_selector"], timeout=30000)
            await asyncio.sleep(3)

            scroll_count = 0
            last_count = 0
            stall_count = 0

            while scroll_count < CONFIG["max_scroll_attempts"]:
                              # Scroll to bottom
                              await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                              await asyncio.sleep(CONFIG["scroll_pause"])

                # Extract current exhibitors
                              cards = await page.query_selector_all(CONFIG["exhibitor_card_selector"])
                              current_count = len(cards)

                if current_count > last_count:
                                      self.log(f"{current_count} found")
                                      last_count = current_count
                                      stall_count = 0
else:
                      stall_count += 1
                      if stall_count >= 3:
                                                self.log("No new exhibitors loading")
                                                break

                  scroll_count += 1

            # Extract all data
            self.log("Extracting data from all exhibitors")
            cards = await page.query_selector_all(CONFIG["exhibitor_card_selector"])

            for card in cards:
                              try:
                                                    exhibitor = await self.extract_exhibitor_data(card, page)
                                                    if exhibitor and exhibitor["profile_url"] not in self.seen_urls:
                                                                              self.exhibitors.append(exhibitor)
                                                                              self.seen_urls.add(exhibitor["profile_url"])
                              except Exception as e:
                                                    continue

                          await browser.close()

        self.log(f"Done — {len(self.exhibitors)} companies")

    async def extract_exhibitor_data(self, card, page):
              data = {
                            "name": "",
                            "profile_url": "",
                            "booth": "",
                            "city": "",
                            "state": "",
                            "country": "",
                            "description": "",
                            "featured": False,
                            "categories": []
              }

        # Name
              name_elem = await card.query_selector(".company-name, h3, .title")
              if name_elem:
                            data["name"] = (await name_elem.inner_text()).strip()

              # Profile URL
              link_elem = await card.query_selector("a[href*='exhibitor']")
              if link_elem:
                            href = await link_elem.get_attribute("href")
                            if href:
                                              data["profile_url"] = href if href.startswith("http") else f"https://directory.imts.com{href}"

                        # Featured status
                        featured_elem = await card.query_selector(".featured, .star, [class*='featured'], [class*='star']")
        data["featured"] = featured_elem is not None

        # Booth
        booth_elem = await card.query_selector(".booth, [class*='booth']")
        if booth_elem:
                      data["booth"] = (await booth_elem.inner_text()).strip()

        # Location
        location_elem = await card.query_selector(".location, .address, [class*='location']")
        if location_elem:
                      location_text = (await location_elem.inner_text()).strip()
                      parts = [p.strip() for p in location_text.split(",")]
                      if len(parts) >= 1:
                                        data["city"] = parts[0]
                                    if len(parts) >= 2:
                                                      data["state"] = parts[1]
                                                  if len(parts) >= 3:
                                                                    data["country"] = parts[2]

        # Description
        desc_elem = await card.query_selector(".description, p")
        if desc_elem:
                      data["description"] = (await desc_elem.inner_text()).strip()

        # Categories
        category_elems = await card.query_selector_all(".category, .tag, [class*='category']")
        for cat_elem in category_elems:
                      cat_text = (await cat_elem.inner_text()).strip()
            if cat_text:
                              data["categories"].append(cat_text)

        return data if data["name"] else None

    def save_results(self):
              output_dir = Path("output")
        output_dir.mkdir(exist_ok=True)

        # JSON
        json_path = output_dir / "imts_exhibitors.json"
        with open(json_path, "w", encoding="utf-8") as f:
                      json.dump(self.exhibitors, f, indent=2, ensure_ascii=False)
        self.log(f"Saved {json_path}")

        # CSV
        if self.exhibitors:
                      csv_path = output_dir / "imts_exhibitors.csv"
            with open(csv_path, "w", newline="", encoding="utf-8") as f:
                              writer = csv.DictWriter(f, fieldnames=[
                                                    "name", "profile_url", "booth", "city", "state", 
                                                    "country", "description", "featured", "categories"
                              ])
                              writer.writeheader()
                              for exhibitor in self.exhibitors:
                                                    row = exhibitor.copy()
                                                    row["categories"] = "; ".join(row["categories"])
                                                    writer.writerow(row)
                                            self.log(f"Saved {csv_path}")

async def main():
      scraper = IthenaIMTSScraper()
    await scraper.scrape()
    scraper.save_results()

if __name__ == "__main__":
      asyncio.run(main())
