#!/usr/bin/env python3
"""
Seed script — run from Render Shell or locally.

Usage (Render Shell):
  python3 scripts/seed.py          # seed only (skips if data exists)
  python3 scripts/seed.py --reset  # drop all tables, recreate, and seed

Usage (local with Docker):
  docker exec restaurant-api python3 scripts/seed.py
  docker exec restaurant-api python3 scripts/seed.py --reset
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.db.database import engine, SessionLocal, Base
from app.db.seed import seed_database

# Import all models so Base.metadata knows about them
from app.db.models import (  # noqa: F401
    user, table, order, reservation, payment,
    kitchen_order, inventory_item, inventory_movement,
    category, recipe, order_item, supplier, customer,
    location, setting, menu_item, purchase, purchase_detail,
)


def seed():
    print("Seeding database...")
    db = SessionLocal()
    try:
        seed_database(db)
        print("Done.")
    finally:
        db.close()


def reset():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    seed()


if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset()
    else:
        seed()
