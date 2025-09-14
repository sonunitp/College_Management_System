import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../../baseUrl";
import { useSelector } from "react-redux";
import { saveOfflineAttendanceChange,getOfflineAttendanceChanges,clearOfflineAttendanceChanges } from "../../../components/indexedDB";


const FacultyAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const facultyId = useSelector((state) => state.userData?._id) || "";

  useEffect(() => {
    if (facultyId) fetchSubjects();
  }, [facultyId]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) syncOfflineAttendance();
  }, [isOnline]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApiURL()}/faculty/details/getFacultySubjects/${facultyId}`);
      
      if (response.data.success) {
        setSubjects(response.data.subjects);
      } else {
        toast.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error fetching subjects");
    }
  };

  const fetchStudents = async (subjectId) => {
    if (!subjectId) {
      setStudents([]);
      setAttendance({});
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseApiURL()}/student/details/getStudentsBySubject/${subjectId}`
      );
  
      if (response.data.success && response.data.students.length > 0) {
        const fetchedStudents = response.data.students;
  
        // Set local UI state
        setStudents(fetchedStudents);
        setAttendance(
          fetchedStudents.reduce((acc, student) => {
            acc[student._id] = "absent";
            return acc;
          }, {})
        );
  
        // Automatically mark all students as absent in DB
        const date = new Date().toISOString().split("T")[0];
        for (const student of fetchedStudents) {
          const attendanceData = {
            studentId: student._id,
            subjectId,
            date,
            status: "absent",
            recordedBy: facultyId,
          };
  
          if (isOnline) {
            try {
              await axios.post(`${baseApiURL()}/attendance/mark`, { attendanceData });
            } catch (err) {
              console.error(`Failed to mark absent for ${student._id}`, err);
            }
          } else {
            try {
              await saveOfflineAttendanceChange(attendanceData);
            } catch (err) {
              console.error(`Failed to save offline attendance for ${student._id}`, err);
            }
          }
        }
  
        toast.success("All students marked absent.");
      } else {
        setStudents([]);
        setAttendance({});
        toast.error("No students found for this subject");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };
  

const markAttendance = async (studentId, newStatus) => {
  const prevStatus = attendance[studentId];
  setAttendance((prev) => ({ ...prev, [studentId]: newStatus }));

  const date = new Date().toISOString().split("T")[0];
  const attendanceData = {
    studentId,
    subjectId: selectedSubject,
    date,
    status: newStatus,
    recordedBy: facultyId,
  };

  if (isOnline) {
    try {
      await axios.post(`${baseApiURL()}/attendance/mark`, { attendanceData });
      toast.success(`Marked ${newStatus} for student.`);
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
      setAttendance((prev) => ({ ...prev, [studentId]: prevStatus }));
    }
  } else {
    try {
      await saveOfflineAttendanceChange(attendanceData);
      toast.success("Attendance saved offline. It will sync when online.");
    } catch (error) {
      console.error("Error saving offline attendance:", error);
      toast.error("Failed to save offline attendance");
    }
  }
};

  const syncOfflineAttendance = async () => {
    try {
      const pendingAttendance = await getOfflineAttendanceChanges();
  
      if (!pendingAttendance.length) {
        console.log("No offline attendance records to sync.");
        return;
      }
  
      console.log("Syncing offline attendance:", pendingAttendance);
  
      for (const record of pendingAttendance) {
        try {
          await axios.post(`${baseApiURL()}/attendance/mark`, {
            attendanceData: record,
          });
          toast.success("Offline attendance synced successfully!");
        } catch (error) {
          console.error("Error syncing record:", error);
          toast.error("Failed to sync some offline attendance records.");
        }
      }
  
      await clearOfflineAttendanceChanges();
    } catch (err) {
      console.error("Error syncing offline attendance:", err);
      toast.error("Error during offline sync");
    }
  };

  return (
    <div className="w-[70%] mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

      <div className="mb-4">
        <span
          className={`p-2 rounded text-white ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <select
        className="w-full p-2 border rounded"
        value={selectedSubject}
        onChange={(e) => {
          const subjectId = e.target.value;
          setSelectedSubject(subjectId);
          fetchStudents(subjectId);
        }}
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject._id} value={subject._id}>
            {subject.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-600">No students found.</p>
      ) : (
        <div className="mt-4 bg-blue-50 p-6 rounded-lg shadow-md">
          {students.map((student) => (
            <div key={student._id} className="flex justify-between items-center py-2">
              <span className="text-lg">{`${student.enrollmentNo} | ${student.firstName} ${student.middleName} ${student.lastName}`}</span>

              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    attendance[student._id] === "present"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => markAttendance(student._id, "present")}
                >
                  Present
                </button>

                <button
                  className={`px-4 py-2 rounded-lg ${
                    attendance[student._id] === "absent"
                      ? "bg-red-500 text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => markAttendance(student._id, "absent")}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;