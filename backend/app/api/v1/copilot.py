import uuid
import datetime
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import DailyTransaction, BusinessApplication
from app.core.security import get_current_user
from app.ai.router import ai_router

router = APIRouter(prefix="/copilot", tags=["Module 3: AI Business Copilot"])

class TransactionCreate(BaseModel):
    application_id: Optional[str] = "app_101"
    type: str # income or expense
    category: str # milk_sale, fodder, equipment_fuel, vet_care, wage, emi_payment, etc.
    amount: float
    description: str

class CopilotChatRequest(BaseModel):
    application_id: Optional[str] = "app_101"
    prompt: str

@router.get("/dashboard/{application_id}")
def get_copilot_overview(application_id: str, db: Session = Depends(get_db)):
    """
    Returns enterprise operational health, 7-day cashflow summary, and proactive AI alerts.
    """
    app = db.query(BusinessApplication).filter(BusinessApplication.id == application_id).first()
    if not app:
        app = db.query(BusinessApplication).first()

    txs = db.query(DailyTransaction).filter(DailyTransaction.application_id == app.id).all()
    
    total_income = sum(t.amount for t in txs if t.type == "income")
    total_expense = sum(t.amount for t in txs if t.type == "expense")
    net_cashflow = total_income - total_expense

    # Health score logic
    if net_cashflow > 0 and app.repayment_health == "healthy":
        health_status = "HEALTHY"
        health_color = "green"
        health_score = 92
        recommendation = "Dairy cash flow is robust. You have maintained a surplus of ₹3,000+ above your monthly EMI obligation."
    elif app.repayment_health == "watch":
        health_status = "WATCH"
        health_color = "yellow"
        health_score = 72
        recommendation = "Operating margins are tightening. Review fodder procurement and expedite client invoice collections."
    else:
        health_status = "AT RISK"
        health_color = "red"
        health_score = 54
        recommendation = "High risk of delayed EMI payment. Immediate assistance recommended from local field extension officer."

    return {
        "application_id": app.id,
        "business_name": app.business_name,
        "category": app.business_category,
        "monthly_emi": app.monthly_emi,
        "total_revenue_recorded": total_income,
        "total_expenses_recorded": total_expense,
        "net_surplus": net_cashflow,
        "repayment_health": health_status,
        "health_color": health_color,
        "health_score": health_score,
        "recommendation": recommendation,
        "recent_transactions": [
            {
                "id": t.id,
                "date": t.date,
                "type": t.type,
                "category": t.category,
                "amount": t.amount,
                "description": t.description
            }
            for t in reversed(txs[-10:])
        ]
    }

@router.post("/transactions")
def add_transaction(req: TransactionCreate, db: Session = Depends(get_db)):
    """
    Logs daily sales or expense for real-time ledger management.
    """
    tx_id = f"tx_{uuid.uuid4().hex[:6]}"
    today_str = datetime.date.today().isoformat()

    tx = DailyTransaction(
        id=tx_id,
        application_id=req.application_id or "app_101",
        date=today_str,
        type=req.type,
        category=req.category,
        amount=req.amount,
        description=req.description
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    return {
        "success": True,
        "transaction_id": tx.id,
        "message": "Daily transaction recorded successfully."
    }

@router.post("/ask-advisor")
async def chat_with_business_copilot(req: CopilotChatRequest, db: Session = Depends(get_db)):
    """
    AI Business Copilot providing contextual advice on cash flow, pricing, and operational bottlenecks.
    """
    app = db.query(BusinessApplication).filter(BusinessApplication.id == req.application_id).first()
    system_prompt = (
        "You are GramUdyam Business Copilot, a practical, empathetic rural enterprise mentor. "
        "Provide direct, actionable, localized advice in simple Hindi/English mix. "
        "Keep advice practical for village entrepreneurs (e.g. buying feed in bulk, avoiding middlemen, maintaining clean sheds)."
    )

    context_data = {
        "business": app.business_name if app else "Dairy Farm",
        "category": app.business_category if app else "Dairy Farming",
        "monthly_emi": f"₹{app.monthly_emi}" if app else "₹4,250",
        "status": app.repayment_health if app else "healthy"
    }

    advice = await ai_router.generate_response(
        prompt=req.prompt,
        system_instruction=system_prompt,
        grounded_data=context_data
    )

    return {
        "prompt": req.prompt,
        "copilot_advice": advice
    }
