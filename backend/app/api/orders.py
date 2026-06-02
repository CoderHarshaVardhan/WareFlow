from flask import Blueprint, request, jsonify
from decimal import Decimal
from ..extensions import db
from ..models import Product, Customer, Order, OrderItem
from ..schemas import OrderSchema

orders_bp = Blueprint('orders', __name__)
order_schema = OrderSchema()


@orders_bp.route('', methods=['POST'])
def create_order():
    payload = request.get_json() or {}
    errors = order_schema.validate(payload)
    if errors:
        return jsonify({'error': 'validation', 'details': errors}), 400

    customer = Customer.query.get(payload['customer_id'])
    if not customer:
        return jsonify({'error': 'customer_not_found'}), 404

    items = payload['items']
    if not items:
        return jsonify({'error': 'no_items'}), 400

    # transactional order creation with inventory checks
    try:
        total = Decimal('0')
        order = Order(customer_id=customer.id, total_amount=0)
        db.session.add(order)
        db.session.flush()

        for it in items:
            pid = it['product_id']
            qty = int(it['quantity'])
            if qty <= 0:
                raise ValueError('quantity_must_be_positive')

            product = db.session.query(Product).filter_by(id=pid).with_for_update().first()
            if not product:
                raise LookupError(f'product_not_found:{pid}')
            if product.quantity_in_stock < qty:
                raise ValueError(f'insufficient_stock:{pid}')

            unit_price = Decimal(product.price)
            line_total = unit_price * qty
            total += line_total

            # create order item
            oi = OrderItem(order_id=order.id, product_id=product.id, quantity=qty, unit_price=unit_price)
            db.session.add(oi)

            # decrement stock
            product.quantity_in_stock -= qty

        order.total_amount = total
        db.session.commit()

        return jsonify({'id': order.id, 'total_amount': str(order.total_amount)}), 201

    except LookupError as le:
        db.session.rollback()
        return jsonify({'error': str(le)}), 404
    except ValueError as ve:
        db.session.rollback()
        return jsonify({'error': str(ve)}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'server_error', 'details': str(e)}), 500


@orders_bp.route('', methods=['GET'])
def list_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = []
        for i in o.items:
            items.append({
                'product_id': i.product_id,
                'product_name': i.product.name if i.product else 'Unknown Product',
                'product_sku': i.product.sku if i.product else '',
                'quantity': i.quantity,
                'unit_price': str(i.unit_price)
            })
        result.append({
            'id': o.id,
            'customer_id': o.customer_id,
            'customer_name': o.customer.full_name if o.customer else 'Unknown Customer',
            'total_amount': str(o.total_amount),
            'created_at': o.created_at.isoformat() if o.created_at else None,
            'items': items
        })
    return jsonify(result), 200


@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    o = Order.query.get_or_404(order_id)
    items = []
    for i in o.items:
        items.append({
            'product_id': i.product_id,
            'product_name': i.product.name if i.product else 'Unknown Product',
            'product_sku': i.product.sku if i.product else '',
            'quantity': i.quantity,
            'unit_price': str(i.unit_price)
        })
    return jsonify({
        'id': o.id,
        'customer_id': o.customer_id,
        'customer_name': o.customer.full_name if o.customer else 'Unknown Customer',
        'total_amount': str(o.total_amount),
        'created_at': o.created_at.isoformat() if o.created_at else None,
        'items': items
    }), 200


@orders_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    o = Order.query.get_or_404(order_id)
    # simple delete; business rule: do not restock on delete in MVP
    db.session.delete(o)
    db.session.commit()
    return '', 204
