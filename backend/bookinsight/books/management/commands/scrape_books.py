import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from books.models import Book

class Command(BaseCommand):
    help = 'Scrape books from books.toscrape.com'

    def handle(self, *args, **kwargs):
        base_url = "http://books.toscrape.com/catalogue/"
        url = "http://books.toscrape.com/catalogue/page-1.html"
        books_scraped = 0

        self.stdout.write("Starting scraper...")

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

                detail = requests.get(book_url)
                detail_soup = BeautifulSoup(detail.text, 'html.parser')
                desc_tag = detail_soup.find('meta', attrs={'name': 'description'})
                description = desc_tag['content'].strip() if desc_tag else ''

                if not Book.objects.filter(title=title).exists():
                    Book.objects.create(
                        title=title,
                        author='Unknown',
                        rating=rating,
                        description=description,
                        book_url=book_url
                    )
                    books_scraped += 1
                    self.stdout.write(f"Saved: {title}")

            next_btn = soup.find('li', class_='next')
            if next_btn:
                next_page = next_btn.a['href']
                url = base_url + next_page
            else:
                url = None

        self.stdout.write(f"Done! Scraped {books_scraped} books.")