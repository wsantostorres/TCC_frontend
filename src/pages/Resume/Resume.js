
import { useFetchResumes } from "../../hooks/useFetchResumes";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from './Resume.module.css';

import { IoMdArrowRoundBack } from 'react-icons/io'
import { LuSave } from 'react-icons/lu';
import { BsPlusLg } from 'react-icons/bs';
import { FiDownloadCloud } from 'react-icons/fi';

import { useMessage } from "../../contexts/MessageContext";

import Input from "../../components/Input";
import InputMask from "react-input-mask";
import Loading from '../../components/Loading';
import { useAuth } from "../../contexts/AuthContext";

const Resume = () => {

  document.title = "Meu Currículo";
  const { postResume, putResume, getResume, downloadResumePDF, resumeLoading } = useFetchResumes();
  const { id:studentId, resumeId} = useAuth();
  const { resumeMessage, setResumeMessage } = useMessage();

  // state
  const [titleErrorValidation, setTitleErrorValidation] = useState("");
  const [validation, setValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resume, setResume] = useState({
    projects: [],
    experiences: [],
    academics: [],
    skills: [],
    address: {
      city: "",
      street: "",
      number: ""
    },
    contact: {
      phone: "",
      email: "",
      linkedin: ""
    }
  });
  const[skills, setSkills] = useState([])
  const[academics, setAcademics] = useState([])
  const[projects, setProjects] = useState([])
  const[experiences, setExperiences] = useState([])
  const[modified, setModified] = useState(false);

  /* Ao salvar o currículo eu estou atualizando o resumeId
  que em seguida dispara o useEffect.
  Pode ser que eu tenha que fazer uma logica neste useEffect 
  para melhorar esse carregamento depois */
  useEffect(() => {
    (async () => {
      if(resumeId){
        const resumeData = await getResume(studentId, resumeId);

        if(resumeData !== null){
          setResume(resumeData)
          setSkills(resumeData.skills)
          setAcademics(resumeData.academics)
          setProjects(resumeData.projects)
          setExperiences(resumeData.experiences)
          setModified(false)
        }
      
      }
    })()
  }, [studentId, resumeId, getResume, modified])

  useEffect(() => {
    if (resumeMessage.type === "error") {
      setErrorMessage(resumeMessage);
      setSuccessMessage("");
    }

    if(resumeMessage.type === "success"){
      if(resumeMessage.msg !== ""){
        setSuccessMessage(resumeMessage)
      }
      setErrorMessage("");
    }
  }, [resumeMessage, setResumeMessage, setErrorMessage, setSuccessMessage]);

  // handleChange
  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      setTitleErrorValidation("Verifique os campos do formulário.")
      setValidation(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setTitleErrorValidation("")
    setValidation({});

    resume.skills = skills;
    resume.academics = academics;
    resume.projects = projects;
    resume.experiences = experiences;
    if(resumeId !== null && resumeId !== undefined){
      await putResume(studentId, resumeId, resume)
      setModified(true)
    }else{
      await postResume(studentId, resume)
      setModified(true)
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const updatedResume = { ...resume };

    // Verifica se o campo pertence a um objeto aninhado
    if (name.includes(".")) {
      const [parentField, childField] = name.split(".");
      updatedResume[parentField][childField] = value;
    } else {
      updatedResume[name] = value;
    }

    setResume(updatedResume);
    
  };

  const handleSkillChange = (e, index) => {
    const { value } = e.target;
    const updatedSkills = [...skills];

    if (updatedSkills[index].id) {
      updatedSkills[index] = { id: updatedSkills[index].id, nameSkill: value };
    } else {
      updatedSkills[index] = { nameSkill: value };
    }

    setSkills(updatedSkills);
  };

  const handleAcademicChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAcademics = [...academics];
    
    if (updatedAcademics[index].id) {
      updatedAcademics[index][name] = value;
    } else {
      updatedAcademics[index] = { ...updatedAcademics[index], [name]: value };
    }
    
    setAcademics(updatedAcademics);
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProjects = [...projects];
    
    if (updatedProjects[index].id) {
      updatedProjects[index][name] = value;
    } else {
      updatedProjects[index] = { ...updatedProjects[index], [name]: value };
    }
    
    setProjects(updatedProjects);
  };

  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    
    if (updatedExperiences[index].id) {
      updatedExperiences[index][name] = value;
    } else {
      updatedExperiences[index] = { ...updatedExperiences[index], [name]: value };
    }
    
    setExperiences(updatedExperiences);
  };

  // add new
  const addSkill = () => {
    if (skills.length < 5) {
      setSkills([...skills, { nameSkill: '' }]);
    }
  };

  const addAcademic = () => {
    if (academics.length < 3) {
      setAcademics([...academics, {
        schooling: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  const addProject = () => {
    if (projects.length < 3) {
      setProjects([...projects, {
        titleProject: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  const addExperience = () => {
    if (experiences.length < 5) {
      setExperiences([...experiences, {
        functionName: '',
			  company: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  // validation
  const validateFields = () => {
    const errors = {};
  
    // Validar número de telefone
    if (!resume.contact.phone || resume.contact.phone.length < 15 || resume.contact.phone.includes("_")){
      errors.phone = "Número de telefone inválido.";
    }
  
    // Validar email
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Expressão regular para validar email
    if (!resume.contact.email || !emailPattern.test(resume.contact.email)) {
      errors.email = "Email inválido.";
    }
  
    // Validar nome da rua
    if (!resume.address.street || resume.address.street.trim() === "") {
      errors.street = "O nome da rua é obrigatório.";
    }
  
    // Validar número da casa
    if (!resume.address.number) {
      errors.number = "O número da casa é obrigatório.";
    }
  
    // Validar cidade
    if (!resume.address.city || resume.address.city.trim() === "") {
      errors.city = "A cidade é obrigatória.";
    } 
  
    return errors;
  };

  // loading
  if(resumeLoading){
    return (<Loading />)
  }

  return (
    <div className={styles.profileContainer}>
      <form onSubmit={handleSubmit}>
      {titleErrorValidation && (<p className="alert alert-danger p-2 m-0 mb-3 text-center">{titleErrorValidation}</p>)}
      {errorMessage && errorMessage.type === "error" && (<p className="alert alert-danger p-2 m-0 mb-3 text-center">{errorMessage.msg}</p>)}
      {successMessage && successMessage.type === "success" && (<p className="alert alert-success p-2 m-0 mb-3 text-center">{successMessage.msg}</p>)}

        <div className={styles.pageTitleStyle}>
            <h4 className="fw-bold">Currículo</h4>
            <Link id="back-to-home" className={styles.buttonBackToHome} to="/"><IoMdArrowRoundBack /></Link>
        </div>
        
        <div>
          <h5 className="fw-bold"> <span>1</span> Contato</h5>
          <Input name="contact.email"
                type="email" 
                placeholder="Digite seu endereço de email" 
                handleChange={handleOnChange}
                valueLabel="Email: " 
                value={resume.contact.email} 
                messageError={validation && validation.email}   
                validationClass={validation && validation.email ? 'is-invalid' : ''} />
          <br />
          <label>Nº Telefone:</label>
          <InputMask mask="(99) 99999-9999"
                name="contact.phone"
                type="text"
                placeholder="Digite seu número de telefone"
                onChange={handleOnChange}
                value={resume.contact.phone}
                className={`form-control ${validation && validation.phone ? "is-invalid" : ""}`} />
                {validation && validation.phone && (<small className="invalid-feedback d-block fw-bold" >{validation.phone}</small>)}
          <br />
          <Input name="contact.linkedin"
                type="text" 
                placeholder="Digite seu linkedin" 
                handleChange={handleOnChange}
                valueLabel="Linkedin: " 
                value={resume.contact.linkedin} 
                messageError="" 
                validationClass="" />
        </div>
        <div>
          <h5 className="fw-bold"><span>2</span>Endereço</h5>
          <Input name="address.street"
                type="text" 
                placeholder="Nome da Rua" 
                handleChange={handleOnChange}
                valueLabel="Rua: " 
                value={resume.address.street} 
                messageError={validation && validation.street}   
                validationClass={validation && validation.street ? 'is-invalid' : ''} />
          <br />
          <Input name="address.number"
                type="number" 
                placeholder="Nº da Casa" 
                handleChange={handleOnChange}
                valueLabel="Número: " 
                value={resume.address.number} 
                messageError={validation && validation.number}  
                validationClass={validation && validation.number ? 'is-invalid' : ''} />
          <br />
          <Input name="address.city"
                type="text" 
                placeholder="Sua cidade" 
                handleChange={handleOnChange}
                valueLabel="Cidade: " 
                value={resume.address.city} 
                messageError={validation && validation.city} 
                validationClass={validation && validation.city ? 'is-invalid' : ''} />
        </div>
        
        <div>
          <h5 className="fw-bold"><span>4</span>Habilidades</h5>
          {skills.map((skill, index) => (
            <div key={index}>
              <label htmlFor={`skills[${index}].nameSkill`}><strong>{`Habilidade ${index + 1}`}:</strong></label>
              <input
              className="form-control"
                type="text"
                name={`skills[${index}].nameSkill`}
                onChange={(e) => handleSkillChange(e, index)}
                value={skill.nameSkill}
                placeholder={`Habilidade ${index + 1}`}
              />
              <br />
            </div>
          ))}
          <br />
          <button id="btn-add-skill" className={`btn btn-success ${styles.addButtons}`} type="button" onClick={addSkill}>
          < BsPlusLg /> Habilidade
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>5</span>Formações Acadêmicas</h5>
          {academics.map((academic, index) => (
            <div key={index}>
              <p className="fw-bold">{`Formação ${index + 1}`}:</p>
              <input
              className="form-control"
                type="text"
                name={`schooling`}
                onChange={(e) => handleAcademicChange(e, index)}
                value={academic.schooling}
                placeholder={`Nome da Formação`}
              />
              <br />
              <input
              className="form-control"
                type="text"
                name={`foundation`}
                onChange={(e) => handleAcademicChange(e, index)}
                value={academic.foundation}
                placeholder={`Instituição`}
              />
              <br />
              <input
              className="form-control"
                type="number"
                name={`initialYear`}
                onChange={(e) => handleAcademicChange(e, index)}
                value={academic.initialYear}
                placeholder={`Ano de Inicio`}
              />
              <br />
              <input
              className="form-control"
                type="number"
                name={`closingYear`}
                onChange={(e) => handleAcademicChange(e, index)}
                value={academic.closingYear}
                placeholder={`Ano de Fim`}
              />
              <br />
            </div>
          ))}
          <br />
          <button id="btn-add-academic" className={`btn btn-success ${styles.addButtons}`} type="button" onClick={addAcademic}>
          < BsPlusLg /> Formação 
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>6</span>Projetos</h5>
          {projects.map((project, index) => (
            <div key={index}>
              <p className="fw-bold">{`Projeto ${index + 1}`}:</p>
              <input
              className="form-control"
                type="text"
                name={`titleProject`}
                onChange={(e) => handleProjectChange(e, index)}
                value={project.titleProject}
                placeholder={`Nome do Projeto`}
              />
              <br />
              <input
              className="form-control"
                type="text"
                name={`foundation`}
                onChange={(e) => handleProjectChange(e, index)}
                value={project.foundation}
                placeholder={`Instituição`}
              />
              <br />
              <input
              className="form-control"
                type="number"
                name={`initialYear`}
                onChange={(e) => handleProjectChange(e, index)}
                value={project.initialYear}
                placeholder={`Ano de Inicio`}
              />
              <br />
              <input
              className="form-control"
                type="number"
                name={`closingYear`}
                onChange={(e) => handleProjectChange(e, index)}
                value={project.closingYear}
                placeholder={`Ano de Fim`}
              />
              <br />
            </div>
          ))}
          <br />
          <button id="btn-add-project" className={`btn btn-success ${styles.addButtons}`} type="button" onClick={addProject}>
          < BsPlusLg /> Projeto
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>7</span>Experiências</h5>
          {experiences.map((experience, index) => (
            <div key={index}>
              <p className="fw-bold">{`Experiência ${index + 1}`}:</p>
              <input
              className="form-control"
                type="text"
                name={`functionName`}
                onChange={(e) => handleExperienceChange(e, index)}
                value={experience.functionName}
                placeholder={`Nome da Função`}
              />
              <br />
              <input
              className="form-control"
                type="text"
                name={`company`}
                onChange={(e) => handleExperienceChange(e, index)}
                value={experience.company}
                placeholder={`Empresa`}
              />
              <br />
              <input
              className="form-control"
                type="number"
                name={`initialYear`}
                onChange={(e) => handleExperienceChange(e, index)}
                value={experience.initialYear}
                placeholder={`Ano de Inicio`}
              />
              <br />
              <input
              className="form-control"
                type="number"
                name={`closingYear`}
                onChange={(e) => handleExperienceChange(e, index)}
                value={experience.closingYear}
                placeholder={`Ano de Fim`}
              />
              <br />
            </div>
          ))}
          <br />
          <button id="btn-add-experience" className={`btn btn-success ${styles.addButtons}`} type="button" onClick={addExperience}>
          < BsPlusLg /> Experiência
          </button>
        </div>

        <div className="d-flex justify-content-end mt-5 gap-3">
          <button id="btn-download-my-resume" className="btn btn-warning px-3" onClick={async() => { await downloadResumePDF(studentId, resumeId) }} ><FiDownloadCloud/><span></span></button>
          <button id="btn-save-resume" type="submit" className={styles.buttonSave}><LuSave /> Salvar</button>
        </div>
      </form>
    </div>
  )
}

export default Resume