import uuid

from sqlalchemy import Column, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("menu_items.id"), nullable=False)
    ingredient_id = Column(UUID(as_uuid=True), ForeignKey("inventory_items.id"), nullable=False)
    required_quantity = Column(Numeric(10, 2), nullable=False)

    product = relationship("MenuItem", back_populates="recipes")
    ingredient = relationship("InventoryItem", back_populates="recipes")
