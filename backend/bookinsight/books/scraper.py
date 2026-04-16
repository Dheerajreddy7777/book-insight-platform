import requests
from bs4 import BeautifulSoup
import django
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookinsight.settings')
django.setup()

from books.models import Book

def scrape_books():
    base_url = "http://books.toscrape.com/catalogue/"
    url = "http://books.toscrape.com/catalogue/page-1.html"
    books_scraped = 0

    print("Starting scraper...")

    while url and books_scraped < 40:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        book_list = soup.find_all('article', class_='product_pod')

        for book in book_list:
            title = book.h3.a['title']
            rating_word = book.p['class'][1]
            rating_map = {'One': '1', 'Two': '2', 'Three': '3', 'Four': '4', 'Five': '5'}
            rating = rating_map.get(rating_word, 'N/A')
            book_path = book.h3.a['href']
            book_url = base_url + book_path

            # Get book description from detail page
            detail = requests.get(book_url)
            detail_soup = BeautifulSoup(detail.text, 'html.parser')
            desc_tag = detail_soup.find('meta', attrs={'name': 'description'})
            description = desc_tag['content'].strip() if desc_tag else ''
            author_tag = detail_soup.find('th', string='UPC')
            author = 'Unknown'

            # Save to database
            if not Book.objects.filter(title=title).exists():
                Book.objects.create(
                    title=title,
                    author=author,
                    rating=rating,
                    description=description,
                    book_url=book_url
                )
                books_scraped += 1
                print(f"Saved: {title}")

        # Go to next page
        next_btn = soup.find('li', class_='next')
        if next_btn:
            next_page = next_btn.a['href']
            url = base_url + next_page
        else:
            url = None

    print(f"Done! Scraped {books_scraped} books.")

if __name__ == '__main__':
    scrape_books()