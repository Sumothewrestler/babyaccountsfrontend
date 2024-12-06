'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { config } from '@/config/env'
import { apiClient } from '@/lib/api-client'

const API_BASE_URL = config.apiBaseUrl

type Business = {
  id: number
  name: string
}

type Type = {
  id: number
  name: string
}

type Ledger = {
  id: number
  name: string
  ledger_head: string
}

type Head = {
  id: number
  name: string
}

type Mode = {
  id: number
  name: string
}

type AccountingEntry = {
  id: number
  date: string
  business: Business
  type: Type
  ledger: Ledger
  head: Head
  cr: number | string
  dr: number | string
  mode: Mode
  gst: 'with_gst' | 'without_gst'
  description: string
}

export default function AccountingReports() {
  const [entries, setEntries] = useState<AccountingEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<AccountingEntry[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  const [heads, setHeads] = useState<Head[]>([])
  const [modes, setModes] = useState<Mode[]>([])
  const [filters, setFilters] = useState({
    business: '',
    type: '',
    ledger: '',
    head: '',
    mode: ''
  })
  const [totals, setTotals] = useState({ totalCr: 0, totalDr: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await apiClient.get<AccountingEntry[]>('/accounting/')
      if (data) {
        setEntries(data)
        setFilteredEntries(data)
      } else if (error) {
        console.error('Failed to fetch accounting entries:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilterOptions = async () => {
    try {
      const [
        { data: businessesData },
        { data: typesData },
        { data: ledgersData },
        { data: headsData },
        { data: modesData }
      ] = await Promise.all([
        apiClient.get<Business[]>('/businesses/'),
        apiClient.get<Type[]>('/type/'),
        apiClient.get<Ledger[]>('/ledgers/'),
        apiClient.get<Head[]>('/heads/'),
        apiClient.get<Mode[]>('/modes/')
      ])

      if (businessesData && typesData && ledgersData && headsData && modesData) {
        setBusinesses(businessesData)
        setTypes(typesData)
        setLedgers(ledgersData)
        setHeads(headsData)
        setModes(modesData)
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = entries
    if (filters.business) {
      filtered = filtered.filter(entry => entry.business.id.toString() === filters.business)
    }
    if (filters.type) {
      filtered = filtered.filter(entry => entry.type.id.toString() === filters.type)
    }
    if (filters.ledger) {
      filtered = filtered.filter(entry => entry.ledger.id.toString() === filters.ledger)
    }
    if (filters.head) {
      filtered = filtered.filter(entry => entry.head.id.toString() === filters.head)
    }
    if (filters.mode) {
      filtered = filtered.filter(entry => entry.mode.id.toString() === filters.mode)
    }
    setFilteredEntries(filtered)
  }, [entries, filters])

  const calculateTotals = useCallback(() => {
    const totalCr = filteredEntries.reduce((acc, entry) => {
      return acc + (typeof entry.cr === 'number' ? entry.cr : parseFloat(entry.cr) || 0)
    }, 0)

    const totalDr = filteredEntries.reduce((acc, entry) => {
      return acc + (typeof entry.dr === 'number' ? entry.dr : parseFloat(entry.dr) || 0)
    }, 0)

    setTotals({ totalCr, totalDr })
  }, [filteredEntries])

  useEffect(() => {
    fetchEntries()
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [entries, filters, applyFilters])

  useEffect(() => {
    calculateTotals()
  }, [filteredEntries, calculateTotals])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/accounting/${id}/`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setEntries(entries.filter(entry => entry.id !== id))
          setFilteredEntries(filteredEntries.filter(entry => entry.id !== id))
          alert('Entry deleted successfully')
        } else {
          alert('Failed to delete entry')
        }
      } catch (error) {
        console.error('Error deleting entry:', error)
        alert('An error occurred while deleting the entry')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Accounting Reports</h1>
          <Link href="/" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add New
          </Link>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            name="business"
            onChange={handleFilterChange}
            value={filters.business}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black font-semibold"
          >
            <option value="">All Businesses</option>
            {businesses.map(business => (
              <option key={business.id} value={business.id.toString()}>{business.name}</option>
            ))}
          </select>
          <select
            name="type"
            onChange={handleFilterChange}
            value={filters.type}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black font-semibold"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type.id} value={type.id.toString()}>{type.name}</option>
            ))}
          </select>
          <select
            name="ledger"
            onChange={handleFilterChange}
            value={filters.ledger}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black font-semibold"
          >
            <option value="">All Ledgers</option>
            {ledgers.map(ledger => (
              <option key={ledger.id} value={ledger.id.toString()}>{ledger.name}</option>
            ))}
          </select>
          <select
            name="head"
            onChange={handleFilterChange}
            value={filters.head}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black font-semibold"
          >
            <option value="">All Heads</option>
            {heads.map(head => (
              <option key={head.id} value={head.id.toString()}>{head.name}</option>
            ))}
          </select>
          <select
            name="mode"
            onChange={handleFilterChange}
            value={filters.mode}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black font-semibold"
          >
            <option value="">All Modes</option>
            {modes.map(mode => (
              <option key={mode.id} value={mode.id.toString()}>{mode.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Ledger</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Head</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Cr Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Dr Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">GST</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.business.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.type.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.ledger.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.head.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof entry.cr === 'number' ? entry.cr.toFixed(2) : entry.cr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof entry.dr === 'number' ? entry.dr.toFixed(2) : entry.dr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.mode.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.gst}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Totals</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{totals.totalCr.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{totals.totalDr.toFixed(2)}</td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

