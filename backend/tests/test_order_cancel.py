from uuid import uuid4

from app.db.models.category import Category
from app.db.models.menu_item import MenuItem
from app.db.models.order import Order, OrderStatus
from app.db.models.table import Table
from app.db.models.user import User, UserRole
from app.services.kitchen_service import KitchenService
from app.services.order_service import OrderService
from tests.conftest import _auth_header, _create_test_user, client


def _make_category(db_session):
    cat = Category(name="Test Category")
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)
    return cat


def _make_menu_item(db_session, name, price, category):
    item = MenuItem(name=name, price=price, category_id=category.id)
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


class TestOrderCancel:
    def test_cancel_order_removes_kitchen_orders(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)
        cat = _make_category(db_session)

        table = Table(number=99, capacity=4)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        menu_item = _make_menu_item(db_session, "Test Pizza", 12.50, cat)

        response = client.post(
            "/api/v1/orders/",
            json={"table_id": str(table.id)},
            headers=headers,
        )
        assert response.status_code == 201
        order_id = response.json()["id"]

        response = client.post(
            f"/api/v1/orders/{order_id}/items",
            json={"menu_item_id": str(menu_item.id), "quantity": 2},
            headers=headers,
        )
        assert response.status_code == 200

        kitchen_svc = KitchenService(db_session)
        kitchen_orders = kitchen_svc.get_by_order(order_id)
        assert len(kitchen_orders) > 0

        response = client.put(
            f"/api/v1/orders/{order_id}/status",
            json={"status": "cancelled"},
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["status"] == "cancelled"

        kitchen_after = kitchen_svc.get_by_order(order_id)
        assert len(kitchen_after) == 0

    def test_cancel_order_removes_kitchen_orders_via_service(self, db_session):
        cat = _make_category(db_session)
        user = User(
            id=uuid4(), username="testchef", email="chef@test.com",
            hashed_password="x", full_name="Chef", role=UserRole.CHEF,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        table = Table(number=98, capacity=4)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        _make_menu_item(db_session, "Test Burger", 9.50, cat)

        order = Order(waiter_id=user.id, table_id=table.id)
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        kitchen_svc = KitchenService(db_session)
        kitchen_svc.create(order_id=order.id, menu_item_name="Test Burger", quantity=1)
        ko = kitchen_svc.get_by_order(order.id)
        assert len(ko) == 1

        svc = OrderService(db_session)
        updated = svc.update_status(order.id, "cancelled")
        assert updated is not None
        assert updated.status == OrderStatus.CANCELLED

        ko_after = kitchen_svc.get_by_order(order.id)
        assert len(ko_after) == 0
