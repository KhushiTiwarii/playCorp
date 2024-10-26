import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { authContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function EmployeeTeams() {
  const { user } = useContext(authContext);
  const userId = user; // Ensure correct user ID access
  const [teams, setTeams] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);
  const [eventNames, setEventNames] = useState({}); // Store event names by ID

  // Fetch teams data for the logged-in user
  const fetchTeams = async () => {
    if (!userId) return; // Guard clause for missing user ID

    try {
      const response = await fetch(`http://localhost:5000/api/teams/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user teams");

      const teamsData = await response.json();
      console.log(teamsData); // Log data to inspect

      setTeams(teamsData); // Correctly set teams state
      fetchEventNames(teamsData); // Fetch event names for each team
    } catch (error) {
      toast.error("Error fetching user teams: " + error.message);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  // Fetch event names for all teams
  const fetchEventNames = async (teams) => {
    const newEventNames = {}; // Temporary object to store event names

    try {
      // Fetch event name for each event ID present in the teams data
      const fetchPromises = teams.map((team) =>
        team.events.map(async (eventId) => {
          const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
          if (res.ok) {
            const eventData = await res.json();
            newEventNames[eventId] = eventData.name; // Store the event name
          } else {
            console.error(`Failed to fetch event: ${eventId}`);
          }
        })
      );

      // Wait for all fetches to complete
      await Promise.all(fetchPromises.flat());
      setEventNames(newEventNames); // Set state with fetched event names
    } catch (error) {
      console.error("Error fetching event names:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchTeams();
  }, [userId]);

  // Show loading message while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading teams...</p>
      </div>
    );
  }

  // Render team details or show 'No teams found' message
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        My Teams
      </h1>
      {Array.isArray(teams) && teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                Team Code: {team.teamCode}
              </h2>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-600">Members:</h3>
                <ul className="list-disc pl-6">
                  {team.members.map((member) => (
                    <li key={member._id} className="text-gray-700">
                      {member.email}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-blue-600 mt-4">Event</h3>
                <ul className="list-disc pl-6">
                  {team.events.map((eventId) => (
                    <div key={eventId} className="text-gray-700">
                      {eventNames[eventId] || "Loading..."}
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl font-semibold text-gray-700">
            No teams found
          </p>
        </div>
      )}
    </div>
  );
}
