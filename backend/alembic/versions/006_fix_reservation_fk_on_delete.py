"""fix reservation fk on delete set null

Revision ID: 006
Revises: 005
Create Date: 2026-07-20
"""
from alembic import op
import sqlalchemy as sa

revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("orders_reservation_id_fkey", "orders", type_="foreignkey")
    op.create_foreign_key(
        "orders_reservation_id_fkey",
        "orders",
        "reservations",
        ["reservation_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("orders_reservation_id_fkey", "orders", type_="foreignkey")
    op.create_foreign_key(
        "orders_reservation_id_fkey",
        "orders",
        "reservations",
        ["reservation_id"],
        ["id"],
    )
