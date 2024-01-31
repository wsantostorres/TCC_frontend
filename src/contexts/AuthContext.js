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
  const [course, setCourse] = useState();
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

      // pegando dados do aluno/servidor se ele tiver cadastrado ou a id presente no token do SUAP
      responseDataSimt = await getDataUserSimt(tokenApiSuap.access, dataUserSuap.bondType);
      
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
        setCourse(userCreated.course)
        
      }else{
        localStorage.setItem("tokenSUAP", JSON.stringify(tokenApiSuap))
        setTokenSuap(tokenApiSuap)
        setId(responseDataSimt.id)
        setName(responseDataSimt.fullName)
        setBondType(responseDataSimt.bondType)
        setCourse(responseDataSimt.course)
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
    setCourse("")
    setResumeId(null)
    setStudentVacancies(null)
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
                const dataUserSIMT = await getDataUserSimt(tokenSuapStoraged.access, dataUserSuap.bondType);
            
                setId(dataUserSIMT.id);
                setTokenSuap(tokenSuapStoraged);
                setName(dataUserSIMT.fullName);
                setBondType(dataUserSIMT.bondType);
                setResumeId(dataUserSIMT.resumeId);
            
                if (dataUserSIMT.course !== "") {
                    setCourse(dataUserSIMT.course);
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
                  const refreshedDataUserSIMT = await getDataUserSimt(newToken.access, refreshedDataUserSuap.bondType);
          
                  setId(refreshedDataUserSIMT.id);
                  setName(refreshedDataUserSIMT.fullName);
                  setBondType(refreshedDataUserSIMT.bondType);
                  setResumeId(refreshedDataUserSIMT.resumeId);
          
                  if (refreshedDataUserSIMT.course !== "") {
                      setCourse(refreshedDataUserSIMT.course);
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
    <AuthContext.Provider value={{ tokenSuap, id, name, bondType, course, resumeId, setResumeId, studentVacancies, setStudentVacancies, error, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context;
}
