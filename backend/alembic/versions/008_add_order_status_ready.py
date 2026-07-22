"""add ready to orderstatus enum

Revision ID: 008
Revises: 007
Create Date: 2026-07-22
"""

from alembic import op

revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE orderstatus ADD VALUE 'ready'")


def downgrade() -> None:
    op.execute("ALTER TYPE orderstatus RENAME TO orderstatus_old")
    op.execute("CREATE TYPE orderstatus AS ENUM('pending', 'in_progress', 'completed', 'cancelled', 'served')")
    op.execute("ALTER TABLE orders ALTER COLUMN status TYPE orderstatus USING status::text::orderstatus")
    op.execute("DROP TYPE orderstatus_old")
