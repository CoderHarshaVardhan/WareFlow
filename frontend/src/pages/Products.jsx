import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ProductForm from '../components/ProductForm'
import toast from 'react-hot-toast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  function fetchProducts() {
    setLoading(true)
    api.get('/products')
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  function handleEdit(p) {
    setEditing(p)
    setShowForm(true)
  }

  function handleDelete(id) {
    if (!window.confirm('Are you absolutely sure you want to delete this product? This action is irreversible.')) return
    api.delete(`/products/${id}`)
      .then(() => {
        fetchProducts()
        toast.success('Product deleted successfully')
      })
      .catch(err => {
        const errorMsg = err.details?.error || err.message || 'Deletion failed'
        toast.error('Cannot delete: ' + errorMsg)
      })
  }

  function onFormSuccess() {
    setShowForm(false)
    setEditing(null)
    fetchProducts()
  }

  // Filter products
  const filteredProducts = products.filter(p => {
    const query = search.toLowerCase()
    return p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price)
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price)
    if (sortBy === 'stock-asc') return a.quantity_in_stock - b.quantity_in_stock
    if (sortBy === 'stock-desc') return b.quantity_in_stock - a.quantity_in_stock
    return 0
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Products Catalog
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse and manage your warehouse SKU directory, pricing structures, and stock counts.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="premium-btn-primary flex items-center justify-center gap-2 py-2.5 px-5 self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filter controls panel */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="premium-input pl-10 w-full py-2.5 text-sm"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Sort By</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="premium-input py-2 px-3 text-sm pr-8 bg-slate-900 border-slate-800 rounded-lg cursor-pointer"
          >
            <option value="name-asc">Product Name (A-Z)</option>
            <option value="name-desc">Product Name (Z-A)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {/* Catalog Table Card */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-slate-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <span className="text-slate-400 text-sm">Fetching catalog...</span>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div className="font-semibold text-slate-300">No products found</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no products matching your search criteria or register one using the "Add Product" button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr>
                  <th className="premium-th">Product Details</th>
                  <th className="premium-th">SKU Code</th>
                  <th className="premium-th text-right">Unit Price</th>
                  <th className="premium-th text-center">Stock Level</th>
                  <th className="premium-th text-center">Status</th>
                  <th className="premium-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {sortedProducts.map(p => {
                  const qty = p.quantity_in_stock
                  const isCritical = qty === 0
                  const isLow = qty > 0 && qty <= 5
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/20 transition-colors group">
                      <td className="premium-td font-semibold text-white max-w-xs truncate">
                        {p.name}
                      </td>
                      <td className="premium-td font-mono text-xs text-indigo-400 font-medium tracking-wider">
                        {p.sku}
                      </td>
                      <td className="premium-td text-right font-semibold text-slate-200">
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td className="premium-td text-center font-bold text-slate-100">
                        {qty}
                      </td>
                      <td className="premium-td text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                          isCritical
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : isLow
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {isCritical ? 'Out of Stock' : isLow ? 'Low Stock' : 'Good'}
                        </span>
                      </td>
                      <td className="premium-td text-right space-x-1">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg border border-indigo-500/20 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="premium-btn-danger px-3 py-1.5 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative glow-indigo">
            {/* Modal Close */}
            <button
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {editing ? 'Modify Product Record' : 'Register New Product'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure unique SKU code, price point, and immediate warehouse count.
              </p>
            </div>

            {/* Form */}
            <ProductForm
              initial={editing}
              onSuccess={onFormSuccess}
              onCancel={() => { setShowForm(false); setEditing(null) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
