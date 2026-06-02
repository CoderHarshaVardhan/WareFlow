import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_products: 0, total_customers: 0, total_orders: 0, low_stock: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/dashboard/summary')
      .then(r => setSummary(r.data))
      .catch(() => setSummary({ total_products: 0, total_customers: 0, total_orders: 0, low_stock: [] }))
      .finally(() => setLoading(false))
  }, [])

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400 font-medium">Calculating warehouse analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time warehouse inventory levels and customer orders metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-sm text-slate-300 font-medium w-fit">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {currentDate}
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Products card */}
        <div className="glass-panel p-6 rounded-2xl glass-card-hover glow-indigo relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-indigo-400/90 tracking-wide uppercase">Total Catalog Products</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{summary.total_products}</div>
          <p className="text-xs text-slate-500 mt-2">Active SKUs cataloged in DB</p>
        </div>

        {/* Total Customers card */}
        <div className="glass-panel p-6 rounded-2xl glass-card-hover glow-indigo relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-all duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-violet-400/90 tracking-wide uppercase">Total Customers</span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{summary.total_customers}</div>
          <p className="text-xs text-slate-500 mt-2">Unique profiles registered</p>
        </div>

        {/* Total Orders card */}
        <div className="glass-panel p-6 rounded-2xl glass-card-hover glow-emerald relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-400/90 tracking-wide uppercase">Processed Orders</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{summary.total_orders}</div>
          <p className="text-xs text-slate-500 mt-2">Historic order transactions</p>
        </div>
      </div>

      {/* Main Grid: Low Stock Alert Center & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Alert Center (Takes 2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
              <h3 className="text-xl font-bold text-white tracking-tight">Low Stock Alert Center</h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
              Threshold: ≤ 5 items
            </span>
          </div>

          {summary.low_stock.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <svg className="w-12 h-12 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div className="font-semibold text-slate-300">All Stock Levels Secure</div>
              <div className="text-xs text-slate-500 mt-1 text-center max-w-xs">Every cataloged product has stable inventory levels above warning threshold.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {summary.low_stock.map(p => {
                const percentage = Math.min((p.quantity_in_stock / 5) * 100, 100)
                const isCritical = p.quantity_in_stock <= 2
                return (
                  <div key={p.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-800 transition-all">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-200 text-base">{p.name}</div>
                      <div className="text-xs text-slate-500 font-mono tracking-wider">{p.sku}</div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 sm:w-64">
                      {/* Custom dynamic progress bar */}
                      <div className="flex-1 space-y-1">
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                          <span>CRITICAL</span>
                          <span>THRESHOLD</span>
                        </div>
                      </div>
                      
                      {/* Badge status */}
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center shrink-0 w-20 ${
                        isCritical 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.quantity_in_stock} Units
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions launchpad (Takes 1 col) */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Quick Actions</h3>
          
          <div className="space-y-3">
            <Link to="/orders" className="group flex items-center gap-3 p-4 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800/80 hover:to-slate-900/80 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-200 text-sm">Create New Order</div>
                <div className="text-xs text-slate-500 mt-0.5">Fulfill cart and adjust stock</div>
              </div>
            </Link>

            <Link to="/products" className="group flex items-center gap-3 p-4 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800/80 hover:to-slate-900/80 border border-slate-800 hover:border-violet-500/30 rounded-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-200 text-sm">Manage Products</div>
                <div className="text-xs text-slate-500 mt-0.5">Configure SKUs, pricing & levels</div>
              </div>
            </Link>

            <Link to="/customers" className="group flex items-center gap-3 p-4 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800/80 hover:to-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-200 text-sm">Add Customer</div>
                <div className="text-xs text-slate-500 mt-0.5">Register profiles and directory</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
