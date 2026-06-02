import React, { useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ProductForm({ initial = null, onSuccess, onCancel }) {
  const [form, setForm] = useState({ name: '', sku: '', price: '0.00', quantity_in_stock: 0 })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        sku: initial.sku,
        price: String(initial.price),
        quantity_in_stock: Number(initial.quantity_in_stock)
      })
    } else {
      setForm({ name: '', sku: '', price: '0.00', quantity_in_stock: 0 })
    }
  }, [initial])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.sku.trim()) {
      return toast.error('Name and SKU are required fields')
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      price: String(form.price),
      quantity_in_stock: Number(form.quantity_in_stock)
    }

    setSubmitting(true)

    const request = (initial && initial.id)
      ? api.put(`/products/${initial.id}`, payload)
      : api.post('/products', payload)

    request
      .then(r => {
        toast.success(initial ? 'Product updated successfully' : 'Product created successfully')
        if (onSuccess) onSuccess(r.data)
      })
      .catch(err => {
        const errorMsg = err.details?.error || err.message || 'Action failed'
        toast.error('Error: ' + errorMsg)
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Premium Ergonomic Keyboard"
            className="premium-input w-full"
            disabled={submitting}
          />
        </div>

        {/* SKU input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unique SKU Code</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. KB-ERG-01"
            className="premium-input w-full font-mono uppercase"
            disabled={submitting}
          />
        </div>

        {/* Price and Stock group */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className="premium-input w-full"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Level</label>
            <input
              name="quantity_in_stock"
              type="number"
              min="0"
              value={form.quantity_in_stock}
              onChange={handleChange}
              placeholder="0"
              className="premium-input w-full"
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="premium-btn-secondary py-2.5 px-5"
            disabled={submitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="premium-btn-primary py-2.5 px-6"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
