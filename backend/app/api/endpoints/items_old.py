"""
Items endpoints
Modern FastAPI CRUD patterns for items/products
"""

from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

router = APIRouter()


class ItemCategory(str, Enum):
    """Item categories"""
    ELECTRONICS = "electronics"
    CLOTHING = "clothing"
    BOOKS = "books"
    HOME = "home"
    SPORTS = "sports"


class ItemCreate(BaseModel):
    """Item creation model"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    category: ItemCategory
    in_stock: bool = True


class ItemUpdate(BaseModel):
    """Item update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[ItemCategory] = None
    in_stock: Optional[bool] = None


class ItemResponse(BaseModel):
    """Item response model"""
    id: str
    name: str
    description: Optional[str]
    price: float
    category: ItemCategory
    in_stock: bool
    created_at: str
    updated_at: str


@router.get("/", response_model=List[ItemResponse])
async def get_items(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of items to return"),
    category: Optional[ItemCategory] = Query(None, description="Filter by category"),
    in_stock: Optional[bool] = Query(None, description="Filter by stock status")
) -> List[ItemResponse]:
    """
    Get list of items with pagination and filtering
    """
    # Mock data - replace with real database query
    mock_items = [
        ItemResponse(
            id="item_1",
            name="Smartphone",
            description="Latest smartphone with advanced features",
            price=599.99,
            category=ItemCategory.ELECTRONICS,
            in_stock=True,
            created_at="2024-01-01T00:00:00Z",
            updated_at="2024-01-01T00:00:00Z"
        ),
        ItemResponse(
            id="item_2",
            name="T-Shirt",
            description="Comfortable cotton t-shirt",
            price=29.99,
            category=ItemCategory.CLOTHING,
            in_stock=True,
            created_at="2024-01-02T00:00:00Z",
            updated_at="2024-01-02T00:00:00Z"
        ),
        ItemResponse(
            id="item_3",
            name="Python Programming Book",
            description="Learn Python programming from scratch",
            price=49.99,
            category=ItemCategory.BOOKS,
            in_stock=False,
            created_at="2024-01-03T00:00:00Z",
            updated_at="2024-01-03T00:00:00Z"
        )
    ]
    
    # Apply filters
    filtered_items = mock_items
    if category:
        filtered_items = [item for item in filtered_items if item.category == category]
    if in_stock is not None:
        filtered_items = [item for item in filtered_items if item.in_stock == in_stock]
    
    return filtered_items[skip:skip + limit]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str) -> ItemResponse:
    """
    Get item by ID
    """
    # Mock data - replace with real database query
    if item_id == "item_1":
        return ItemResponse(
            id=item_id,
            name="Smartphone",
            description="Latest smartphone with advanced features",
            price=599.99,
            category=ItemCategory.ELECTRONICS,
            in_stock=True,
            created_at="2024-01-01T00:00:00Z",
            updated_at="2024-01-01T00:00:00Z"
        )
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Item not found"
    )


@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate) -> ItemResponse:
    """
    Create new item
    """
    # Mock creation - replace with real database logic
    return ItemResponse(
        id="new_item_123",
        name=item.name,
        description=item.description,
        price=item.price,
        category=item.category,
        in_stock=item.in_stock,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z"
    )


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: str, item_update: ItemUpdate) -> ItemResponse:
    """
    Update item by ID
    """
    # Mock update - replace with real database logic
    if item_id != "item_1":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    return ItemResponse(
        id=item_id,
        name=item_update.name or "Updated Smartphone",
        description=item_update.description or "Updated description",
        price=item_update.price or 699.99,
        category=item_update.category or ItemCategory.ELECTRONICS,
        in_stock=item_update.in_stock if item_update.in_stock is not None else True,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T12:00:00Z"
    )


@router.delete("/{item_id}")
async def delete_item(item_id: str) -> Dict[str, str]:
    """
    Delete item by ID
    """
    # Mock deletion - replace with real database logic
    if item_id != "item_1":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    return {"message": f"Item {item_id} deleted successfully"}


@router.get("/categories/", response_model=List[str])
async def get_categories() -> List[str]:
    """
    Get all available item categories
    """
    return [category.value for category in ItemCategory]