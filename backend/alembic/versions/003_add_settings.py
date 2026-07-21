"""add settings table

Revision ID: 003_add_settings
Revises: 002_normalize_location
Create Date: 2026-07-20 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "003_add_settings"
down_revision: Union[str, None] = "002_normalize_location"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "settings",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column("restaurant_name", sa.String(200), server_default="El Fogon Caribeno"),
        sa.Column("address", sa.Text, server_default=""),
        sa.Column("phone", sa.String(50), server_default=""),
        sa.Column("email", sa.String(200), server_default=""),
        sa.Column("tax_rate", sa.Float, server_default="11.5"),
        sa.Column("currency", sa.String(10), server_default="USD"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("settings")
