"""add guest_name, guest_phone to reservations; make customer_id nullable

Revision ID: 004
Revises: 003_add_settings
Create Date: 2026-07-20
"""
from alembic import op
import sqlalchemy as sa

revision = "004"
down_revision = "003_add_settings"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("reservations", sa.Column("guest_name", sa.String(100), nullable=True))
    op.add_column("reservations", sa.Column("guest_phone", sa.String(20), nullable=True))
    op.alter_column("reservations", "customer_id", nullable=True)


def downgrade() -> None:
    op.alter_column("reservations", "customer_id", nullable=False)
    op.drop_column("reservations", "guest_phone")
    op.drop_column("reservations", "guest_name")
