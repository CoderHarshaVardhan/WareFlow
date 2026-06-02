import React, { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Orders() {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  
  const [customerId, setCustomerId] = useState('')
  const [lines, setLines] = useState([{ product_id: '', quantity: 1 }])
  const [expandedOrders, setExpandedOrders] = useState({})
  
  const [loadingList, setLoadingList] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
    fetchOrders()
  }, [])

  function fetchData() {
    api.get('/customers').then(r => setCustomers(r.data)).catch(() => {})
    api.get('/products').then(r => setProducts(r.data)).catch(() => {})
  }

  function fetchOrders() {
    setLoadingList(true)
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingList(false))
  }

  function updateLine(index, key, value) {
    const copy = [...lines]
    copy[index][key] = value
    setLines(copy)
  }

  function addLine() {
    setLines([...lines, { product_id: '', quantity: 1 }])
  }

  function removeLine(i) {
    if (lines.length === 1) {
      setLines([{ product_id: '', quantity: 1 }])
    } else {
      setLines(lines.filter((_, idx) => idx !== i))
    }
  }

  function toggleOrderExpand(orderId) {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  // Calculate dynamic live total amount
  let dynamicTotal = 0
  let isStockInvalid = false

  lines.forEach(l => {
    if (!l.product_id) return
    const prod = products.find(p => p.id === Number(l.product_id))
    if (prod) {
      dynamicTotal += Number(prod.price) * Number(l.quantity)
      if (Number(l.quantity) > prod.quantity_in_stock) {
        isStockInvalid = true
      }
    }
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!customerId) return toast.error('Please select a customer profile')
    
    // Validate lines
    const validLines = lines.filter(l => l.product_id && l.quantity > 0)
    if (validLines.length === 0) {
      return toast.error('Please add at least one valid product line item')
    }

    // Double check stock invalidity
    if (isStockInvalid) {
      return toast.error('Insufficient stock level for one or more line items')
    }

    const items = validLines.map(l => ({
      product_id: Number(l.product_id),
      quantity: Number(l.quantity)
    }))

    setSubmitting(true)
    api.post('/orders', {
      customer_id: Number(customerId),
      items
    })
      .then(r => {
        toast.success(`Order #${r.data.id} created successfully!`)
        fetchOrders()
        fetchData() // Refresh product stock levels
        setLines([{ product_id: '', quantity: 1 }])
        setCustomerId('')
      })
      .catch(err => {
        const errorMsg = err.details?.error || err.message || 'Order placement failed'
        toast.error('Failed to create order: ' + errorMsg)
      })
      .finally(() => setSubmitting(false))
  }

  function handleDeleteOrder(id) {
    if (!window.confirm(`Are you sure you want to cancel and delete Order #${id}?`)) return

    api.delete(`/orders/${id}`)
      .then(() => {
        fetchOrders()
        fetchData() // Refresh product stock
        toast.success(`Order #${id} deleted successfully`)
      })
      .catch(err => {
        toast.error('Deletion failed: ' + (err.message || 'Unknown error'))
      })
  }

  // Filter orders by Customer Name or Order ID
  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase()
    return (
      String(o.id).includes(q) ||
      o.customer_name.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
          Orders Desk
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Monitor order transaction ledgers and assemble real-time sales transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order Ledger List (Takes 7/12 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col shadow-xl border border-slate-900 min-h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight shrink-0">Transaction Ledger</h3>
            
            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by ID or customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="premium-input pl-9 py-2 text-xs w-full"
              />
            </div>
          </div>

          {loadingList ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <span className="text-slate-500 text-xs">Reconciliation ledgers...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <svg className="w-12 h-12 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="font-semibold text-slate-400 text-sm">No transaction records</div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs text-center">
                Configure a customer profile and products inventory, then assemble a checkout order on the right.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(o => {
                const isExpanded = !!expandedOrders[o.id]
                const orderDate = o.created_at
                  ? new Date(o.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'N/A'

                return (
                  <div
                    key={o.id}
                    className={`bg-slate-950/40 border rounded-xl overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'border-slate-800 shadow-lg' : 'border-slate-900 hover:border-slate-850'
                    }`}
                  >
                    {/* Collapsed Header Summary */}
                    <div
                      onClick={() => toggleOrderExpand(o.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/10 transition-colors select-none"
                    >
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-indigo-400 font-bold tracking-wider">
                            ORDER #{o.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            • {orderDate}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-200 text-sm truncate">
                          {o.customer_name}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="font-bold text-white text-base">${Number(o.total_amount).toFixed(2)}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {o.items.length} {o.items.length === 1 ? 'Item' : 'Items'}
                          </div>
                        </div>

                        {/* Chevron Icon */}
                        <div className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="border-t border-slate-900 bg-slate-950/70 p-4 space-y-4 animate-slideDown">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900">Product</th>
                                <th className="px-4 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900">Qty</th>
                                <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900">Unit Price</th>
                                <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900/50">
                              {o.items.map((it, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-3 text-xs font-semibold text-slate-300">
                                    <div>{it.product_name}</div>
                                    <div className="text-[10px] text-indigo-400 font-mono tracking-wider mt-0.5">{it.product_sku}</div>
                                  </td>
                                  <td className="px-4 py-3 text-xs font-bold text-slate-200 text-center">{it.quantity}</td>
                                  <td className="px-4 py-3 text-xs text-slate-400 text-right">${Number(it.unit_price).toFixed(2)}</td>
                                  <td className="px-4 py-3 text-xs font-bold text-slate-200 text-right">${(Number(it.unit_price) * it.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Order cancellation footer */}
                        <div className="flex justify-end pt-2 border-t border-slate-900/50">
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="premium-btn-danger py-1.5 px-3.5 text-xs font-semibold"
                          >
                            Cancel Transaction
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order Desk Builder (Takes 5/12 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl shadow-xl border border-slate-900">
          <h3 className="text-xl font-bold text-white tracking-tight mb-1">Assemble Invoice</h3>
          <p className="text-xs text-slate-500 mb-6">Select profile, bundle items, and inspect real-time catalog stock balances.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Customer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Recipient</label>
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                className="premium-input w-full pr-8 cursor-pointer"
                disabled={submitting}
              >
                <option value="">Select customer profile...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Line Items bundle</label>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {lines.map((ln, idx) => {
                  const selectedProd = products.find(p => p.id === Number(ln.product_id))
                  const maxStock = selectedProd ? selectedProd.quantity_in_stock : 0
                  const isLineInvalid = selectedProd && Number(ln.quantity) > maxStock

                  return (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2 relative">
                      {/* Product Selector */}
                      <div className="flex gap-2">
                        <select
                          value={ln.product_id}
                          onChange={e => updateLine(idx, 'product_id', e.target.value)}
                          className="premium-input flex-1 py-1.5 text-xs pr-8 cursor-pointer"
                          disabled={submitting}
                        >
                          <option value="">Select product SKU...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (${Number(p.price).toFixed(2)})
                            </option>
                          ))}
                        </select>

                        {/* Quantity */}
                        <input
                          type="number"
                          min="1"
                          value={ln.quantity}
                          onChange={e => updateLine(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="premium-input w-20 py-1.5 text-xs text-center"
                          disabled={submitting}
                        />

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors px-1"
                          disabled={submitting}
                          title="Remove item line"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Live Stock availability badges */}
                      {selectedProd && (
                        <div className="flex justify-between items-center px-1">
                          <span className={`text-[10px] font-bold ${
                            isLineInvalid 
                              ? 'text-rose-400' 
                              : maxStock <= 2 
                              ? 'text-amber-400' 
                              : 'text-emerald-400'
                          }`}>
                            {isLineInvalid 
                              ? `⚠️ Excess: Only ${maxStock} units available` 
                              : `✓ Stock Available: ${maxStock} units`
                            }
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Subtotal: ${(Number(selectedProd.price) * ln.quantity).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Add Line button */}
              <button
                type="button"
                onClick={addLine}
                className="premium-btn-secondary w-full py-2 text-xs flex items-center justify-center gap-2 border-dashed border-slate-800"
                disabled={submitting}
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Line Item
              </button>
            </div>

            {/* Glowing Accent dynamic total summary card */}
            <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/10 rounded-2xl relative overflow-hidden flex items-center justify-between glow-indigo">
              <div>
                <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Dynamic Estimated Total</span>
                <span className="text-3xl font-extrabold text-white tracking-tight">${dynamicTotal.toFixed(2)}</span>
              </div>
              
              {isStockInvalid ? (
                <span className="px-2.5 py-1 text-[10px] font-extrabold bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg animate-pulse uppercase tracking-wider">
                  Invalid Stock
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg uppercase tracking-wider">
                  Ready to Invoice
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`premium-btn-primary w-full py-3.5 ${
                (isStockInvalid || submitting) ? 'opacity-50 cursor-not-allowed select-none' : ''
              }`}
              disabled={isStockInvalid || submitting}
            >
              {submitting ? 'Processing Transaction...' : 'Fulfill & Dispatch Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
