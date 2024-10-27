"use client";

import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const localizer = momentLocalizer(moment);

export default function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [events, setEvents] = useState([]);
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
    fetchEvents();
    fetchTeamData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/board");
      if (!response.ok) throw new Error("Failed to fetch leaderboard data");
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      console.log(data);
      
      // Convert event dates to JavaScript Date objects
      const formattedEvents = data.map(event => ({
        title: event.name,
        start: moment(event.startDate).toDate(), // Convert to Date object
        end: moment(event.endDate).toDate(),     // Convert to Date object
        allDay: false,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchTeamData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teams");
      if (!response.ok) throw new Error("Failed to fetch team data");
      const data = await response.json();
      setTeamData(data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  }

  const leaderboardChartData = {
    labels: leaderboardData.map(user => user.email),
    datasets: [
      {
        label: "User Points",
        data: leaderboardData.map(user => user.points),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const teamSizeChartData = {
    labels: teamData.map(team => team.teamCode),
    datasets: [
      {
        label: "Team Size",
        data: teamData.map(team => team.members.length),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
          <Bar data={leaderboardChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Team Sizes</h2>
          <Line data={teamSizeChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Event Calendar</h2>
        <div style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={events} // Use the formatted events directly
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.slice(0, 5).map((user, index) => (
              <tr key={user._id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
