import { useCallback } from "react";
import { apiSimt } from "../services/api"

export const useFetchUsers = () => {

  const url = apiSimt();

  const getDataUserSimt = useCallback(async (token, bondType) => {
   
    const data = {
      token,
      bondType
    }
    
    const response = await fetch(`${url}/auth/get-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })

    const dataUserSIMT = response.json();
    return dataUserSIMT;
  }, [url])
    
  const register = async (data) => {

      const response = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      return await response.json();
  }

  return { getDataUserSimt, register }
}