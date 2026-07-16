from fastapi import APIRouter

api_router = APIRouter()

# Descomentar cada módulo cuando el endpoint esté listo en app/api/v1/:
#
# from app.api.v1 import auth
# api_router.include_router(auth.router)
#
# from app.api.v1 import users
# api_router.include_router(users.router)
#
# from app.api.v1 import menu
# api_router.include_router(menu.router)
#
# from app.api.v1 import orders
# api_router.include_router(orders.router)
#
# from app.api.v1 import categories
# api_router.include_router(categories.router)
#
# from app.api.v1 import tables
# api_router.include_router(tables.router)
#
# from app.api.v1 import reservations
# api_router.include_router(reservations.router)
#
# from app.api.v1 import payments
# api_router.include_router(payments.router)
#
# from app.api.v1 import inventory
# api_router.include_router(inventory.router)
#
# from app.api.v1 import kitchen
# api_router.include_router(kitchen.router)
#
# from app.api.v1 import reports
# api_router.include_router(reports.router)
