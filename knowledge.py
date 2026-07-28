"""
knowledge.py

Knowledge storage and retrieval.
"""


class Knowledge:

    def __init__(self):

        self.database = {}

    def add(self, key, value):

        self.database[key] = value

    def get(self, key):

        return self.database.get(
            key,
            "Knowledge not found."
        )

    def exists(self, key):

        return key in self.database

    def remove(self, key):

        if key in self.database:
            del self.database[key]

    def keys(self):

        return list(self.database.keys())

    def all(self):

        return self.database
