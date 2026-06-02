import json


def test_create_order_reduces_stock_and_calculates_total(client):
    # create customer
    c = {'full_name': 'Alice', 'email': 'alice@example.com'}
    rv = client.post('/api/v1/customers', data=json.dumps(c), content_type='application/json')
    assert rv.status_code == 201
    customer = rv.get_json()

    # create product
    p = {'name': 'Gadget', 'sku': 'GAD-01', 'price': '5.00', 'quantity_in_stock': 5}
    rv = client.post('/api/v1/products', data=json.dumps(p), content_type='application/json')
    assert rv.status_code == 201
    product = rv.get_json()

    # create order with quantity 3
    order_payload = {'customer_id': customer['id'], 'items': [{'product_id': product['id'], 'quantity': 3}]}
    rv = client.post('/api/v1/orders', data=json.dumps(order_payload), content_type='application/json')
    assert rv.status_code == 201
    ord_resp = rv.get_json()
    assert ord_resp['total_amount'] == '15.00'

    # check product stock decreased
    rv = client.get(f"/api/v1/products/{product['id']}")
    assert rv.status_code == 200
    prod_after = rv.get_json()
    assert prod_after['quantity_in_stock'] == 2
