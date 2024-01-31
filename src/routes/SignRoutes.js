// React-Router-Dom
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from '../pages/Login/Login';

const SignRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default SignRoutes;