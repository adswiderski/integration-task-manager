import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db.database import SessionLocal
from db.models.user import User


db = SessionLocal()

user = User(email="test@example.com", hashed_password="test123")
db.add(user)
db.commit()

users = db.query(User).all()
print(users[0].email)
db.close()