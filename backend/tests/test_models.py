from app.db.models import (
    User, Customer, Table, Reservation, Category,
    MenuItem, Order, OrderItem, KitchenOrder, Payment,
    InventoryItem, InventoryMovement, Recipe,
    Supplier, Purchase, PurchaseDetail,
)


def test_all_models_import() -> None:
    models = [
        User, Customer, Table, Reservation, Category,
        MenuItem, Order, OrderItem, KitchenOrder, Payment,
        InventoryItem, InventoryMovement, Recipe,
        Supplier, Purchase, PurchaseDetail,
    ]
    assert len(models) == 16


def test_model_tablenames() -> None:
    assert User.__tablename__ == "users"
    assert Customer.__tablename__ == "customers"
    assert Table.__tablename__ == "tables"
    assert Reservation.__tablename__ == "reservations"
    assert Category.__tablename__ == "categories"
    assert MenuItem.__tablename__ == "menu_items"
    assert Order.__tablename__ == "orders"
    assert OrderItem.__tablename__ == "order_items"
    assert KitchenOrder.__tablename__ == "kitchen_orders"
    assert Payment.__tablename__ == "payments"
    assert InventoryItem.__tablename__ == "inventory_items"
    assert InventoryMovement.__tablename__ == "inventory_movements"
    assert Recipe.__tablename__ == "recipes"
    assert Supplier.__tablename__ == "suppliers"
    assert Purchase.__tablename__ == "purchases"
    assert PurchaseDetail.__tablename__ == "purchase_details"
