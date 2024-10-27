'use client'

import React, { useState, useEffect, useContext } from 'react'
import { Trophy, Medal, Award, Users, Home, Calendar, Settings, ChevronDown, ChevronUp, Bell, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { authContext } from '../../context/AuthContext'

const eventIcons = {
  "Carrom": Trophy,
  "Volleyball": Medal,
  "Football": Trophy,
  "Cricket": Award,
  "Table Tennis": Medal,
  "Pool": Trophy,
  "Running": Medal,
}
const fixedScores = [5,3,1]

export default function JudgeDashboard() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [teams, setTeams] = useState({})
  const [leaderboards, setLeaderboards] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [winners, setWinners] = useState({ first: null, second: null, third: null })
  const [expandedLeaderboard, setExpandedLeaderboard] = useState(null)
  const { token } = useContext(authContext)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      fetchTeamsByEvent(selectedEvent)
    }
  }, [selectedEvent])

  useEffect(() => {
    updateLeaderboards()
  }, [teams])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast.error('Failed to fetch events')
    }
  }

  const fetchTeamsByEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch teams')
      const data = await response.json()
      setTeams(prevTeams => ({ ...prevTeams, [eventId]: data }))
    } catch (error) {
      toast.error('Failed to fetch teams for this event')
    }
  }

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

  const handleAssignWinners = async () => {
    if (!winners.first || !winners.second || !winners.third) {
      toast.error('Please select all three winners before assigning.')
      return
    }

    try {
      const winnerScores = {
        [winners.first]: 5,
        [winners.second]: 3,
        [winners.third]: 1
      }

      const updatedTeams = { ...teams }
      const promises = []

      for (const [teamId, score] of Object.entries(winnerScores)) {
        const team = updatedTeams[selectedEvent].find(t => t._id === teamId)
        if (team) {
          team.score += score
          for (const memberId of team.members) {
            promises.push(updateUserPoints(memberId, score))
          }
        }
      }

      await Promise.all(promises)

      setTeams(updatedTeams)
      updateLeaderboards()
      toast.success('Winners assigned and points updated successfully!')
      setIsDialogOpen(false)
      
      // Refresh the teams data for the current event
      await fetchTeamsByEvent(selectedEvent)
    } catch (error) {
      toast.error('Failed to assign winners and update points')
    }
  }

  const updateUserPoints = async (userId, points) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, points })
      })

      if (!response.ok) throw new Error('Failed to update user points')
    } catch (error) {
      throw new Error('Failed to update user points')
    }
  }

  const toggleLeaderboard = (eventId) => {
    setExpandedLeaderboard(expandedLeaderboard === eventId ? null : eventId)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black/90 to-blue-600">
      {/* Sidebar with glassmorphism effect */}
      <div className="w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-r border-white border-opacity-20 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Judge Dashboard</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center py-3 px-6 bg-white bg-opacity-20 text-white">
            <Calendar className="w-5 h-5 mr-3" />
            Events
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
            <Users className="w-5 h-5 mr-3" />
            Teams
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-blue-100 hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Good morning, Judge!</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-white bg-opacity-20 rounded-full shadow-lg">
                <Bell className="text-white" />
              </button>
              <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => {
              const EventIcon = eventIcons[event.name] || Trophy
              return (
                <div key={event._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold flex items-center mb-4 text-white">
                    <EventIcon className="mr-2 h-5 w-5" />
                    {event.name}
                  </h3>
                  <button
                    onClick={() => handleEventClick(event._id)}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors duration-200 py-2 px-4 rounded-xl font-semibold"
                  >
                    Judge Event
                  </button>
                </div>
              )
            })}
          </div>

          {/* Event Leaderboards */}
          <div className="space-y-6">
            {events.map((event) => {
              const EventIcon = eventIcons[event.name] || Trophy
              return (
                <div key={event._id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden">
                  <div 
                    className="bg-white bg-opacity-20 text-white p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleLeaderboard(event._id)}
                  >
                    <h3 className="text-xl font-semibold flex items-center">
                      <EventIcon className="mr-2 h-5 w-5" />
                      {event.name} Leaderboard
                    </h3>
                    {expandedLeaderboard === event._id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                  {expandedLeaderboard === event._id && (
                    <div className="p-4">
                      <table className="w-full text-white">
                        <thead>
                          <tr className="text-left text-white">
                            <th className="p-2">Rank</th>
                            <th className="p-2">Team</th>
                            <th className="p-2">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboards[event._id]?.map((team, index) => (
                            <tr key={team._id} className="border-t border-white border-opacity-20">
                              <td className="p-2">{index + 1}</td>
                              <td className="p-2">{team.teamCode}</td>
                              <td className="p-2">{fixedScores[index] || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dialog with glassmorphism effect */}
      {isDialogOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-filter backdrop-blur-sm">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-white border-opacity-20">
            <div className="p-6 border-b border-white border-opacity-20">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{events.find(e => e._id === selectedEvent)?.name} - Teams</h2>
                <button 
                  onClick={() => setIsDialogOpen(false)} 
                  className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full text-white">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Team</th>
                    <th className="p-2">Team Code</th>
                    <th className="p-2">Current Score</th>
                    <th className="p-2">Select Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {teams[selectedEvent]?.map((team) => (
                    <tr key={team._id} className="border-t border-white border-opacity-20">
                      <td className="p-2">{team.teamName}</td>
                      <td className="p-2">{team.teamCode}</td>
                      <td className="p-2">{team.score || 0}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleSelectWinner('first', team._id)} 
                            className={`py-1 px-3 rounded-full transition-all duration-200 ${winners.first === team._id ? 'bg-yellow-400 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
                          >
                            1st
                          </button>
                          <button 
                            onClick={() => handleSelectWinner('second', team._id)} 
                            className={`py-1 px-3 rounded-full transition-all duration-200 ${winners.second === team._id ? 'bg-gray-400 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
                          >
                            2nd
                          </button>
                          <button 
                            onClick={() => handleSelectWinner('third', team._id)} 
                            className={`py-1 px-3 rounded-full transition-all duration-200 ${winners.third  === team._id ? 'bg-yellow-600 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
                          >
                            3rd
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleAssignWinners}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors duration-200 py-2 px-6 rounded-xl font-semibold"
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