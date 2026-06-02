import json


def test_create_and_get_product(client):
    payload = {
        'name': 'Widget A',
        'sku': 'WID-A-001',
        'price': '9.99',
        'quantity_in_stock': 10,
    }
    rv = client.post('/api/v1/products', data=json.dumps(payload), content_type='application/json')
    assert rv.status_code == 201
    data = rv.get_json()
    assert data['sku'] == 'WID-A-001'

    # list
    rv = client.get('/api/v1/products')
    assert rv.status_code == 200
    lst = rv.get_json()
    assert any(p['sku'] == 'WID-A-001' for p in lst)

    # get by id
    pid = data['id']
    rv = client.get(f'/api/v1/products/{pid}')
    assert rv.status_code == 200
    got = rv.get_json()
    assert got['name'] == 'Widget A'
