"""add reservation_id to orders

Revision ID: 005
Revises: 004
Create Date: 2026-07-20
"""
import sqlalchemy as sa

from alembic import op

revision = "005"
down_revision = "004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("reservation_id", sa.String(30), sa.ForeignKey("reservations.id"), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "reservation_id")
