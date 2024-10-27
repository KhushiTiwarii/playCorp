"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { authContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import html2canvas from 'html2canvas';

export default function EmployeeTeams() {
  const { user } = useContext(authContext);
  const userId = user;
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventNames, setEventNames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [participantNames, setParticipantNames] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const certificateRef = useRef(null);

  const fetchTeams = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/teams/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user teams");

      const teamsData = await response.json();
      setTeams(teamsData);
      fetchEventNames(teamsData);
    } catch (error) {
      toast.error("Error fetching user teams: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventNames = async (teams) => {
    const newEventNames = {};

    try {
      const fetchPromises = teams.flatMap((team) =>
        team.events.map(async (eventId) => {
          const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
          if (res.ok) {
            const eventData = await res.json();
            newEventNames[eventId] = eventData.name;
          } else {
            console.error(`Failed to fetch event: ${eventId}`);
          }
        })
      );

      await Promise.all(fetchPromises);
      setEventNames(newEventNames);
    } catch (error) {
      console.error("Error fetching event names:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchTeams();
  }, [userId]);

  const handlePrintCertificate = (team) => {
    setCurrentTeam(team);
    setParticipantNames(team.members.map(() => ""));
    setIsModalOpen(true);
  };

  const handleNameChange = (index, value) => {
    const newNames = [...participantNames];
    newNames[index] = value;
    setParticipantNames(newNames);
  };

  const handleGenerateCertificate = () => {
    setShowPreview(true);
  };

  const handleDownload = async (name) => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current);
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${name}_certificate.png`;
      link.click();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowPreview(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading teams...</p>
      </div>
    );
  }

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
              <button
                onClick={() => handlePrintCertificate(team)}
                className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
              >
                Print Certificate
              </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full h-3/4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Enter Participant Names</h2>
            {currentTeam && (
              <div className="space-y-4">
                {currentTeam.members.map((member, index) => (
                  <div key={member._id} className="space-y-2">
                    <label htmlFor={`name-${index}`} className="block font-medium">Participant {index + 1}</label>
                    <input
                      id={`name-${index}`}
                      value={participantNames[index]}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={`Enter name for ${member.email}`}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleGenerateCertificate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Generate Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 px-4 py-2 bg-gray-200 rounded-lg"
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">Certificate Preview</h2>
            {participantNames.map((name, index) => (
              <div key={index} className="mb-4">
                <div ref={certificateRef} className="relative w-full aspect-[16/9] bg-gradient-to-br from-blue-100 to-blue-50 p-8">
                  <div className="absolute inset-0 border-[16px] border-blue-200 m-4"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between items-center text-center">
                    <div>
                      <h2 className="text-3xl font-bold text-blue-800 mb-2">Certificate of Participation</h2>
                      <p className="text-xl text-blue-600">This certifies that</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 my-4">
                      {name}
                    </div>
                    <div>
                      <p className="text-xl text-blue-600 mb-2">has successfully participated in the</p>
                      <p className="text-2xl font-semibold text-blue-800 mb-4">
                        {currentTeam && eventNames[currentTeam.events[0]]}
                      </p>
                      <p className="text-lg text-blue-700">as part of Team {currentTeam && currentTeam.teamCode}</p>
                      <p className="text-lg text-blue-700 mt-2">Awarded on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="mt-8 flex justify-between w-full">
                      <div className="text-blue-800">
                        <div className="w-40 h-px bg-blue-800 mb-2"></div>
                        <p>Tournament Coordinator</p>
                      </div>
                      <div className="text-blue-800">
                        <div className="w-40 h-px bg-blue-800 mb-2"></div>
                        <p>Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => handleDownload(participantNames[0])} // Assuming you want to download the first participant's certificate
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Download Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
