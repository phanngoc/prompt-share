import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.order import Order
from app.models.payment import Payment, PaymentMethod, PaymentStatus
from app.models.enums import OrderStatus
from app.models.user import User
from app.models.prompt import Prompt
from app.schemas.order import OrderCreate, PaymentCreate

def generate_order_number():
    """Generate a unique order number"""
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"

def create_order(db: Session, order_data: OrderCreate, user_id: int) -> Order:
    """Create a new order"""
    db_order = Order(
        order_number=generate_order_number(),
        amount=order_data.amount,
        sol_amount=order_data.sol_amount,
        payment_type=order_data.payment_type,
        notes=order_data.notes,
        user_id=user_id,
        prompt_id=order_data.prompt_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def create_payment(db: Session, payment_data: PaymentCreate, order_id: int) -> Payment:
    """Create a payment for an order"""
    
    # Generate a unique transaction ID
    transaction_id = f"TX-{uuid.uuid4().hex[:10].upper()}"
    
    # Create payment entry
    db_payment = Payment(
        transaction_id=transaction_id,
        amount=db.query(Order).filter(Order.id == order_id).first().amount,
        method=payment_data.method,
        payment_details=payment_data.payment_details,
        order_id=order_id
    )
    
    # Add SOL specific fields if it's a SOL payment
    if payment_data.method == PaymentMethod.SOL:
        db_payment.sol_amount = db.query(Order).filter(Order.id == order_id).first().sol_amount
        db_payment.wallet_address = payment_data.wallet_address
        db_payment.blockchain_tx_id = payment_data.blockchain_tx_id

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_order(db: Session, order_id: int) -> Optional[Order]:
    """Get an order by ID"""
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Order]:
    """Get orders for a specific user"""
    return db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()

def get_order_with_details(db: Session, order_id: int):
    """Get an order with additional details from related tables"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return None
        
    # Get related information
    prompt = db.query(Prompt).filter(Prompt.id == order.prompt_id).first()
    user = db.query(User).filter(User.id == order.user_id).first()
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    
    # Create a response dictionary with combined information
    response = {
        "id": order.id,
        "order_number": order.order_number,
        "amount": order.amount,
        "sol_amount": order.sol_amount,
        "status": order.status,
        "payment_type": order.payment_type,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "notes": order.notes,
        "prompt_id": order.prompt_id,
        "prompt_title": prompt.title if prompt else None,
        "prompt_description": prompt.description if prompt else None,
        "user_id": order.user_id,
        "user_email": user.email if user else None,
        "payment": payment
    }
    
    return response

def update_order_status(db: Session, order_id: int, status: OrderStatus) -> Optional[Order]:
    """Update the status of an order"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return None
    
    order.status = status
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    return order

def update_payment_status(db: Session, payment_id: int, status: PaymentStatus) -> Optional[Payment]:
    """Update the status of a payment"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return None
    
    payment.status = status
    payment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(payment)
    
    # If payment is completed, also update order status
    if status == PaymentStatus.COMPLETED:
        update_order_status(db, payment.order_id, OrderStatus.PAID)
    elif status == PaymentStatus.FAILED:
        update_order_status(db, payment.order_id, OrderStatus.FAILED)
    elif status == PaymentStatus.REFUNDED:
        update_order_status(db, payment.order_id, OrderStatus.REFUNDED)
    
    return payment