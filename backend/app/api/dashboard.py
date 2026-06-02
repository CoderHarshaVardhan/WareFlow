from flask import Blueprint, jsonify
from ..models import Product, Customer, Order

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/summary', methods=['GET'])
def summary():
    total_products = Product.query.count()
    total_customers = Customer.query.count()
    total_orders = Order.query.count()
    low_stock = Product.query.filter(Product.quantity_in_stock <= 5).all()
    low = [{'id': p.id, 'name': p.name, 'sku': p.sku, 'quantity_in_stock': p.quantity_in_stock} for p in low_stock]
    return jsonify({'total_products': total_products, 'total_customers': total_customers, 'total_orders': total_orders, 'low_stock': low}), 200
