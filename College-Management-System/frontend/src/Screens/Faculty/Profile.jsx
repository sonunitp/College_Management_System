import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseApiURL } from "../../baseUrl";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
const Profile = (props) => {
  const [showPass, setShowPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [temporary , settemporary] = useState(false);
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { employeeId: router.state.loginid },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          settemporary(router.state.temporary);
          setData(response.data.user);
          dispatch(
            setUserData({
              fullname: `${response.data.user[0].firstName} ${response.data.user[0].middleName} ${response.data.user[0].lastName}`,
              employeeId: response.data.user[0].employeeId,
              _id: response.data.user[0]._id,
            }),
            props.setemployeeid(response.data.user[0].employeeId),
            props.setTemporary(router.state.temporary),
          
          );
        } else {
          toast.error(response.data.message);
        }


      })
      .catch((error) => {
        console.error(error);
      });
  }, [router.state.loginid, router.state.type , router.state.temporary]);
  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/faculty/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .put(
        `${baseApiURL()}/faculty/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-r from-[#27548A] to-[#410445] shadow-xl rounded-lg text-white font-poppins">
      {data && (
        <>
          <div className="flex items-center gap-8">
             <img
               src={process.env.REACT_APP_MEDIA_LINK + "/" + data[0].profile}
               alt="faculty Profile"
               className="h-40 w-40 object-cover rounded-lg shadow-lg"
             />
             <div>
               <h2 className="text-3xl font-bold">Hello, {data.firstName || data[0]?.firstName} {data.middleName || data[0]?.middleName} {data.lastName || data[0]?.lastName} 👋</h2>
               <p className="text-lg mt-2">ID: <span className="font-medium">{data.employeeId || data[0]?.employeeId || data.enrollmentNo}</span></p>
               <p className="text-lg">Phone: <span className="font-medium">+91 {data.phoneNumber || data[0]?.phoneNumber}</span></p>
               <p className="text-lg">Email: <span className="font-medium">{data.email || data[0]?.email}</span></p>
               {data.branch && <p className="text-lg">Branch: <span className="font-medium">{data.branch}</span></p>}
               {data.semester && <p className="text-lg">Semester: <span className="font-medium">{data.semester}</span></p>}
               {data.post && <p className="text-lg">Post: <span className="font-medium">{data.post}</span></p>}
               {data.department && <p className="text-lg">Department: <span className="font-medium">{data.department}</span></p>}
            </div>
            {!temporary ? <>
              <button
              className={`mt-6 px-5 py-2 rounded-lg  text-black font-bold ${showPass ? "bg-white hover:bg-red-300 hover:text-[#7D0A0A]" : "bg-[#E8F9FF] hover:bg-[#410445] hover:text-white"}`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-6 border-t pt-4"
                onSubmit={checkPasswordHandler}
              >
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password.current}
                    onChange={(e) =>
                      setPassword({ ...password, current: e.target.value })
                    }
                    placeholder="Current Password"
                    className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-4 text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="mb-4 relative">
                  <input
                    type={shownewPassword ? "text" : "password"}
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                    placeholder="New Password"
                    className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-4 text-gray-800"
                    onClick={() => setShownewPassword(!shownewPassword)}
                  >
                    {shownewPassword ? "Hide" : "Show"}
                  </button>
                </div>
                
                <button
                  className="w-full bg-[#E8F9FF] text-black font-bold hover:bg-[black] hover:text-white  py-2 rounded-lg transition duration-300"
                  onClick={checkPasswordHandler}
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
              </> : null}
              
            
              
            
          </div>
          
        </>
      )}
    </div>
  );
};

export default Profile;
