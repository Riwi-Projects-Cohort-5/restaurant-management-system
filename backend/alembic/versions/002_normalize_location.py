"""normalize location

Revision ID: 002_normalize_location
Revises: 001_initial
Create Date: 2025-07-17 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "002_normalize_location"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "locations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    connection = op.get_bind()
    result = connection.execute(sa.text("SELECT DISTINCT location FROM tables WHERE location IS NOT NULL"))
    location_names = [row[0] for row in result]

    location_id_map = {}
    for name in location_names:
        row = connection.execute(
            sa.text("INSERT INTO locations (name) VALUES (:name) RETURNING id"),
            {"name": name},
        ).fetchone()
        location_id_map[name] = row[0]

    op.add_column("tables", sa.Column("location_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key("fk_tables_location_id", "tables", "locations", ["location_id"], ["id"], ondelete="SET NULL")
    op.create_index("ix_tables_location_id", "tables", ["location_id"])

    for name, loc_id in location_id_map.items():
        connection.execute(
            sa.text("UPDATE tables SET location_id = :loc_id WHERE location = :name"),
            {"loc_id": loc_id, "name": name},
        )

    op.drop_column("tables", "location")


def downgrade() -> None:
    op.add_column("tables", sa.Column("location", sa.String(100), nullable=True))

    connection = op.get_bind()
    result = connection.execute(
        sa.text("SELECT t.id, l.name FROM tables t JOIN locations l ON t.location_id = l.id")
    )
    for table_id, location_name in result:
        connection.execute(
            sa.text("UPDATE tables SET location = :name WHERE id = :table_id"),
            {"name": location_name, "table_id": table_id},
        )

    op.drop_index("ix_tables_location_id", "tables")
    op.drop_constraint("fk_tables_location_id", "tables", type_="foreignkey")
    op.drop_column("tables", "location_id")
    op.drop_table("locations")
