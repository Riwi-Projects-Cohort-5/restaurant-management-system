from decimal import Decimal
from uuid import uuid4

from app.db.models.category import Category
from app.db.models.menu_item import MenuItem
from app.db.models.order import Order, OrderStatus
from app.db.models.table import Table
from app.db.models.user import User, UserRole
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService
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


class TestPaymentCompletesOrder:
    def test_payment_transitions_served_to_completed(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)
        cat = _make_category(db_session)

        table = Table(number=80, capacity=4)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        menu_item = _make_menu_item(db_session, "Test Pasta", 15.00, cat)

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
        total = Decimal(str(response.json()["total"]))

        svc = OrderService(db_session)
        svc.update_status(order_id, "served")

        order = svc.get_by_id(order_id)
        assert order is not None
        assert order.status == OrderStatus.SERVED

        pay_svc = PaymentService(db_session)
        payment = pay_svc.create(order_id=order_id, amount=total, method="cash")
        assert payment is not None

        order = svc.get_by_id(order_id)
        assert order.status == OrderStatus.COMPLETED

    def test_payment_rejects_non_served_order(self, db_session):
        user = _create_test_user(db_session)
        headers = _auth_header(user.id)
        cat = _make_category(db_session)

        table = Table(number=81, capacity=4)
        db_session.add(table)
        db_session.commit()
        db_session.refresh(table)

        menu_item = _make_menu_item(db_session, "Test Salad", 8.00, cat)

        response = client.post(
            "/api/v1/orders/",
            json={"table_id": str(table.id)},
            headers=headers,
        )
        assert response.status_code == 201
        order_id = response.json()["id"]

        response = client.post(
            f"/api/v1/orders/{order_id}/items",
            json={"menu_item_id": str(menu_item.id), "quantity": 1},
            headers=headers,
        )
        assert response.status_code == 200

        svc = OrderService(db_session)
        svc.update_status(order_id, "ready")

        pay_svc = PaymentService(db_session)
        import pytest
        with pytest.raises(ValueError, match="debe estar 'served'"):
            pay_svc.create(
                order_id=order_id,
                amount=Decimal("8.00"),
                method="card",
            )
