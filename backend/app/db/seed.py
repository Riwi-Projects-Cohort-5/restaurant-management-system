import uuid

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.models.category import Category
from app.db.models.customer import Customer
from app.db.models.inventory_item import InventoryItem
from app.db.models.location import Location
from app.db.models.menu_item import MenuItem
from app.db.models.supplier import Supplier
from app.db.models.table import Table, TableStatus
from app.db.models.user import User, UserRole


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    users = [
        User(
            id=uuid.uuid4(),
            username="admin",
            email="admin@restaurant.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrador",
            role=UserRole.ADMIN,
        ),
        User(
            id=uuid.uuid4(),
            username="waiter1",
            email="waiter1@restaurant.com",
            hashed_password=get_password_hash("waiter123"),
            full_name="Mesero Uno",
            role=UserRole.WAITER,
        ),
        User(
            id=uuid.uuid4(),
            username="chef1",
            email="chef1@restaurant.com",
            hashed_password=get_password_hash("chef123"),
            full_name="Chef Principal",
            role=UserRole.CHEF,
        ),
        User(
            id=uuid.uuid4(),
            username="cashier1",
            email="cashier1@restaurant.com",
            hashed_password=get_password_hash("cashier123"),
            full_name="Cajero Uno",
            role=UserRole.CASHIER,
        ),
    ]
    db.add_all(users)
    db.commit()

    customers = [
        Customer(id="CUST-001", name="Juan Perez", phone="555-0101", email="juan@email.com"),
        Customer(id="CUST-002", name="Maria Lopez", phone="555-0102", email="maria@email.com"),
        Customer(id="CUST-003", name="Carlos Garcia", phone="555-0103", email=None),
    ]
    db.add_all(customers)
    db.commit()

    locations = [
        Location(id=uuid.uuid4(), name="Interior"),
        Location(id=uuid.uuid4(), name="Terraza"),
    ]
    db.add_all(locations)
    db.commit()

    loc_map = {loc.name: loc.id for loc in db.query(Location).all()}

    tables = [
        Table(id=uuid.uuid4(), number=1, capacity=2, status=TableStatus.AVAILABLE, location_id=loc_map["Interior"]),
        Table(id=uuid.uuid4(), number=2, capacity=4, status=TableStatus.AVAILABLE, location_id=loc_map["Interior"]),
        Table(id=uuid.uuid4(), number=3, capacity=6, status=TableStatus.AVAILABLE, location_id=loc_map["Terraza"]),
        Table(id=uuid.uuid4(), number=4, capacity=8, status=TableStatus.AVAILABLE, location_id=loc_map["Terraza"]),
    ]
    db.add_all(tables)
    db.commit()

    categories = [
        Category(id=uuid.uuid4(), name="Entradas", description="Platos de entrada"),
        Category(id=uuid.uuid4(), name="Platos Fuertes", description="Platos principales"),
        Category(id=uuid.uuid4(), name="Bebidas", description="Bebidas y refrescos"),
        Category(id=uuid.uuid4(), name="Postres", description="Postres y dulces"),
    ]
    db.add_all(categories)
    db.commit()

    cat_map = {c.name: c.id for c in db.query(Category).all()}

    menu_items = [
        MenuItem(id=uuid.uuid4(), name="Nachos", description="Nachos con guacamola", price=8.50, category_id=cat_map["Entradas"]),
        MenuItem(id=uuid.uuid4(), name="Ensalada Cesar", description="Ensalada con pollo", price=10.00, category_id=cat_map["Entradas"]),
        MenuItem(id=uuid.uuid4(), name="Ribeye", description="Ribeye 300g con guarnicion", price=25.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Salmon", description="Salmon al horno con vegetales", price=22.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Coca-Cola", description="355ml", price=2.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Agua Natural", description="500ml", price=1.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Tiramisu", description="Tiramisu classico", price=7.00, category_id=cat_map["Postres"]),
    ]
    db.add_all(menu_items)
    db.commit()

    ingredients = [
        InventoryItem(id=uuid.uuid4(), name="Carne de Res", unit="kg", quantity=50, min_stock=10),
        InventoryItem(id=uuid.uuid4(), name="Salmon Fresco", unit="kg", quantity=20, min_stock=5),
        InventoryItem(id=uuid.uuid4(), name="Lechuga", unit="kg", quantity=15, min_stock=5),
        InventoryItem(id=uuid.uuid4(), name="Pan", unit="unidades", quantity=100, min_stock=20),
        InventoryItem(id=uuid.uuid4(), name="Aceite de Oliva", unit="litros", quantity=10, min_stock=3),
    ]
    db.add_all(ingredients)
    db.commit()

    suppliers = [
        Supplier(id=uuid.uuid4(), name="Distribuidora La Vega", phone="555-1001", email="contacto@lavega.com", address="Av. Principal 123"),
        Supplier(id=uuid.uuid4(), name="Pescaderia del Mar", phone="555-1002", email="ventas@pescaderia.com", address="Calle del Mar 45"),
    ]
    db.add_all(suppliers)
    db.commit()

    print("Database seeded successfully.")
