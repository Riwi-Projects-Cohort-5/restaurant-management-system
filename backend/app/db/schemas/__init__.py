from app.db.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from app.db.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemOut,
    InventoryItemUpdate,
    InventoryMovementCreate,
    InventoryMovementOut,
)
from app.db.schemas.kitchen import KitchenOrderOut, KitchenOrderUpdate
from app.db.schemas.location import LocationCreate, LocationOut, LocationUpdate
from app.db.schemas.menu_item import MenuItemCreate, MenuItemOut, MenuItemUpdate
from app.db.schemas.order import (
    OrderCreate,
    OrderItemCreate,
    OrderItemOut,
    OrderOut,
    OrderUpdate,
)
from app.db.schemas.payment import PaymentCreate, PaymentOut
from app.db.schemas.purchase import (
    PurchaseCreate,
    PurchaseDetailCreate,
    PurchaseDetailOut,
    PurchaseOut,
    PurchaseUpdate,
)
from app.db.schemas.recipe import RecipeCreate, RecipeOut
from app.db.schemas.report import ReportSales, ReportTopProducts
from app.db.schemas.reservation import ReservationCreate, ReservationOut, ReservationUpdate
from app.db.schemas.supplier import SupplierCreate, SupplierOut, SupplierUpdate
from app.db.schemas.table import TableCreate, TableOut, TableUpdate
from app.db.schemas.user import TokenOut, UserCreate, UserLogin, UserOut, UserUpdate

__all__ = [
    "CategoryCreate",
    "CategoryOut",
    "CategoryUpdate",
    "InventoryItemCreate",
    "InventoryItemOut",
    "InventoryItemUpdate",
    "InventoryMovementCreate",
    "InventoryMovementOut",
    "KitchenOrderOut",
    "KitchenOrderUpdate",
    "LocationCreate",
    "LocationOut",
    "LocationUpdate",
    "MenuItemCreate",
    "MenuItemOut",
    "MenuItemUpdate",
    "OrderCreate",
    "OrderItemCreate",
    "OrderItemOut",
    "OrderOut",
    "OrderUpdate",
    "PaymentCreate",
    "PaymentOut",
    "PurchaseCreate",
    "PurchaseDetailCreate",
    "PurchaseDetailOut",
    "PurchaseOut",
    "PurchaseUpdate",
    "RecipeCreate",
    "RecipeOut",
    "ReportSales",
    "ReportTopProducts",
    "ReservationCreate",
    "ReservationOut",
    "ReservationUpdate",
    "SupplierCreate",
    "SupplierOut",
    "SupplierUpdate",
    "TableCreate",
    "TableOut",
    "TableUpdate",
    "TokenOut",
    "UserCreate",
    "UserLogin",
    "UserOut",
    "UserUpdate",
]
