from .extensions import ma
from marshmallow import fields, validate


class ProductSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1))
    sku = fields.Str(required=True, validate=validate.Length(min=1))
    price = fields.Decimal(as_string=True, required=True, validate=validate.Range(min=0))
    quantity_in_stock = fields.Int(required=True, validate=validate.Range(min=0))


class CustomerSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    full_name = fields.Str(required=True)
    email = fields.Email(required=True)
    phone_number = fields.Str(allow_none=True)


class OrderItemSchema(ma.Schema):
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))
    unit_price = fields.Decimal(as_string=True, dump_only=True)


class OrderSchema(ma.Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(required=True)
    items = fields.List(fields.Nested(OrderItemSchema), required=True)
    total_amount = fields.Decimal(as_string=True, dump_only=True)
