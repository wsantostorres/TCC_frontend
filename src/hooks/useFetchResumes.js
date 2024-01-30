import { useCallback, useState } from "react";
import { apiSimt } from "../services/api"
import { useMessage } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useFetchResumes = () => {

    const url = apiSimt();
    const redirect = useNavigate();

    // data hooks
    const { setResumeMessage } = useMessage();
    const { setResumeId } = useAuth();

    // states
    const [resumeLoading, setResumeLoading] = useState(false);

    const getResume = useCallback( async(authorization, studentId, id) => {
      setResumeLoading(true);
    
        return fetch(`${url}/resumes/${studentId}/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Baerer ${authorization}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Erro com o servidor');
          }
          return response.json();
        })
        .then((responseJson) => {
          setResumeLoading(false);
          setResumeMessage({msg: "", type: "success"})
          return responseJson;
        })
        .catch((err) => {
          setResumeMessage({msg:"Não foi possível carregar dados do currículo.", type:"error" });
          setResumeLoading(false);
          return null;
        });
      
  
    }, [url, setResumeMessage]);

    const postResume = async(authorization, studentId, data) => {
      setResumeLoading(true);
    
      return fetch(`${url}/resumes/${studentId}`, {
        method: "POST",
        headers: {
          "Authorization": `Baerer ${authorization}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }else{
          throw new Error('Erro com o servidor');
        }
      })
      .then((responseJson) => {
          setResumeMessage({msg: "Currículo criado com sucesso.", type: "success"})
          setResumeLoading(false);
          setResumeId(responseJson.id)
          return responseJson;
      })
      .catch((err) => {
        setResumeMessage({msg:"Não foi possível criar o currículo.", type:"error"})
        setResumeLoading(false);
      });
    };

    const putResume = async(authorization, studentId, resumeId, data) => {
      setResumeLoading(true);
    
      return fetch(`${url}/resumes/${studentId}/${resumeId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Baerer ${authorization}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then( async (response) => {
        if (response.status === 200) {
          setResumeMessage({msg: "Currículo atualizado com sucesso.", type: "success" })
          redirect("/curriculo");
          setResumeLoading(false);
        }else{
          throw new Error('Erro com o servidor');
        }
      })
      .catch((err) => {
        setResumeMessage({msg:"Não foi possível atualizar o currículo.", type:"error"});
        setResumeLoading(false);
      });
    };

    const downloadResumePDF = async(authorization, studentId, resumeId) => {
      setResumeLoading(true);
      return fetch(`${url}/resumes/download/${studentId}/${resumeId}`, {
          method: 'GET',
          headers: {
            "Authorization": `Baerer ${authorization}`,
          },
          responseType: 'arraybuffer',
      }).then(async (response) => {
        if(response.status === 200){
          let data = await response.arrayBuffer();
          let blob = new Blob([data], { type: 'application/pdf' });
          let url = window.URL.createObjectURL(blob);
          let link = document.createElement('a');
          link.href = url;
          let resumeFile = `curriculo.pdf`;
          link.setAttribute('download', resumeFile);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setResumeMessage({msg:"O seu currículo foi gerado com sucesso", type:"success"});
          setResumeLoading(false);
        }else if(response.status === 404){
          setResumeMessage({msg:"Cadastre seu currículo primeiro e tente novamente!", type:"error"});
          setResumeLoading(false);
        }else{
          throw new Error('Erro com o servidor');
        }
      }).catch((err) => {
        setResumeMessage({msg:"Não foi possível baixar o currículo.", type:"error"});
        setResumeLoading(false);
      });
    }
   

  return { postResume, putResume, getResume, downloadResumePDF, resumeLoading }
}