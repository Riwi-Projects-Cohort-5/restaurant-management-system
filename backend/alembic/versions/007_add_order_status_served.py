"""add served to orderstatus enum

Revision ID: 007
Revises: 006
Create Date: 2026-07-21
"""

from alembic import op

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE orderstatus ADD VALUE 'served'")


def downgrade() -> None:
    op.execute("ALTER TYPE orderstatus RENAME TO orderstatus_old")
    op.execute("CREATE TYPE orderstatus AS ENUM('pending', 'in_progress', 'completed', 'cancelled')")
    op.execute("ALTER TABLE orders ALTER COLUMN status TYPE orderstatus USING status::text::orderstatus")
    op.execute("DROP TYPE orderstatus_old")
