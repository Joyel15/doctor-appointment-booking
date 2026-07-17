import { useState,useEffect } from "react";
import axios from "../../api/axios.js";
import Spinner from "../../components/common/Spinner.jsx";

// Badge colors based on user roles
const roleStyles = {
  patient : "bg-blue-100 text-blue-700",
  doctor: "bg-green-100 text-green-700",
  admin: "bg-red-100 text-red-700",
};

const AllUsers = () => {
 // Stores all users fetched from the backend
 const [users , setUsers] = useState([]);

 // Search input value
 const [search , setSearch] = useState("");

 // Controls loading spinner
 const [loading , setLoading] = useState(true);

 // Stores any error message
 const [error , setError] = useState("");

 // Fetch all users from backend
 const fetchUsers = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await axios.get("/admin/users");

    setUsers(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to load users.Please try again later.");
  } finally {
    setLoading(false);
  }
 };

 // fetch users once the page loads
 useEffect(() => {
  fetchUsers();
 },[]);

 // Remove leading/trailing spaces
 const query = search.trim().toLowerCase();

 // Filters users by name or role
 const filteredUsers = users.filter((user) => {
  const name = user.name?.toLowerCase() || "";
  const role = user.role?.toLowerCase() || "";

  return (
    name.includes(query) ||
    role.includes(query)
  );
 });

 // Loading state
 if(loading){
  return (
    <div className="px-4 py-10">
        <Spinner />
    </div>
  );
 };

 // Error state
 if(error){
   return (
      <div className="px-4 py-10 text-center text-red-500">
        {error}
      </div>
    );
 }
 
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        All Users
      </h1>

      {/* Search input */}
      <div className="max-w-md mb-8">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* No matching users */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
          No users found matching your search.
        </div>
      ) : (
        // User table
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 font-medium">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 font-medium">
                    Phone
                  </th>
                  <th className="text-left px-6 py-3 font-medium">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {user.name}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      {user.email}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      {user.phone || "-"}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          roleStyles[user.role] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;