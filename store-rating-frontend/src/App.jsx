import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StoreDashboard from "./pages/StoreDashboard";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/store/dashboard" element={<StoreDashboard />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
