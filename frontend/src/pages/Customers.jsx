import React, { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  function fetchCustomers() {
    setLoading(true)
    api.get('/customers')
      .then(r => setCustomers(r.data))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.full_name.trim() || !form.email.trim()) {
      return toast.error('Name and email are required')
    }

    setSubmitting(true)
    api.post('/customers', {
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone_number: form.phone_number.trim() || null
    })
      .then(() => {
        setForm({ full_name: '', email: '', phone_number: '' })
        fetchCustomers()
        toast.success('Customer created successfully')
      })
      .catch(err => {
        const errorMsg = err.details?.error || err.message || 'Creation failed'
        toast.error('Error: ' + errorMsg)
      })
      .finally(() => setSubmitting(false))
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) return

    api.delete(`/customers/${id}`)
      .then(() => {
        fetchCustomers()
        toast.success('Customer profile deleted')
      })
      .catch(err => {
        // Detailed delete-protection check
        if (err.message === 'customer_has_orders') {
          toast.error(`Cannot delete "${name}" because they have existing order history. Delete their orders first!`, {
            duration: 5000,
            icon: '⚠️'
          })
        } else {
          toast.error('Cannot delete: ' + (err.message || 'Action failed'))
        }
      })
  }

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase()
    return c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
          Customers Directory
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Register new buyers and navigate profile directories, contact channels, and transaction histories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Creator Form */}
        <div className="glass-panel p-6 rounded-2xl h-fit shadow-xl border border-slate-900">
          <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Register Profile</h3>
          <p className="text-xs text-slate-500 mb-6">Create unique contact record to receive and balance invoices.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. Eleanor Vance"
                className="premium-input w-full"
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. eleanor@example.com"
                className="premium-input w-full"
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone number (optional)</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
                className="premium-input w-full"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="premium-btn-primary w-full mt-2"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register Customer'}
            </button>
          </form>
        </div>

        {/* Right Column: Search List (Takes 2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col shadow-xl border border-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight shrink-0">Profile Directory</h3>
            
            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search directory..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="premium-input pl-9 py-2 text-xs w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <span className="text-slate-500 text-xs">Loading profile index...</span>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
              </svg>
              <div className="font-semibold text-slate-400 text-sm">No profiles found</div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs text-center">
                Add a new customer on the left to start populate the directory database.
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
              {filteredCustomers.map(c => (
                <div key={c.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 flex items-center justify-between gap-4 hover:border-slate-800 transition-all group">
                  <div className="space-y-1 truncate">
                    <div className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{c.full_name}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {c.email}
                      </span>
                      {c.phone_number && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {c.phone_number}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(c.id, c.full_name)}
                    className="premium-btn-danger p-2 shrink-0 rounded-lg hover:bg-rose-500/25 border-rose-500/10"
                    title="Delete Customer Profile"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
