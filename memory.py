"""
memory.py

Simple conversation memory.
"""

from collections import deque


class Memory:

    def __init__(self, limit=100):

        self.history = deque(maxlen=limit)

    def store(self, message):

        self.history.append(message)

    def recall(self):

        return list(self.history)

    def last(self):

        if self.history:
            return self.history[-1]

        return None

    def clear(self):

        self.history.clear()

    def size(self):

        return len(self.history)
