from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Product, OrderItem
from ..schemas import ProductSchema

products_bp = Blueprint('products', __name__)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)


@products_bp.route('', methods=['POST'])
def create_product():
    data = request.get_json() or {}
    errors = product_schema.validate(data)
    if errors:
        return jsonify({'error': 'validation', 'details': errors}), 400

    if Product.query.filter_by(sku=data['sku']).first():
        return jsonify({'error': 'SKU already exists'}), 409

    product = Product(
        name=data['name'], sku=data['sku'], price=data['price'], quantity_in_stock=data.get('quantity_in_stock', 0)
    )
    db.session.add(product)
    db.session.commit()
    return product_schema.jsonify(product), 201


@products_bp.route('', methods=['GET'])
def list_products():
    products = Product.query.order_by(Product.id.desc()).all()
    return products_schema.jsonify(products), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    p = Product.query.get_or_404(product_id)
    return product_schema.jsonify(p), 200


@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    p = Product.query.get_or_404(product_id)
    data = request.get_json() or {}
    errors = product_schema.validate(data, partial=True)
    if errors:
        return jsonify({'error': 'validation', 'details': errors}), 400

    if 'sku' in data and data['sku'] != p.sku:
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'error': 'SKU already exists'}), 409
        p.sku = data['sku']

    for field in ('name', 'price', 'quantity_in_stock'):
        if field in data:
            setattr(p, field, data[field])

    db.session.commit()
    return product_schema.jsonify(p), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    p = Product.query.get_or_404(product_id)
    # Prevent deleting products referenced by existing order items
    if OrderItem.query.filter_by(product_id=p.id).first():
        return jsonify({'error': 'product_has_order_items'}), 400

    db.session.delete(p)
    db.session.commit()
    return '', 204
