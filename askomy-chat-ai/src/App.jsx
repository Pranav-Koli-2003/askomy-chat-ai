import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Askomy_Ai from "./pages/Askomy_Ai";
import Auto_login from "./components/Auto_login";
import RequireAuth from "./components/RequireAuth";
//import "./App.css";
import { ToastContainer, toast } from 'react-toastify';


function App() {
  return (
    
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        
        <Route path="/" element={<Auto_login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Askomy_Ai" element={<RequireAuth><Askomy_Ai /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
