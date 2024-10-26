"use client"

import { useState } from "react"
import { PlusCircleIcon, TrashIcon, HomeIcon, CalendarIcon, UsersIcon, CogIcon } from "@heroicons/react/24/outline"
import toast from "react-hot-toast"

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState({
    id: "",
    name: "",
    category: "",
    date: "",
    location: "",
    participantLimit: 0,
    scoringCriteria: "",
    description: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e) => {
    const value = e.target.value
    setCurrentEvent((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      setEvents((events) =>
        events.map((event) => (event.id === currentEvent.id ? currentEvent : event))
      )
      toast.success("Event updated successfully!")
    } else {
      setEvents((events) => [...events, { ...currentEvent, id: Date.now().toString() }])
      toast.success("Event created successfully!")
    }
    resetForm()
  }

  const resetForm = () => {
    setCurrentEvent({
      id: "",
      name: "",
      category: "",
      date: "",
      location: "",
      participantLimit: 0,
      scoringCriteria: "",
      description: "",
    })
    setIsEditing(false)
  }

  const editEvent = (event) => {
    setCurrentEvent(event)
    setIsEditing(true)
  }

  const deleteEvent = (id) => {
    setEvents((events) => events.filter((event) => event.id !== id))
    toast.success("Event deleted successfully!")
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center py-3 px-6 bg-blue-900 text-white">
            <CalendarIcon className="w-5 h-5 mr-3" />
            Events
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <UsersIcon className="w-5 h-5 mr-3" />
            Participants
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <CogIcon className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Event Management</h2>

        {/* Event Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-800">{isEditing ? "Edit Event" : "Create New Event"}</h3>
          <p className="mb-4 text-blue-600">Enter the details for the event.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-blue-700">Event Name</label>
                <input
                  id="name"
                  name="name"
                  value={currentEvent.name}
                  onChange={handleInputChange}
                  required
                  className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-blue-700">Category</label>
                <select 
                  onChange={handleSelectChange} 
                  value={currentEvent.category} 
                  className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select category</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="fun-sports">Fun Sports</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-blue-700">Date</label>
                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={currentEvent.date}
                  onChange={handleInputChange}
                  required
                  className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-blue-700">Location</label>
                <input
                  id="location"
                  name="location"
                  value={currentEvent.location}
                  onChange={handleInputChange}
                  required
                  className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="participantLimit" className="text-blue-700">Participant Limit</label>
                <input
                  id="participantLimit"
                  name="participantLimit"
                  type="number"
                  value={currentEvent.participantLimit}
                  onChange={handleInputChange}
                  required
                  className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="scoringCriteria" className="text-blue-700">Scoring Criteria</label>
                <input
                  id="scoringCriteria"
                  name="scoringCriteria"
                  value={currentEvent.scoringCriteria}
                  onChange={handleInputChange}
                  className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-blue-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={currentEvent.description}
                onChange={handleInputChange}
                required
                className="border border-blue-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 flex items-center hover:bg-blue-700 transition-colors duration-200">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              {isEditing ? "Update Event" : "Create Event"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="ml-2 border border-blue-300 text-blue-600 rounded-lg p-2 hover:bg-blue-100 transition-colors duration-200">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Events List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-800">Events List</h3>
          <p className="mb-4 text-blue-600">Manage your events here.</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-200 p-2 text-left text-blue-800">Name</th>
                <th className="border border-blue-200 p-2 text-left text-blue-800">Category</th>
                <th className="border border-blue-200 p-2 text-left text-blue-800">Date</th>
                <th className="border border-blue-200 p-2 text-left text-blue-800">Location</th>
                <th className="border border-blue-200 p-2 text-left text-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-blue-50">
                  <td className="border border-blue-200 p-2">{event.name}</td>
                  <td className="border border-blue-200 p-2">{event.category}</td>
                  <td className="border border-blue-200 p-2">{new Date(event.date).toLocaleString()}</td>
                  <td className="border border-blue-200 p-2">{event.location}</td>
                  <td className="border border-blue-200 p-2">
                    <button onClick={() => editEvent(event)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}