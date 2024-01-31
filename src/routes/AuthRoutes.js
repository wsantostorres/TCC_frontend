import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import HomeStudent from '../pages/Home/HomeStudent';
import HomeServer from '../pages/Home/HomeServer';
import Resume from '../pages/Resume/Resume';
import Post from "../pages/Post/Post";

const AuthRoutes = () => {

  const { bondType } = useAuth(); 

  return (
    <Routes>
        {bondType === "Aluno" && (
          <>
            <Route path="/" element={<HomeStudent />} />
            <Route path="/curriculo" element={<Resume />} />
          </>
        )}
        {bondType === "Servidor" && (
          <>
            <Route path="/" element={<HomeServer />} />
            <Route path="/publicacao" element={<Post />} />
            <Route path="/publicacao/:id" element={<Post />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AuthRoutes;