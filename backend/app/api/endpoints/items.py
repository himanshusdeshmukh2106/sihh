"""
Items endpoints with PostgreSQL database integration
Modern FastAPI CRUD patterns
"""

from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.database import get_db
from app.schemas.item import ItemCreate, ItemUpdate, ItemResponse
from app.services import item_service

router = APIRouter()


@router.get("/", response_model=List[ItemResponse])
async def get_items(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of items to return"),
    category: Optional[str] = Query(None, description="Filter by category"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock status"),
    db: Session = Depends(get_db)
) -> List[ItemResponse]:
    """
    Get list of items with filters and pagination
    """
    items = item_service.get_items(db, skip=skip, limit=limit, category=category, in_stock=in_stock)
    return items


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int, db: Session = Depends(get_db)) -> ItemResponse:
    """
    Get item by ID
    """
    item = item_service.get_item_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return item


@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)) -> ItemResponse:
    """
    Create new item
    """
    return item_service.create_item(db, item)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: int, item_update: ItemUpdate, db: Session = Depends(get_db)) -> ItemResponse:
    """
    Update item by ID
    """
    item = item_service.update_item(db, item_id, item_update)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return item


@router.delete("/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    """
    Delete item by ID
    """
    success = item_service.delete_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return {"message": f"Item {item_id} deleted successfully"}


@router.get("/categories/", response_model=List[str])
async def get_categories(db: Session = Depends(get_db)) -> List[str]:
    """
    Get all item categories
    """
    return item_service.get_categories(db)