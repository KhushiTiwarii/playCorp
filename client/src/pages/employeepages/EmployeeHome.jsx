"use client"

import { useState, useEffect, useContext } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Home, Calendar, Users, Settings } from "lucide-react"
import { authContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function EmployeeEventsPage() {
  const [events, setEvents] = useState([])
  const [userTeams, setUserTeams] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [teamCode, setTeamCode] = useState("")
  const { user } = useContext(authContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
    fetchUserTeams()
  }, [user])

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const eventsData = await response.json()
      setEvents(eventsData)
    } catch (error) {
      toast.error("Error fetching events: " + error.message)
    }
  }

  const fetchUserTeams = async () => {
    if (!user) return
    try {
      const response = await fetch(`http://localhost:5000/api/teams/user/${user}`)
      
      if (!response.ok) throw new Error("Failed to fetch user teams")
      const teamsData = await response.json()
      console.log(teamsData)
      setUserTeams(teamsData)
    } catch (error) {
      toast.error("Error fetching user teams: " + error.message)
    }
  }

  const handleRegisterTeam = async (eventId) => {
    try {
      const generatedTeamCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      console.log("HERRREEE");
      console.log(generatedTeamCode);
      console.log(user);
      console.log(eventId);

      const response = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        
        body: JSON.stringify({
          teamCode: generatedTeamCode,
          teamLeaderId: user,
          eventId: eventId
        }),
      })

      if (!response.ok) throw new Error("Failed to register team")
      const data = await response.json()
      toast.success(`Team Registered Successfully! Your team code is ${data.teamCode}`)
      fetchUserTeams()
    } catch (error) {
      toast.error("Error registering team: " + error.message)
    }
  }

  const handleJoinTeam = (eventId) => {
    setSelectedEventId(eventId)
    setIsModalOpen(true)
  }
  const handleteam=()=>{
    navigate('/myteams')
  }

  const submitTeamCode = async () => {
    if (teamCode.trim() === "") {
      toast.error("Please enter a valid team code")
      return
    }
    try {
      const response = await fetch("http://localhost:5000/api/teams/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ teamCode, userId: user }),
      })

      if (!response.ok) throw new Error("Failed to join team")
      await response.json()
      toast.success(`Successfully joined team with code ${teamCode}`)
      setTeamCode("")
      setIsModalOpen(false)
      fetchUserTeams()
    } catch (error) {
      toast.error("Error joining team: " + error.message)
    }
  }

  const isUserRegisteredForEvent = (eventId) => {
    return userTeams.some(team => team.events.includes(eventId))
  }
  const handledash=()=>{
    navigate("/leaderboard")
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Static Sidebar */}
      <aside className="w-64 bg-blue-800 text-white">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-2xl font-bold">PlayCorp</h1>
        </div>
        <nav className="mt-6">
          <a onClick={handledash} className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Home className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center py-3 px-6 bg-blue-900 text-white">
            <Calendar className="w-5 h-5 mr-3" />
            <span>Events</span>
          </a>
          <a onClick={handleteam} className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Users className="w-5 h-5 mr-3" />
            <span>My Teams</span>
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3" />
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
              !isUserRegisteredForEvent(event._id) && (
                <div key={event._id} className="w-full border border-blue-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-2">{event.name}</h2>
                  <p className="text-blue-600 mb-4">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-blue-700"><strong>Start Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
                    <p className="text-blue-700"><strong>End Date:</strong> {new Date(event.endDate).toLocaleDateString()}</p>
                    <p className="text-blue-700"><strong>Location:</strong> {event.location}</p>
                    <p className="text-blue-700"><strong>Participant Limit:</strong> {event.participantLimit}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={() => handleRegisterTeam(event._id)} 
                      className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-200 flex-1 mr-2"
                    >
                      Register Team
                    </button>
                    <button 
                      onClick={() => handleJoinTeam(event._id)} 
                      className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 hover:bg-blue-200 transition-colors duration-200 flex-1 ml-2"
                    >
                      Join Team
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </main>
      </div>

      {/* Modal for team code input */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-2">Enter Team Code</h3>
            <p className="mb-4">Please enter the team code to join an existing team.</p>
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter team code"
              className="w-full p-2 border border-blue-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={submitTeamCode} 
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-200"
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
