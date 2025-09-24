"""
Item service for database operations
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Item
from app.schemas.item import ItemCreate, ItemUpdate


def get_item_by_id(db: Session, item_id: int) -> Optional[Item]:
    return db.query(Item).filter(Item.id == item_id).first()


def get_items(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None, in_stock: Optional[bool] = None) -> List[Item]:
    query = db.query(Item)
    
    if category:
        query = query.filter(Item.category == category)
    
    if in_stock is not None:
        query = query.filter(Item.in_stock == in_stock)
    
    return query.offset(skip).limit(limit).all()


def create_item(db: Session, item: ItemCreate) -> Item:
    db_item = Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_item(db: Session, item_id: int, item_update: ItemUpdate) -> Optional[Item]:
    db_item = get_item_by_id(db, item_id)
    if db_item:
        update_data = item_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)
        db.commit()
        db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int) -> bool:
    db_item = get_item_by_id(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False


def get_categories(db: Session) -> List[str]:
    """Get all unique categories"""
    result = db.query(Item.category).distinct().all()
    return [category[0] for category in result]