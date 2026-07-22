import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.models.category import Category
from app.db.models.customer import Customer
from app.db.models.inventory_item import InventoryItem
from app.db.models.inventory_movement import InventoryMovement, MovementType
from app.db.models.location import Location
from app.db.models.menu_item import MenuItem
from app.db.models.order import Order, OrderStatus
from app.db.models.order_item import OrderItem
from app.db.models.payment import Payment, PaymentMethod, PaymentStatus
from app.db.models.kitchen_order import KitchenOrder, KitchenOrderStatus
from app.db.models.recipe import Recipe
from app.db.models.reservation import Reservation, ReservationStatus
from app.db.models.setting import Setting
from app.db.models.purchase import Purchase
from app.db.models.purchase_detail import PurchaseDetail
from app.db.models.supplier import Supplier
from app.db.models.table import Table, TableStatus
from app.db.models.user import User, UserRole


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    now = datetime.now(timezone.utc)

    # ── Users ──
    users = [
        User(id=uuid.uuid4(), username="admin", email="admin@elfogon.com",
             hashed_password=get_password_hash("admin123"), full_name="Carlos Mendoza", role=UserRole.ADMIN),
        User(id=uuid.uuid4(), username="waiter1", email="waiter1@elfogon.com",
             hashed_password=get_password_hash("waiter123"), full_name="Ana Rodriguez", role=UserRole.WAITER),
        User(id=uuid.uuid4(), username="waiter2", email="waiter2@elfogon.com",
             hashed_password=get_password_hash("waiter123"), full_name="Luis Fernandez", role=UserRole.WAITER),
        User(id=uuid.uuid4(), username="waiter3", email="waiter3@elfogon.com",
             hashed_password=get_password_hash("waiter123"), full_name="Sofia Martinez", role=UserRole.WAITER),
        User(id=uuid.uuid4(), username="chef1", email="chef1@elfogon.com",
             hashed_password=get_password_hash("chef123"), full_name="Miguel Torres", role=UserRole.CHEF),
        User(id=uuid.uuid4(), username="chef2", email="chef2@elfogon.com",
             hashed_password=get_password_hash("chef123"), full_name="Diego Ramirez", role=UserRole.CHEF),
        User(id=uuid.uuid4(), username="cashier1", email="cashier1@elfogon.com",
             hashed_password=get_password_hash("cashier123"), full_name="Laura Garcia", role=UserRole.CASHIER),
    ]
    db.add_all(users)
    db.commit()

    user_map = {u.username: u.id for u in db.query(User).all()}
    waiter1_id = user_map["waiter1"]
    waiter2_id = user_map["waiter2"]
    waiter3_id = user_map["waiter3"]

    # ── Customers ──
    customers = [
        Customer(id="CUST-001", name="Juan Perez", phone="555-0101", email="juan@email.com"),
        Customer(id="CUST-002", name="Maria Lopez", phone="555-0102", email="maria@email.com"),
        Customer(id="CUST-003", name="Carlos Garcia", phone="555-0103", email=None),
        Customer(id="CUST-004", name="Ana Martinez", phone="555-0104", email="ana@email.com"),
        Customer(id="CUST-005", name="Roberto Sanchez", phone="555-0105", email="roberto@email.com"),
        Customer(id="CUST-006", name="Carmen Ruiz", phone="555-0106", email="carmen@email.com"),
        Customer(id="CUST-007", name="Pedro Hernandez", phone="555-0107", email=None),
        Customer(id="CUST-008", name="Lucia Torres", phone="555-0108", email="lucia@email.com"),
        Customer(id="CUST-009", name="Fernando Diaz", phone="555-0109", email="fernando@email.com"),
        Customer(id="CUST-010", name="Isabella Morales", phone="555-0110", email="isabella@email.com"),
    ]
    db.add_all(customers)
    db.commit()

    # ── Locations ──
    locations = [
        Location(id=uuid.uuid4(), name="Interior"),
        Location(id=uuid.uuid4(), name="Terraza"),
        Location(id=uuid.uuid4(), name="Barra"),
        Location(id=uuid.uuid4(), name="Privado"),
    ]
    db.add_all(locations)
    db.commit()

    loc_map = {loc.name: loc.id for loc in db.query(Location).all()}

    # ── Tables ──
    tables_data = [
        (1, 2, TableStatus.AVAILABLE, "Interior"),
        (2, 4, TableStatus.OCCUPIED, "Interior"),
        (3, 4, TableStatus.OCCUPIED, "Interior"),
        (4, 6, TableStatus.AVAILABLE, "Interior"),
        (5, 2, TableStatus.RESERVED, "Terraza"),
        (6, 4, TableStatus.OCCUPIED, "Terraza"),
        (7, 6, TableStatus.AVAILABLE, "Terraza"),
        (8, 8, TableStatus.AVAILABLE, "Terraza"),
        (9, 2, TableStatus.AVAILABLE, "Barra"),
        (10, 2, TableStatus.OCCUPIED, "Barra"),
        (11, 4, TableStatus.AVAILABLE, "Barra"),
        (12, 10, TableStatus.AVAILABLE, "Privado"),
        (13, 12, TableStatus.MAINTENANCE, "Privado"),
    ]
    tables = [
        Table(id=uuid.uuid4(), number=n, capacity=c, status=s, location_id=loc_map[loc])
        for n, c, s, loc in tables_data
    ]
    db.add_all(tables)
    db.commit()

    table_map = {t.number: t.id for t in db.query(Table).all()}

    # ── Categories ──
    categories = [
        Category(id=uuid.uuid4(), name="Entradas", description="Aperitivos y entradas"),
        Category(id=uuid.uuid4(), name="Platos Fuertes", description="Platos principales"),
        Category(id=uuid.uuid4(), name="Pescados y Mariscos", description="Del mar a tu mesa"),
        Category(id=uuid.uuid4(), name="Bebidas", description="Bebidas frias y calientes"),
        Category(id=uuid.uuid4(), name="Cocteles", description="Cocteles de autor"),
        Category(id=uuid.uuid4(), name="Postres", description="Dulces tentaciones"),
        Category(id=uuid.uuid4(), name="Especiales del Dia", description="Platos del chef"),
    ]
    db.add_all(categories)
    db.commit()

    cat_map = {c.name: c.id for c in db.query(Category).all()}

    # ── Menu Items ──
    menu_items = [
        # Entradas
        MenuItem(id=uuid.uuid4(), name="Nachos Supreme", description="Nachos con guacamola, crema y queso", price=9.50, category_id=cat_map["Entradas"]),
        MenuItem(id=uuid.uuid4(), name="Empanadas de Carne", description="6 empanadas caseras con salsa", price=8.00, category_id=cat_map["Entradas"]),
        MenuItem(id=uuid.uuid4(), name="Ceviche de Camaron", description="Camaron fresco en leche de tigre", price=12.00, category_id=cat_map["Entradas"]),
        MenuItem(id=uuid.uuid4(), name="Alitas BBQ", description="12 alitas bañadas en BBQ", price=11.00, category_id=cat_map["Entradas"]),
        MenuItem(id=uuid.uuid4(), name="Guacamole Fresco", description="Guacamole preparado al momento", price=8.50, category_id=cat_map["Entradas"]),
        # Platos Fuertes
        MenuItem(id=uuid.uuid4(), name="Ribeye 300g", description="Ribeye a la parrilla con guarnicion", price=28.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Pollo al Mojo", description="Pollo entero con salsa mojo y arroz", price=18.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Churrasco", description="Churrasco 400g con papas y ensalada", price=32.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Pasta Carbonara", description="Espagueti carbonara con panceta", price=16.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Tacos al Pastor", description="6 tacos al pastor con piña y cilantro", price=14.00, category_id=cat_map["Platos Fuertes"]),
        MenuItem(id=uuid.uuid4(), name="Burger Clasica", description="Hamburguesa 200g con papas fritas", price=15.00, category_id=cat_map["Platos Fuertes"]),
        # Pescados y Mariscos
        MenuItem(id=uuid.uuid4(), name="Salmon al Horno", description="Salmon con vegetales y limon", price=24.00, category_id=cat_map["Pescados y Mariscos"]),
        MenuItem(id=uuid.uuid4(), name="Pescado Frito Entero", description="Pescado frito con ensalada y yuca", price=22.00, category_id=cat_map["Pescados y Mariscos"]),
        MenuItem(id=uuid.uuid4(), name="Camarones al Ajillo", description="Camarones salteados con ajo y mantequilla", price=26.00, category_id=cat_map["Pescados y Mariscos"]),
        MenuItem(id=uuid.uuid4(), name="Arroz con Mariscos", description="Arroz marinero con mariscos mixtos", price=28.00, category_id=cat_map["Pescados y Mariscos"]),
        # Bebidas
        MenuItem(id=uuid.uuid4(), name="Coca-Cola 355ml", description="Refresco de cola", price=2.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Agua Natural 500ml", description="Agua pura", price=1.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Limonada Natural", description="Limonada fresca preparada", price=3.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Jugo de Naranja", description="Jugo natural de naranja", price=4.00, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Cerveza Corona", description="Cerveza importada 355ml", price=4.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Cerveza Local", description="Cerveza artesanal local", price=5.00, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Cafe Americano", description="Cafe negro", price=2.50, category_id=cat_map["Bebidas"]),
        MenuItem(id=uuid.uuid4(), name="Cafe con Leche", description="Cafe con leche caliente", price=3.00, category_id=cat_map["Bebidas"]),
        # Cocteles
        MenuItem(id=uuid.uuid4(), name="Mojito Clasico", description="Ron, menta, lima y azucar", price=9.00, category_id=cat_map["Cocteles"]),
        MenuItem(id=uuid.uuid4(), name="Margarita", description="Tequila, triple sec y lima", price=10.00, category_id=cat_map["Cocteles"]),
        MenuItem(id=uuid.uuid4(), name="Pina Colada", description="Ron, crema de coco y pina", price=11.00, category_id=cat_map["Cocteles"]),
        MenuItem(id=uuid.uuid4(), name="Sangria", description="Vino tinto con frutas", price=8.00, category_id=cat_map["Cocteles"]),
        # Postres
        MenuItem(id=uuid.uuid4(), name="Tiramisu", description="Tiramisu classico italiano", price=8.00, category_id=cat_map["Postres"]),
        MenuItem(id=uuid.uuid4(), name="Flan de Coco", description="Flan casero con coco rallado", price=6.00, category_id=cat_map["Postres"]),
        MenuItem(id=uuid.uuid4(), name="Brownie con Helado", description="Brownie tibio con helado de vainilla", price=7.50, category_id=cat_map["Postres"]),
        MenuItem(id=uuid.uuid4(), name="Tres Leches", description="Pastel tres leches con nata", price=7.00, category_id=cat_map["Postres"]),
        # Especiales del Dia
        MenuItem(id=uuid.uuid4(), name="Paella del Dia", description="Paella mixta del chef (2 porciones)", price=35.00, category_id=cat_map["Especiales del Dia"]),
        MenuItem(id=uuid.uuid4(), name="Parrillada Familiar", description="Parrillada para 4 personas con guarniciones", price=65.00, category_id=cat_map["Especiales del Dia"]),
    ]
    db.add_all(menu_items)
    db.commit()

    mi_map = {mi.name: mi.id for mi in db.query(MenuItem).all()}

    # ── Suppliers ──
    suppliers = [
        Supplier(id=uuid.uuid4(), name="Distribuidora La Vega", phone="555-1001", email="contacto@lavega.com", address="Av. Principal 123"),
        Supplier(id=uuid.uuid4(), name="Pescaderia del Mar", phone="555-1002", email="ventas@pescaderia.com", address="Calle del Mar 45"),
        Supplier(id=uuid.uuid4(), name="Carniceria San Jose", phone="555-1003", email="info@sanjose.com", address="Blvd. Los Arboles 78"),
        Supplier(id=uuid.uuid4(), name="Bodega Central", phone="555-1004", email="ventas@bodegacentral.com", address="Zona Industrial 90"),
        Supplier(id=uuid.uuid4(), name="Lacteos del Valle", phone="555-1005", email="pedidos@lacteosvalle.com", address="Carretera Norte Km 5"),
    ]
    db.add_all(suppliers)
    db.commit()

    sup_map = {s.name: s.id for s in db.query(Supplier).all()}

    # ── Inventory Items ──
    inventory_items = [
        InventoryItem(id=uuid.uuid4(), name="Carne de Res", unit="kg", quantity=80, min_stock=20),
        InventoryItem(id=uuid.uuid4(), name="Pollo Entero", unit="kg", quantity=60, min_stock=15),
        InventoryItem(id=uuid.uuid4(), name="Salmon Fresco", unit="kg", quantity=25, min_stock=8),
        InventoryItem(id=uuid.uuid4(), name="Camarones", unit="kg", quantity=15, min_stock=5),
        InventoryItem(id=uuid.uuid4(), name="Lechuga", unit="kg", quantity=20, min_stock=8),
        InventoryItem(id=uuid.uuid4(), name="Tomate", unit="kg", quantity=30, min_stock=10),
        InventoryItem(id=uuid.uuid4(), name="Cebolla", unit="kg", quantity=25, min_stock=8),
        InventoryItem(id=uuid.uuid4(), name="Ajo", unit="kg", quantity=5, min_stock=2),
        InventoryItem(id=uuid.uuid4(), name="Pan de Hamburguesa", unit="unidades", quantity=50, min_stock=20),
        InventoryItem(id=uuid.uuid4(), name="Tortillas de Maiz", unit="unidades", quantity=200, min_stock=50),
        InventoryItem(id=uuid.uuid4(), name="Arroz", unit="kg", quantity=40, min_stock=15),
        InventoryItem(id=uuid.uuid4(), name="Frijoles Negros", unit="kg", quantity=30, min_stock=10),
        InventoryItem(id=uuid.uuid4(), name="Aceite de Oliva", unit="litros", quantity=15, min_stock=5),
        InventoryItem(id=uuid.uuid4(), name="Mantequilla", unit="kg", quantity=10, min_stock=3),
        InventoryItem(id=uuid.uuid4(), name="Queso Mozzarella", unit="kg", quantity=12, min_stock=4),
        InventoryItem(id=uuid.uuid4(), name="Nata para Crema", unit="litros", quantity=8, min_stock=3),
        InventoryItem(id=uuid.uuid4(), name="Ron Blanco", unit="botellas", quantity=10, min_stock=3),
        InventoryItem(id=uuid.uuid4(), name="Tequila", unit="botellas", quantity=8, min_stock=3),
        InventoryItem(id=uuid.uuid4(), name="Vino Tinto", unit="botellas", quantity=12, min_stock=4),
        InventoryItem(id=uuid.uuid4(), name="Cerveza Corona", unit="unidades", quantity=120, min_stock=40),
        InventoryItem(id=uuid.uuid4(), name="Coca-Cola", unit="unidades", quantity=80, min_stock=30),
        InventoryItem(id=uuid.uuid4(), name="Cafe Molido", unit="kg", quantity=8, min_stock=3),
        InventoryItem(id=uuid.uuid4(), name="Harina de Trigo", unit="kg", quantity=25, min_stock=10),
        InventoryItem(id=uuid.uuid4(), name="Azucar", unit="kg", quantity=20, min_stock=8),
    ]
    db.add_all(inventory_items)
    db.commit()

    inv_map = {ii.name: ii.id for ii in db.query(InventoryItem).all()}

    # ── Recipes ──
    recipes = [
        Recipe(id=uuid.uuid4(), product_id=mi_map["Ribeye 300g"], ingredient_id=inv_map["Carne de Res"], required_quantity=0.35),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Ribeye 300g"], ingredient_id=inv_map["Mantequilla"], required_quantity=0.03),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Churrasco"], ingredient_id=inv_map["Carne de Res"], required_quantity=0.45),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Pollo al Mojo"], ingredient_id=inv_map["Pollo Entero"], required_quantity=1.2),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Salmon al Horno"], ingredient_id=inv_map["Salmon Fresco"], required_quantity=0.25),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Camarones al Ajillo"], ingredient_id=inv_map["Camarones"], required_quantity=0.3),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Camarones al Ajillo"], ingredient_id=inv_map["Ajo"], required_quantity=0.05),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Tacos al Pastor"], ingredient_id=inv_map["Carne de Res"], required_quantity=0.2),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Tacos al Pastor"], ingredient_id=inv_map["Tortillas de Maiz"], required_quantity=3),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Burger Clasica"], ingredient_id=inv_map["Carne de Res"], required_quantity=0.2),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Burger Clasica"], ingredient_id=inv_map["Pan de Hamburguesa"], required_quantity=1),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Pasta Carbonara"], ingredient_id=inv_map["Nata para Crema"], required_quantity=0.1),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Arroz con Mariscos"], ingredient_id=inv_map["Arroz"], required_quantity=0.3),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Arroz con Mariscos"], ingredient_id=inv_map["Camarones"], required_quantity=0.2),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Mojito Clasico"], ingredient_id=inv_map["Ron Blanco"], required_quantity=0.06),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Margarita"], ingredient_id=inv_map["Tequila"], required_quantity=0.05),
        Recipe(id=uuid.uuid4(), product_id=mi_map["Sangria"], ingredient_id=inv_map["Vino Tinto"], required_quantity=0.2),
    ]
    db.add_all(recipes)
    db.commit()

    # ── Reservations ──
    reservations = [
        Reservation(id="RF-20260722-0001", customer_id="CUST-001", table_id=table_map[5],
                    guest_name="Juan Perez", guest_phone="555-0101",
                    reservation_date=now + timedelta(hours=2), guest_count=2,
                    status=ReservationStatus.CONFIRMED, notes="Mesa junto a la ventana"),
        Reservation(id="RF-20260722-0002", customer_id="CUST-002", table_id=table_map[8],
                    guest_name="Maria Lopez", guest_phone="555-0102",
                    reservation_date=now + timedelta(hours=4), guest_count=6,
                    status=ReservationStatus.PENDING, notes="Celebracion de cumpleanos"),
        Reservation(id="RF-20260722-0003", customer_id="CUST-004", table_id=None,
                    guest_name="Ana Martinez", guest_phone="555-0104",
                    reservation_date=now + timedelta(days=1), guest_count=4,
                    status=ReservationStatus.CONFIRMED, notes="Mesa en terraza preferible"),
        Reservation(id="RF-20260722-0004", customer_id="CUST-005", table_id=None,
                    guest_name="Roberto Sanchez", guest_phone="555-0105",
                    reservation_date=now + timedelta(days=1, hours=2), guest_count=8,
                    status=ReservationStatus.PENDING, notes="Reunion de negocios"),
        Reservation(id="RF-20260722-0005", customer_id="CUST-003", table_id=table_map[6],
                    guest_name="Carlos Garcia", guest_phone="555-0103",
                    reservation_date=now - timedelta(hours=3), guest_count=4,
                    status=ReservationStatus.COMPLETED, notes=""),
        Reservation(id="RF-20260722-0006", customer_id="CUST-006", table_id=None,
                    guest_name="Carmen Ruiz", guest_phone="555-0106",
                    reservation_date=now - timedelta(days=1), guest_count=2,
                    status=ReservationStatus.CANCELLED, notes="Cancelada por el cliente"),
    ]
    db.add_all(reservations)
    db.commit()

    # ── Orders ──
    res_map = {r.id: r for r in db.query(Reservation).all()}
    orders_data = [
        # Order 1 - Mesa 2, pending items
        (waiter1_id, 2, OrderStatus.IN_PROGRESS, 22.50, None),
        # Order 2 - Mesa 3, ready
        (waiter2_id, 3, OrderStatus.READY, 47.00, None),
        # Order 3 - Mesa 6, served (linked to completed reservation)
        (waiter1_id, 6, OrderStatus.SERVED, 65.50, "RF-20260722-0005"),
        # Order 4 - Mesa 10, completed with payment
        (waiter3_id, 10, OrderStatus.COMPLETED, 38.00, None),
        # Order 5 - Mesa 3, second order pending
        (waiter2_id, 3, OrderStatus.PENDING, 14.00, None),
    ]
    orders = []
    for waiter_id, tbl_num, status, total, reservation_id in orders_data:
        o = Order(
            id=uuid.uuid4(), waiter_id=waiter_id, table_id=table_map[tbl_num],
            reservation_id=reservation_id,
            status=status, total=total,
            created_at=now - timedelta(hours=3),
            updated_at=now - timedelta(hours=1),
        )
        orders.append(o)
    db.add_all(orders)
    db.commit()

    order_ids = [o.id for o in db.query(Order).all()]

    # ── Order Items ──
    order_items = [
        # Order 1 - 2 items
        OrderItem(id=uuid.uuid4(), order_id=order_ids[0], menu_item_id=mi_map["Nachos Supreme"],
                  quantity=1, unit_price=9.50, subtotal=9.50),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[0], menu_item_id=mi_map["Coca-Cola 355ml"],
                  quantity=2, unit_price=2.50, subtotal=5.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[0], menu_item_id=mi_map["Cerveza Corona"],
                  quantity=2, unit_price=4.50, subtotal=9.00),
        # Order 2 - 3 items
        OrderItem(id=uuid.uuid4(), order_id=order_ids[1], menu_item_id=mi_map["Ribeye 300g"],
                  quantity=1, unit_price=28.00, subtotal=28.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[1], menu_item_id=mi_map["Cerveza Local"],
                  quantity=2, unit_price=5.00, subtotal=10.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[1], menu_item_id=mi_map["Tiramisu"],
                  quantity=1, unit_price=8.00, subtotal=8.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[1], menu_item_id=mi_map["Limonada Natural"],
                  quantity=1, unit_price=3.50, subtotal=3.50),
        # Order 3 - 4 items
        OrderItem(id=uuid.uuid4(), order_id=order_ids[2], menu_item_id=mi_map["Salmon al Horno"],
                  quantity=1, unit_price=24.00, subtotal=24.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[2], menu_item_id=mi_map["Camarones al Ajillo"],
                  quantity=1, unit_price=26.00, subtotal=26.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[2], menu_item_id=mi_map["Mojito Clasico"],
                  quantity=2, unit_price=9.00, subtotal=18.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[2], menu_item_id=mi_map["Flan de Coco"],
                  quantity=1, unit_price=6.00, subtotal=6.00),
        # Order 4 - 2 items
        OrderItem(id=uuid.uuid4(), order_id=order_ids[3], menu_item_id=mi_map["Tacos al Pastor"],
                  quantity=2, unit_price=14.00, subtotal=28.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[3], menu_item_id=mi_map["Agua Natural 500ml"],
                  quantity=2, unit_price=1.50, subtotal=3.00),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[3], menu_item_id=mi_map["Brownie con Helado"],
                  quantity=1, unit_price=7.50, subtotal=7.50),
        # Order 5 - 1 item
        OrderItem(id=uuid.uuid4(), order_id=order_ids[4], menu_item_id=mi_map["Guacamole Fresco"],
                  quantity=1, unit_price=8.50, subtotal=8.50),
        OrderItem(id=uuid.uuid4(), order_id=order_ids[4], menu_item_id=mi_map["Cerveza Corona"],
                  quantity=1, unit_price=4.50, subtotal=4.50),
    ]
    db.add_all(order_items)
    db.commit()

    # ── Kitchen Orders ──
    kitchen_orders = [
        # Order 1 items - mixed statuses
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[0], menu_item_name="Nachos Supreme",
                     quantity=1, status=KitchenOrderStatus.READY, priority=0,
                     created_at=now - timedelta(hours=2)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[0], menu_item_name="Coca-Cola 355ml",
                     quantity=2, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=2)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[0], menu_item_name="Cerveza Corona",
                     quantity=2, status=KitchenOrderStatus.PENDING, priority=1,
                     created_at=now - timedelta(hours=1)),
        # Order 2 items - ready
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[1], menu_item_name="Ribeye 300g",
                     quantity=1, status=KitchenOrderStatus.READY, priority=2,
                     notes="Término medio", created_at=now - timedelta(hours=2)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[1], menu_item_name="Cerveza Local",
                     quantity=2, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=2)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[1], menu_item_name="Tiramisu",
                     quantity=1, status=KitchenOrderStatus.PENDING, priority=0,
                     created_at=now - timedelta(hours=1)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[1], menu_item_name="Limonada Natural",
                     quantity=1, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=2)),
        # Order 3 items - all delivered
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[2], menu_item_name="Salmon al Horno",
                     quantity=1, status=KitchenOrderStatus.DELIVERED, priority=1,
                     created_at=now - timedelta(hours=3)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[2], menu_item_name="Camarones al Ajillo",
                     quantity=1, status=KitchenOrderStatus.DELIVERED, priority=1,
                     created_at=now - timedelta(hours=3)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[2], menu_item_name="Mojito Clasico",
                     quantity=2, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=3)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[2], menu_item_name="Flan de Coco",
                     quantity=1, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=3)),
        # Order 4 items - all delivered (completed order)
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[3], menu_item_name="Tacos al Pastor",
                     quantity=2, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=3)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[3], menu_item_name="Agua Natural 500ml",
                     quantity=2, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=3)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[3], menu_item_name="Brownie con Helado",
                     quantity=1, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(hours=3)),
        # Order 5 items - just started
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[4], menu_item_name="Guacamole Fresco",
                     quantity=1, status=KitchenOrderStatus.PREPARING, priority=0,
                     created_at=now - timedelta(minutes=30)),
        KitchenOrder(id=uuid.uuid4(), order_id=order_ids[4], menu_item_name="Cerveza Corona",
                     quantity=1, status=KitchenOrderStatus.DELIVERED, priority=0,
                     created_at=now - timedelta(minutes=30)),
    ]
    db.add_all(kitchen_orders)
    db.commit()

    # ── Payments ──
    payments = [
        Payment(id=uuid.uuid4(), order_id=order_ids[3], amount=38.00,
                method=PaymentMethod.CARD, status=PaymentStatus.COMPLETED,
                created_at=now - timedelta(hours=1)),
    ]
    db.add_all(payments)
    db.commit()

    # ── Inventory Movements ──
    movements = [
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Carne de Res"],
                          type=MovementType.IN, quantity=50,
                          reason="Compra semanal - Distribuidora La Vega",
                          created_at=now - timedelta(days=3)),
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Carne de Res"],
                          type=MovementType.OUT, quantity=5,
                          reason="Uso del dia - parrilla",
                          created_at=now - timedelta(days=1)),
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Salmon Fresco"],
                          type=MovementType.IN, quantity=10,
                          reason="Pedido - Pescaderia del Mar",
                          created_at=now - timedelta(days=2)),
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Salmon Fresco"],
                          type=MovementType.OUT, quantity=2,
                          reason="Cenas del sabado",
                          created_at=now - timedelta(days=1)),
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Cerveza Corona"],
                          type=MovementType.IN, quantity=60,
                          reason="Reposicion - Bodega Central",
                          created_at=now - timedelta(days=1)),
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Cerveza Corona"],
                          type=MovementType.OUT, quantity=12,
                          reason="Consumo del fin de semana",
                          created_at=now - timedelta(hours=12)),
        InventoryMovement(id=uuid.uuid4(), item_id=inv_map["Coca-Cola"],
                          type=MovementType.OUT, quantity=15,
                          reason="Consumo del dia",
                          created_at=now - timedelta(hours=6)),
    ]
    db.add_all(movements)
    db.commit()

    # ── Purchases ──
    purchase1 = Purchase(
        id=uuid.uuid4(), supplier_id=sup_map["Distribuidora La Vega"],
        status="completed", total=450.00,
        notes="Compra semanal de verduras",
        created_at=now - timedelta(days=3),
    )
    db.add(purchase1)
    db.flush()

    purchase2 = Purchase(
        id=uuid.uuid4(), supplier_id=sup_map["Pescaderia del Mar"],
        status="completed", total=320.00,
        notes="Pedido de pescados frescos",
        created_at=now - timedelta(days=2),
    )
    db.add(purchase2)
    db.flush()

    purchase_details = [
        PurchaseDetail(id=uuid.uuid4(), purchase_id=purchase1.id,
                       ingredient_id=inv_map["Lechuga"], quantity=10, unit_cost=2.50, subtotal=25.00),
        PurchaseDetail(id=uuid.uuid4(), purchase_id=purchase1.id,
                       ingredient_id=inv_map["Tomate"], quantity=15, unit_cost=3.00, subtotal=45.00),
        PurchaseDetail(id=uuid.uuid4(), purchase_id=purchase1.id,
                       ingredient_id=inv_map["Cebolla"], quantity=10, unit_cost=2.00, subtotal=20.00),
        PurchaseDetail(id=uuid.uuid4(), purchase_id=purchase1.id,
                       ingredient_id=inv_map["Ajo"], quantity=3, unit_cost=8.00, subtotal=24.00),
        PurchaseDetail(id=uuid.uuid4(), purchase_id=purchase2.id,
                       ingredient_id=inv_map["Salmon Fresco"], quantity=8, unit_cost=28.00, subtotal=224.00),
        PurchaseDetail(id=uuid.uuid4(), purchase_id=purchase2.id,
                       ingredient_id=inv_map["Camarones"], quantity=5, unit_cost=22.00, subtotal=110.00),
    ]
    db.add_all(purchase_details)
    db.commit()

    # ── Settings ──
    setting = Setting(
        id=str(uuid.uuid4()),
        restaurant_name="El Fogon Caribeno",
        address="Av. Costera 456, Playa del Carmen",
        phone="+52 984 123 4567",
        email="info@elfogon.com",
        tax_rate=11.5,
        currency="USD",
    )
    db.add(setting)
    db.commit()

    print("Database seeded successfully.")
