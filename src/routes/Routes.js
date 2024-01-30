import { useAuth } from "../contexts/AuthContext";
import { BrowserRouter } from 'react-router-dom';

import SignRoutes from './SignRoutes';
import AuthRoutes from './AuthRoutes';
import Loading from "../components/Loading";

const Routes = () => {

  const { tokenSuap, bondType, loading } = useAuth();

  if(loading){
    return <Loading />
  }

  return (
    <BrowserRouter>
        {!tokenSuap && !bondType && <SignRoutes />}
        {tokenSuap && bondType && (<AuthRoutes />)}
    </BrowserRouter>
  )
}

export default Routes