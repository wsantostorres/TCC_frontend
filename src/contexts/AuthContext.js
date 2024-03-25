import { createContext, useContext, useState, useEffect } from 'react';

import { useFetchUsers } from '../hooks/useFetchUsers';
import { useFetchSuap } from '../hooks/useFetchSuap';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

  // funções hooks
  const { getDataUserSimt, register} = useFetchUsers();
  const { authenticationSuap, getDataUserSuap, verifyToken, refreshToken } = useFetchSuap();
  
  // states
  const [tokenSuap, setTokenSuap] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [bondType, setBondType] = useState();
  const [courseId, setCourseId] = useState();
  const [courseName, setCourseName] = useState();
  const [resumeId, setResumeId] = useState(null);
  const [studentVacancies, setStudentVacancies] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();

  const login = async (registration, password) => {
    setLoading(true)
    
    const data = {
        "username":registration,
        "password":password
    }

    let responseAuthentication;
    let dataUserSuap;
    let tokenApiSuap;
    let responseDataSimt;

    // autenticação suap
    try{
      responseAuthentication = await authenticationSuap(data)
      tokenApiSuap = await responseAuthentication.json();

      if(responseAuthentication.status === 401){
        setError("Credenciais inválidas.")
        setLoading(false)
        return;
      }

      if(responseAuthentication.status !== 200 && responseAuthentication.status !== 401){
        setError("Ocorreu um erro.")
        setLoading(false)
        return;
      }
      
    }catch(err){
      setError("Não foi possível estabelecer conexão com o servidor.")
      setLoading(false)
      return;
    }

    try {

      // pegando dados do suap
      dataUserSuap = await getDataUserSuap(tokenApiSuap.access);

      // impedindo usuários sem vínculo de logar
      if(dataUserSuap.bondType === "Nenhum"){
        setError("Você não possui mais vínculo com o instituto")
        setLoading(false)
        return;
      }

      // pegando dados do aluno/servidor se ele tiver cadastrado ou a id presente no token do SUAP
      responseDataSimt = await getDataUserSimt(tokenApiSuap.access, "Servidor");

      if(responseDataSimt.status === 401){
        setError("Você não é autorizado.")
        setLoading(false)
        return;
      }
  
      responseDataSimt = await responseDataSimt.json();
      
      // cadastrando e setando states do usuário
      if(responseDataSimt.created === false){

        const data = {
          "id": responseDataSimt.id,
          "registration": dataUserSuap.registration,
          "fullName": dataUserSuap.fullName,
          "bondType": dataUserSuap.bondType,
          "course": dataUserSuap.course
        }

        const userCreated = await register(data)

        localStorage.setItem("tokenSUAP", JSON.stringify(tokenApiSuap))
        setTokenSuap(tokenApiSuap)
        setId(userCreated.id)
        setName(userCreated.fullName)
        setBondType(userCreated.bondType)
        setCourseId(userCreated.courseId)
        setCourseName(userCreated.courseName)
        
      }else{

        localStorage.setItem("tokenSUAP", JSON.stringify(tokenApiSuap))
        setTokenSuap(tokenApiSuap)
        setId(responseDataSimt.id)
        setName(responseDataSimt.fullName)
        setBondType(responseDataSimt.bondType)
        setCourseId(responseDataSimt.courseId)
        setCourseName(responseDataSimt.courseName)
        setResumeId(responseDataSimt.resumeId)
        setStudentVacancies(responseDataSimt.vacanciesIds)

      }

    } catch (error) {
      setError("Não foi possível estabelecer conexão com o servidor.")
      setLoading(false)
      return;
    }

    setLoading(false)
  }

  const logout = () => {
    localStorage.clear();
    setTokenSuap("")
    setId("")
    setName("")
    setBondType("")
    setCourseId(null)
    setCourseName("")
    setResumeId(null)
    setStudentVacancies(null)
    setError("")
    window.history.pushState("", "", "/");
  }

  useEffect(() => {
    const tokenSuapStoraged = JSON.parse(localStorage.getItem('tokenSUAP'));

    if(tokenSuapStoraged){
        (async () => {
          setLoading(true)

            try {
            
              const statusVerifyToken = await verifyToken(tokenSuapStoraged.access);

              if(statusVerifyToken === 200){
                const dataUserSuap = await getDataUserSuap(tokenSuapStoraged.access);
                const requestUserSIMT = await getDataUserSimt(tokenSuapStoraged.access, dataUserSuap.bondType);
                const dataUserSIMT = await requestUserSIMT.json();
            
                setId(dataUserSIMT.id);
                setTokenSuap(tokenSuapStoraged);
                setName(dataUserSIMT.fullName);
                setBondType(dataUserSIMT.bondType);
                setResumeId(dataUserSIMT.resumeId);
            
                if (dataUserSIMT.courseName !== "") {
                  setCourseId(dataUserSIMT.courseId);
                  setCourseName(dataUserSIMT.courseName);
                }
            
                if (dataUserSIMT.vacanciesIds !== null) {
                    setStudentVacancies(dataUserSIMT.vacanciesIds);
                }
              }else{
                throw new Error("Erro ao verificar o token");
              }
          
            } catch (error) {
              try {
                  const responseRefreshToken = await refreshToken(tokenSuapStoraged.refresh);
                  const newAccess = await responseRefreshToken.json();
          
                  const newToken = {
                      refresh: tokenSuapStoraged.refresh,
                      access: newAccess.access
                  };
          
                  localStorage.setItem('tokenSUAP', JSON.stringify(newToken));
                  setTokenSuap(newToken);
                  
                  const refreshedDataUserSuap = await getDataUserSuap(newToken.access);
                  const requestUserSIMT = await getDataUserSimt(newToken.access, refreshedDataUserSuap.bondType);
                  const refreshedDataUserSIMT = await requestUserSIMT.json();
          
                  setId(refreshedDataUserSIMT.id);
                  setName(refreshedDataUserSIMT.fullName);
                  setBondType(refreshedDataUserSIMT.bondType);
                  setResumeId(refreshedDataUserSIMT.resumeId);
          
                  if (refreshedDataUserSIMT.course !== "") {
                    setCourseId(refreshedDataUserSIMT.courseId);
                    setCourseName(refreshedDataUserSIMT.courseName);
                  }
          
                  if (refreshedDataUserSIMT.vacanciesIds !== null) {
                      setStudentVacancies(refreshedDataUserSIMT.vacanciesIds);
                  }
          
              } catch (error) {
                  logout();
                  setError("Não foi possível validar seu acesso.");
              }
            }
          
          setLoading(false)
        })()
    }else{
      logout();
    }

}, [getDataUserSuap, getDataUserSimt, verifyToken, refreshToken])

return (
    <AuthContext.Provider value={{ tokenSuap, id, name, bondType, courseId, courseName, resumeId, setResumeId, studentVacancies, setStudentVacancies, error, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context;
}
