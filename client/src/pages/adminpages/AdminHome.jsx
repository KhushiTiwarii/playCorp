"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Home, Calendar, Users, Settings } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState({

    name: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    participantLimit: 0,
    description: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast.error("Failed to fetch events: " + error.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e) => {
    setCurrentEvent((prev) => ({ ...prev, category: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = isEditing ? `http://localhost:5000/api/events/${currentEvent._id}` : "http://localhost:5000/api/events"
      const method = isEditing ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEvent),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save event")
      }
      await fetchEvents()
      toast.success(isEditing ? "Event updated successfully!" : "Event created successfully!")
      resetForm()
    } catch (error) {
      toast.error("Failed to save event: " + error.message)
    }
  }

  const resetForm = () => {
    setCurrentEvent({
      name: "",
      category: "",
      startDate: "",
      endDate: "",
      location: "",
      participantLimit: 0,
      description: "",
    })
    setIsEditing(false)
  }

  const editEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`)
      if (!response.ok) throw new Error("Failed to fetch event")
      const eventData = await response.json()
      setCurrentEvent(eventData)
      setIsEditing(true)
    } catch (error) {
      toast.error("Failed to load event for editing: " + error.message)
    }
  }

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete event")
      await fetchEvents()
      toast.success("Event deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete event: " + error.message)
    }
  }

  return (
    <div className="flex h-screen bg-blue-50">
      <Toaster />
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center py-3 px-6 bg-blue-900 text-white">
            <Calendar className="w-5 h-5 mr-3" />
            Events
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Users className="w-5 h-5 mr-3" />
            Participants
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Event Management</h2>

        {/* Event Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">{isEditing ? "Edit Event" : "Create New Event"}</h3>
          <p className="mb-4 text-blue-600">Enter the details for the event.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Event Name</label>
                <input
                  id="name"
                  name="name"
                  value={currentEvent.name}
                  onChange={handleInputChange}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                <select onChange={handleSelectChange} value={currentEvent.category} className="border rounded p-2 w-full">
                  <option value="">Select category</option>
                  <option value="Technical">Technical</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Fun Sports">Fun Sports</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={currentEvent.startDate}
                  onChange={handleInputChange}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={currentEvent.endDate}
                  onChange={handleInputChange}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                <input
                  id="location"
                  name="location"
                  value={currentEvent.location}
                  onChange={handleInputChange}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="participantLimit" className="text-sm font-medium text-gray-700">Participant Limit</label>
                <input
                  id="participantLimit"
                  name="participantLimit"
                  type="number"
                  value={currentEvent.participantLimit}
                  onChange={handleInputChange}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={currentEvent.description}
                onChange={handleInputChange}
                required
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {isEditing ? "Update Event" : "Create Event"}
                <PlusCircle className="w-4 h-4 inline-block ml-1" />
              </button>
              {isEditing && (
                <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Events Table */}
        <div className="overflow-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left">Event Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Start Date</th>
                <th className="py-3 px-6 text-left">End Date</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6">{event.name}</td>
                  <td className="py-4 px-6">{event.category}</td>
                  <td className="py-4 px-6">{new Date(event.startDate).toLocaleString()}</td>
                  <td className="py-4 px-6">{new Date(event.endDate).toLocaleString()}</td>
                  <td className="py-4 px-6">{event.location}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    <button onClick={() => editEvent(event._id)} className="text-blue-500 hover:text-blue-700">
                      Edit
                    </button>
                    <button onClick={() => deleteEvent(event._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4 inline-block" />
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