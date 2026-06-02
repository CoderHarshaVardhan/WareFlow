from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Customer
from ..schemas import CustomerSchema

customers_bp = Blueprint('customers', __name__)
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)


@customers_bp.route('', methods=['POST'])
def create_customer():
    data = request.get_json() or {}
    errors = customer_schema.validate(data)
    if errors:
        return jsonify({'error': 'validation', 'details': errors}), 400

    if Customer.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409

    c = Customer(full_name=data['full_name'], email=data['email'], phone_number=data.get('phone_number'))
    db.session.add(c)
    db.session.commit()
    return customer_schema.jsonify(c), 201


@customers_bp.route('', methods=['GET'])
def list_customers():
    cs = Customer.query.order_by(Customer.id.desc()).all()
    return customers_schema.jsonify(cs), 200


@customers_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    return customer_schema.jsonify(c), 200


@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    # Prevent deleting customers with existing orders
    if getattr(c, 'orders', None) and len(c.orders) > 0:
        return jsonify({'error': 'customer_has_orders'}), 400

    db.session.delete(c)
    db.session.commit()
    return '', 204
