import json


def test_cannot_delete_customer_with_orders(client):
    # create customer
    c = {'full_name': 'Bob', 'email': 'bob@example.com'}
    rv = client.post('/api/v1/customers', data=json.dumps(c), content_type='application/json')
    assert rv.status_code == 201
    customer = rv.get_json()

    # create product
    p = {'name': 'Thing', 'sku': 'TH-1', 'price': '2.00', 'quantity_in_stock': 10}
    rv = client.post('/api/v1/products', data=json.dumps(p), content_type='application/json')
    assert rv.status_code == 201
    product = rv.get_json()

    # create order for customer
    order_payload = {'customer_id': customer['id'], 'items': [{'product_id': product['id'], 'quantity': 1}]}
    rv = client.post('/api/v1/orders', data=json.dumps(order_payload), content_type='application/json')
    assert rv.status_code == 201

    # attempt to delete customer
    rv = client.delete(f"/api/v1/customers/{customer['id']}")
    assert rv.status_code == 400
    assert rv.get_json().get('error') == 'customer_has_orders'


def test_cannot_delete_product_with_order_items(client):
    # create customer
    c = {'full_name': 'Dana', 'email': 'dana@example.com'}
    rv = client.post('/api/v1/customers', data=json.dumps(c), content_type='application/json')
    assert rv.status_code == 201
    customer = rv.get_json()

    # create product
    p = {'name': 'WidgetX', 'sku': 'WX-1', 'price': '3.50', 'quantity_in_stock': 5}
    rv = client.post('/api/v1/products', data=json.dumps(p), content_type='application/json')
    assert rv.status_code == 201
    product = rv.get_json()

    # create order referencing product
    order_payload = {'customer_id': customer['id'], 'items': [{'product_id': product['id'], 'quantity': 1}]}
    rv = client.post('/api/v1/orders', data=json.dumps(order_payload), content_type='application/json')
    assert rv.status_code == 201

    # attempt to delete product
    rv = client.delete(f"/api/v1/products/{product['id']}")
    assert rv.status_code == 400
    assert rv.get_json().get('error') == 'product_has_order_items'
