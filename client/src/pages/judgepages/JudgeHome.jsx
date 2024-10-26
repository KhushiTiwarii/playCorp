'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Users, BarChart2, Home, Calendar, Settings, ChevronDown, ChevronUp } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const mockEvents = [
  { id: 1, name: "Carrom", icon: Trophy },
  { id: 2, name: "Volleyball", icon: Medal },
  { id: 3, name: "Football", icon: Trophy },
  { id: 4, name: "Cricket", icon: Award },
  { id: 5, name: "Table Tennis", icon: Medal },
  { id: 6, name: "Pool", icon: Trophy },
  { id: 7, name: "Running", icon: Medal },
]

const mockTeams = mockEvents.reduce((acc, event) => {
  acc[event.id] = Array(5).fill().map((_, index) => ({
    id: `${event.id}-${index + 1}`,
    name: `Team ${index + 1}`,
    score: 0
  }))
  return acc
}, {})

export default function JudgeDashboard() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [teams, setTeams] = useState(mockTeams)
  const [leaderboards, setLeaderboards] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [winners, setWinners] = useState({ first: null, second: null, third: null })
  const [expandedLeaderboard, setExpandedLeaderboard] = useState(null)

  useEffect(() => {
    updateLeaderboards()
  }, [teams])

  const updateLeaderboards = () => {
    const newLeaderboards = {}
    Object.entries(teams).forEach(([eventId, eventTeams]) => {
      const sortedTeams = [...eventTeams].sort((a, b) => b.score - a.score)
      newLeaderboards[eventId] = sortedTeams.slice(0, 5) // Show top 5 teams for each event
    })
    setLeaderboards(newLeaderboards)
  }

  const handleEventClick = (eventId) => {
    setSelectedEvent(eventId)
    setIsDialogOpen(true)
    setWinners({ first: null, second: null, third: null })
  }

  const handleSelectWinner = (place, teamId) => {
    setWinners(prev => {
      const updatedWinners = Object.entries(prev).reduce((acc, [key, value]) => {
        acc[key] = value === teamId ? null : value
        return acc
      }, {})
      return { ...updatedWinners, [place]: teamId }
    })
  }

  const handleAssignWinners = () => {
    if (!winners.first || !winners.second || !winners.third) {
      toast.error('Please select all three winners before assigning.')
      return
    }

    const updatedTeams = { ...teams }
    updatedTeams[selectedEvent] = updatedTeams[selectedEvent].map(team => {
      if (team.id === winners.first) return { ...team, score: team.score + 5 }
      if (team.id === winners.second) return { ...team, score: team.score + 3 }
      if (team.id === winners.third) return { ...team, score: team.score + 1 }
      return team
    })

    setTeams(updatedTeams)
    toast.success('Winners assigned successfully!')
    setIsDialogOpen(false)
  }

  const toggleLeaderboard = (eventId) => {
    setExpandedLeaderboard(expandedLeaderboard === eventId ? null : eventId)
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Judge Dashboard</h1>
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
            Teams
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Event Judging</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg">
              <div className="bg-blue-700 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold flex items-center">
                  <event.icon className="mr-2 h-5 w-5" />
                  {event.name}
                </h3>
              </div>
              <div className="p-4">
                <button
                  onClick={() => handleEventClick(event.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 py-2 px-4 rounded"
                >
                  Judge Event
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Event Leaderboards */}
        <div className="mt-8 space-y-4">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg">
              <div 
                className="bg-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center cursor-pointer"
                onClick={() => toggleLeaderboard(event.id)}
              >
                <h3 className="text-xl font-semibold flex items-center">
                  <event.icon className="mr-2 h-5 w-5" />
                  {event.name} Leaderboard
                </h3>
                {expandedLeaderboard === event.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              {expandedLeaderboard === event.id && (
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="text-left p-2 text-blue-800">Rank</th>
                        <th className="text-left p-2 text-blue-800">Team</th>
                        <th className="text-left p-2 text-blue-800">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboards[event.id]?.map((team, index) => (
                        <tr key={team.id} className="hover:bg-blue-50">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{team.name}</td>
                          <td className="p-2">{team.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold">{mockEvents.find(e => e.id === selectedEvent)?.name} - Teams</h2>
              <button 
                onClick={() => setIsDialogOpen(false)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="text-left p-2 text-blue-800">Team</th>
                    <th className="text-left p-2 text-blue-800">Current Score</th>
                    <th className="text-left p-2 text-blue-800">Select Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {teams[selectedEvent].map((team) => (
                    <tr key={team.id} className="hover:bg-blue-50">
                      <td className="p-2">{team.name}</td>
                      <td className="p-2">{team.score}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleSelectWinner('first', team.id)} 
                            className={`py-1 px-2 rounded ${winners.first === team.id ? 'bg-gold text-white' : 'bg-gray-200 text-gray-800'}`}
                          >
                            1st
                          </button>
                          <button 
                            onClick={() => handleSelectWinner('second', team.id)} 
                            className={`py-1 px-2 rounded ${winners.second === team.id ? 'bg-silver text-white' : 'bg-gray-200 text-gray-800'}`}
                          >
                            2nd
                          </button>
                          <button 
                            onClick={() => handleSelectWinner('third', team.id)} 
                            className={`py-1 px-2 rounded ${winners.third === team.id ? 'bg-bronze text-white' : 'bg-gray-200 text-gray-800'}`}
                          >
                            3rd
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleAssignWinners}
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 py-2 px-4 rounded"
                >
                  Assign Winners
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}