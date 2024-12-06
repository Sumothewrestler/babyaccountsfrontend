'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PlusCircle, Briefcase, Book, CreditCard, FileText, Tag } from 'lucide-react'
import Modal from '../components/Modal'

const API_BASE_URL = 'http://localhost:8000/api'

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
}

type Head = {
  id: number
  name: string
}

type Mode = {
  id: number
  name: string
}

type FormData = {
  date: string
  business: string
  type: string
  ledger: string
  head: string
  cr: number
  dr: number
  mode: string
  gst: 'with_gst' | 'without_gst'
  description: string
}

export default function AccountingForm() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  const [heads, setHeads] = useState<Head[]>([])
  const [modes, setModes] = useState<Mode[]>([])
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false)
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false)
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false)
  const [isModeModalOpen, setIsModeModalOpen] = useState(false)

  const [newBusinessName, setNewBusinessName] = useState('')
  const [newTypeName, setNewTypeName] = useState('')
  const [newLedgerName, setNewLedgerName] = useState('')
  const [newHeadName, setNewHeadName] = useState('')
  const [newModeName, setNewModeName] = useState('')

  useEffect(() => {
    fetchBusinesses()
    fetchTypes()
    fetchLedgers()
    fetchHeads()
    fetchModes()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/`)
      if (response.ok) {
        const data = await response.json()
        setBusinesses(data)
      } else {
        console.error('Failed to fetch businesses')
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
    }
  }

  const fetchTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/type/`)
      if (response.ok) {
        const data = await response.json()
        setTypes(data)
      } else {
        console.error('Failed to fetch types')
      }
    } catch (error) {
      console.error('Error fetching types:', error)
    }
  }

  const fetchLedgers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ledgers/`)
      if (response.ok) {
        const data = await response.json()
        setLedgers(data)
      } else {
        console.error('Failed to fetch ledgers')
      }
    } catch (error) {
      console.error('Error fetching ledgers:', error)
    }
  }

  const fetchHeads = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/heads/`)
      if (response.ok) {
        const data = await response.json()
        setHeads(data)
      } else {
        console.error('Failed to fetch heads')
      }
    } catch (error) {
      console.error('Error fetching heads:', error)
    }
  }

  const fetchModes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/modes/`)
      if (response.ok) {
        const data = await response.json()
        setModes(data)
      } else {
        console.error('Failed to fetch modes')
      }
    } catch (error) {
      console.error('Error fetching modes:', error)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounting/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Accounting entry created successfully! ID: ' + result.id);
        reset();
      } else {
        const errorData = await response.json();
        alert(`Failed to create accounting entry: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the accounting entry');
    }
  };

  const handleNewBusiness = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newBusinessName }),
      })

      if (response.ok) {
        const newBusiness = await response.json()
        setBusinesses([...businesses, newBusiness])
        setIsBusinessModalOpen(false)
        setNewBusinessName('')
      } else {
        const errorData = await response.json()
        alert(`Failed to create new business: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the business')
    }
  }

  const handleNewType = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/type/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTypeName }),
      })

      if (response.ok) {
        const newType = await response.json()
        setTypes([...types, newType])
        setIsTypeModalOpen(false)
        setNewTypeName('')
      } else {
        const errorData = await response.json()
        alert(`Failed to create new type: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the type')
    }
  }

  const handleNewLedger = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ledgers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newLedgerName }),
      })

      if (response.ok) {
        const newLedger = await response.json()
        setLedgers([...ledgers, newLedger])
        setIsLedgerModalOpen(false)
        setNewLedgerName('')
      } else {
        const errorData = await response.json()
        alert(`Failed to create new ledger: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the ledger')
    }
  }

  const handleNewHead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/heads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newHeadName }),
      })

      if (response.ok) {
        const newHead = await response.json()
        setHeads([...heads, newHead])
        setIsHeadModalOpen(false)
        setNewHeadName('')
      } else {
        const errorData = await response.json()
        alert(`Failed to create new head: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the head')
    }
  }

  const handleNewMode = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/modes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newModeName }),
      })

      if (response.ok) {
        const newMode = await response.json()
        setModes([...modes, newMode])
        setIsModeModalOpen(false)
        setNewModeName('')
      } else {
        const errorData = await response.json()
        alert(`Failed to create new mode: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the mode')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Accounting</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-black">1. Date</label>
              <input
                type="date"
                id="date"
                {...register('date', { required: 'Date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>

            <div>
              <label htmlFor="business" className="block text-sm font-medium text-black">2. Business</label>
              <div className="flex">
                <select
                  id="business"
                  {...register('business', { required: 'Business is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                >
                  <option value="">Select a business</option>
                  {businesses.map(business => (
                    <option key={business.id} value={business.id}>{business.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsBusinessModalOpen(true)}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
              {errors.business && <p className="mt-1 text-sm text-red-600">{errors.business.message}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-black">3. Type</label>
              <div className="flex">
                <select
                  id="type"
                  {...register('type', { required: 'Type is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                >
                  <option value="">Select a type</option>
                  {types.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(true)}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Tag className="h-5 w-5" />
                </button>
              </div>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div>
              <label htmlFor="ledger" className="block text-sm font-medium text-black">4. Ledger</label>
              <div className="flex">
                <select
                  id="ledger"
                  {...register('ledger', { required: 'Ledger is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                >
                  <option value="">Select a ledger</option>
                  {ledgers.map(ledger => (
                    <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsLedgerModalOpen(true)}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Book className="h-5 w-5" />
                </button>
              </div>
              {errors.ledger && <p className="mt-1 text-sm text-red-600">{errors.ledger.message}</p>}
            </div>

            <div>
              <label htmlFor="head" className="block text-sm font-medium text-black">5. Head</label>
              <div className="flex">
                <select
                  id="head"
                  {...register('head', { required: 'Head is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                >
                  <option value="">Select a head</option>
                  {heads.map(head => (
                    <option key={head.id} value={head.id}>{head.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsHeadModalOpen(true)}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileText className="h-5 w-5" />
                </button>
              </div>
              {errors.head && <p className="mt-1 text-sm text-red-600">{errors.head.message}</p>}
            </div>

            <div>
              <label htmlFor="cr" className="block text-sm font-medium text-black">6. Cr Amount</label>
              <input
                type="number"
                id="cr"
                step="0.01"
                {...register('cr', { 
                  required: 'Cr Amount is required',
                  min: { value: 0, message: 'Cr Amount must be non-negative' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
              />
              {errors.cr && <p className="mt-1 text-sm text-red-600">{errors.cr.message}</p>}
            </div>

            <div>
              <label htmlFor="dr" className="block text-sm font-medium text-black">7. Dr Amount</label>
              <input
                type="number"
                id="dr"
                step="0.01"
                {...register('dr', { 
                  required: 'Dr Amount is required',
                  min: { value: 0, message: 'Dr Amount must be non-negative' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
              />
              {errors.dr && <p className="mt-1 text-sm text-red-600">{errors.dr.message}</p>}
            </div>

            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-black">8. Mode</label>
              <div className="flex">
                <select
                  id="mode"
                  {...register('mode', { required: 'Mode is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                >
                  <option value="">Select a mode</option>
                  {modes.map(mode => (
                    <option key={mode.id} value={mode.id}>{mode.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsModeModalOpen(true)}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <CreditCard className="h-5 w-5" />
                </button>
              </div>
              {errors.mode && <p className="mt-1 text-sm text-red-600">{errors.mode.message}</p>}
            </div>

            <div>
              <label htmlFor="gst" className="block text-sm font-medium text-black">9. GST</label>
              <select
                id="gst"
                {...register('gst', { required: 'GST is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
              >
                <option value="with_gst">With GST</option>
                <option value="without_gst">Without GST</option>
              </select>
              {errors.gst && <p className="mt-1 text-sm text-red-600">{errors.gst.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black">10. Description</label>
              <textarea
                id="description"
                {...register('description')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                rows={3}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Accounting Entry
            </button>
          </form>
        </div>
      </div>

      <Modal isOpen={isBusinessModalOpen} onClose={() => setIsBusinessModalOpen(false)} title="Add New Business">
        <input
          type="text"
          value={newBusinessName}
          onChange={(e) => setNewBusinessName(e.target.value)}
          placeholder="Enter business name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
        <button
          onClick={handleNewBusiness}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Business
        </button>
      </Modal>

      <Modal isOpen={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)} title="Add New Type">
        <input
          type="text"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="Enter type name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
        <button
          onClick={handleNewType}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Type
        </button>
      </Modal>

      <Modal isOpen={isLedgerModalOpen} onClose={() => setIsLedgerModalOpen(false)} title="Add New Ledger">
        <input
          type="text"
          value={newLedgerName}
          onChange={(e) => setNewLedgerName(e.target.value)}
          placeholder="Enter ledger name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
        <button
          onClick={handleNewLedger}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Ledger
        </button>
      </Modal>

      <Modal isOpen={isHeadModalOpen} onClose={() => setIsHeadModalOpen(false)} title="Add New Head">
        <input
          type="text"
          value={newHeadName}
          onChange={(e) => setNewHeadName(e.target.value)}
          placeholder="Enter head name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
        <button
          onClick={handleNewHead}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Head
        </button>
      </Modal>

      <Modal isOpen={isModeModalOpen} onClose={() => setIsModeModalOpen(false)} title="Add New Mode">
        <input
          type="text"
          value={newModeName}
          onChange={(e) => setNewModeName(e.target.value)}
          placeholder="Enter mode name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
        <button
          onClick={handleNewMode}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Mode
        </button>
      </Modal>
    </div>
  )
}