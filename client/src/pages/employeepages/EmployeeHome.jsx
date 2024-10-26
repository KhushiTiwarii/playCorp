"use client"

import { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { HomeIcon, CalendarIcon, UserGroupIcon, CogIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

export default function EmployeeEventsPage() {
  const [events, setEvents] = useState([])
  const [teamCode, setTeamCode] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate fetching events from an API
    const fetchEvents = async () => {
      const mockEvents = [
        { id: "1", name: "Carrom Tournament", description: "Annual carrom championship", date: "2024-07-15", maxTeamSize: 2, registrationDeadline: "2024-07-01" },
        { id: "2", name: "Table Tennis League", description: "Monthly table tennis competition", date: "2024-06-20", maxTeamSize: 1, registrationDeadline: "2024-06-10" },
        { id: "3", name: "Chess Masters", description: "Strategic chess tournament", date: "2024-08-05", maxTeamSize: 1, registrationDeadline: "2024-07-25" },
        { id: "4", name: "Volleyball Cup", description: "Inter-department volleyball tournament", date: "2024-09-10", maxTeamSize: 6, registrationDeadline: "2024-08-20" },
        { id: "5", name: "Badminton Doubles", description: "Exciting badminton doubles event", date: "2024-07-30", maxTeamSize: 2, registrationDeadline: "2024-07-15" },
      ]
      setEvents(mockEvents)
    }

    fetchEvents()
  }, [])

  const handleRegisterTeam = (eventId) => {
    navigate('/employeeRegister')
    toast.success(`Navigating to team registration for event ${eventId}`)
  }

  const handleJoinTeam = (eventId) => {
    setSelectedEventId(eventId)
    setIsModalOpen(true)
  }

  const submitTeamCode = () => {
    if (teamCode.trim() === "") {
      toast.error("Please enter a valid team code")
      return
    }
    toast.success(`Joining team for event ${selectedEventId} with code ${teamCode}`)
    setTeamCode("")
    setIsModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Static Sidebar */}
      <aside className="w-64 bg-blue-800 text-white">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Employee Portal</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <HomeIcon className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center py-3 px-6 bg-blue-900 text-white">
            <CalendarIcon className="w-5 h-5 mr-3" />
            <span>Events</span>
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <UserGroupIcon className="w-5 h-5 mr-3" />
            <span>My Teams</span>
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <CogIcon className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-3xl font-bold text-blue-900">Upcoming Events</h1>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="w-full border border-blue-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">{event.name}</h2>
                <p className="text-blue-600 mb-4">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-blue-700"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-blue-700"><strong>Max Team Size:</strong> {event.maxTeamSize}</p>
                  <p className="text-blue-700"><strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleRegisterTeam(event.id)} 
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-200 flex-1 mr-2"
                  >
                    Register Team
                  </button>
                  <button 
                    onClick={() => handleJoinTeam(event.id)} 
                    className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 hover:bg-blue-200 transition-colors duration-200 flex-1 ml-2"
                  >
                    Join Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal for team code input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Enter Team Code</h2>
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter team code"
              className="w-full p-2 border border-blue-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                Cancel
              </button>
              <button
                onClick={submitTeamCode}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}