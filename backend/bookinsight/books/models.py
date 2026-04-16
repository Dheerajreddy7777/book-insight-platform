from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=500)
    rating = models.CharField(max_length=50)
    reviews = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    book_url = models.URLField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
