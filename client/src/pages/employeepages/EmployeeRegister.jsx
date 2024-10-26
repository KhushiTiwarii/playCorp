"use client"

import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"

export default function SimplifiedEmployeeDashboard() {
  const [teamName, setTeamName] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("")
  const [uniqueCode, setUniqueCode] = useState("")
  const [events, setEvents] = useState([])
  const [teamSize, setTeamSize] = useState(1)
  const [teamLeader, setTeamLeader] = useState({ name: "", email: "" })

  useEffect(() => {
    // Simulate fetching events from an API
    const fetchEvents = async () => {
      // In a real application, replace this with an actual API call
      const mockEvents = [
        { id: "1", name: "Corporate Volleyball Tournament", category: "Outdoor", maxTeamSize: 6 },
        { id: "2", name: "Office Chess Championship", category: "Indoor", maxTeamSize: 1 },
        { id: "3", name: "Annual 5K Run", category: "Fun Sports", maxTeamSize: 5 },
      ]
      setEvents(mockEvents)
    }

    fetchEvents()
    generateUniqueCode()
  }, [])

  const generateUniqueCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setUniqueCode(code)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // In a real application, you would send this data to your backend
    const teamData = {
      uniqueCode,
      teamName,
      eventId: selectedEvent,
      teamLeader,
      teamSize,
    }

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show a success message using React Hot Toast
    toast.success(`Team "${teamName}" has been successfully registered for the event.`, {
      duration: 5000,
      position: "top-center",
    })

    // Reset the form
    setTeamName("")
    setSelectedEvent("")
    setTeamSize(1)
    setTeamLeader({ name: "", email: "" })
    generateUniqueCode()
  }

  const selectedEventDetails = events.find(event => event.id === selectedEvent)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Team Registration</h2>
          <p className="text-gray-600">Register your team for an upcoming event</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="uniqueCode" className="block text-sm font-medium text-gray-700">Unique Code</label>
              <input
                id="uniqueCode"
                type="text"
                value={uniqueCode}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., The Strategists"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="event" className="block text-sm font-medium text-gray-700">Event Selection</label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.category}) - Max {event.maxTeamSize} members
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Team Leader</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={teamLeader.name}
                  onChange={(e) => setTeamLeader({...teamLeader, name: e.target.value})}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={teamLeader.email}
                  onChange={(e) => setTeamLeader({...teamLeader, email: e.target.value})}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">Team Size</label>
              <input
                id="teamSize"
                type="number"
                min="1"
                max={selectedEventDetails ? selectedEventDetails.maxTeamSize : 1}
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        </div>
        <div className="px-6 py-3 bg-gray-50 text-right">
          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register Team
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}