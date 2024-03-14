
import { useFetchResumes } from "../../hooks/useFetchResumes";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from './Resume.module.css';

import { IoMdArrowRoundBack } from 'react-icons/io'
import { LuSave } from 'react-icons/lu';
import { MdAddCircleOutline } from "react-icons/md";
import { BsTrash } from 'react-icons/bs';
import { FiDownloadCloud } from 'react-icons/fi';

import { useMessage } from "../../contexts/MessageContext";

import Input from "../../components/Input";
import InputMask from "react-input-mask";
import Loading from '../../components/Loading';
import { useAuth } from "../../contexts/AuthContext";
import { useHandleChangeResumes } from "../../hooks/useHandleChangeResumes";
import { useAddItemResume } from "../../hooks/useAddItemResume";
import { useValidationResume } from "../../hooks/useValidationResume";
import { useRemoveItemResume } from "../../hooks/useRemoveItemResume";

const Resume = () => {

  document.title = "Meu Currículo";
  const { postResume, putResume, getResume, downloadResumePDF, resumeLoading } = useFetchResumes();
  const { id:studentId, resumeId} = useAuth();
  const { resumeMessage, setResumeMessage } = useMessage();
  const { handleOnChange, handleSkillChange, handleGenericListChange } = useHandleChangeResumes();
  const { addSkill, addAcademic, addExperience, addProject, addComplementaryCourses} = useAddItemResume();
  const { removeItem } = useRemoveItemResume();
  const { validateFields } = useValidationResume();

  // state
  const [titleErrorValidation, setTitleErrorValidation] = useState("");
  const [validation, setValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resume, setResume] = useState({
    complementaryCourses: [],
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
  const[complementaryCourses, setComplementaryCourses] = useState([]);

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
          setComplementaryCourses(resumeData.complementaryCourses)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateFields(resume, skills, academics, projects, experiences, complementaryCourses);

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
    resume.complementaryCourses = complementaryCourses;

    if(resumeId !== null && resumeId !== undefined){
      await putResume(studentId, resumeId, resume)
      setModified(true)
    }else{
      await postResume(studentId, resume)
      setModified(true)
    }
  }

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
                handleChange={(e) => handleOnChange(e, resume, setResume)}
                valueLabel="Email: " 
                value={resume.contact.email} 
                messageError={validation && validation.email}   
                validationClass={validation && validation.email ? 'is-invalid' : ''} />
          <br />
          <label htmlFor="phoneNumber">Nº Telefone:</label>
          <InputMask mask="(99) 99999-9999"
                name="contact.phone"
                type="text"
                id="phoneNumber"
                placeholder="Digite seu número de telefone"
                onChange={(e) => handleOnChange(e, resume, setResume)}
                value={resume.contact.phone}
                className={`form-control ${validation && validation.phone ? "is-invalid" : ""}`} />
                {validation && validation.phone && (<small className="invalid-feedback d-block fw-bold" >{validation.phone}</small>)}
          <br />
          <Input name="contact.linkedin"
                type="text" 
                placeholder="Digite seu linkedin" 
                handleChange={(e) => handleOnChange(e, resume, setResume)}
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
                handleChange={(e) => handleOnChange(e, resume, setResume)}
                valueLabel="Rua: " 
                value={resume.address.street} 
                messageError={validation && validation.street}   
                validationClass={validation && validation.street ? 'is-invalid' : ''} />
          <br />
          <Input name="address.number"
                type="number" 
                placeholder="Nº da Casa" 
                handleChange={(e) => handleOnChange(e, resume, setResume)}
                valueLabel="Número: " 
                value={resume.address.number} 
                messageError={validation && validation.number}  
                validationClass={validation && validation.number ? 'is-invalid' : ''} />
          <br />
          <Input name="address.city"
                type="text" 
                placeholder="Sua cidade" 
                handleChange={(e) => handleOnChange(e, resume, setResume)}
                valueLabel="Cidade: " 
                value={resume.address.city} 
                messageError={validation && validation.city} 
                validationClass={validation && validation.city ? 'is-invalid' : ''} />
        </div>
        
        <div>
          <h5 className="fw-bold"><span>3</span>Habilidades</h5>
          <p className={styles.description}><small><span>Descrição:</span> Habilidade em um currículo é uma capacidade específica que uma pessoa possui e pode aplicar em um ambiente de trabalho, você pode adicionar até <span>(5)</span> habilidades. Exemplos: <em>"Proatividade", "Facilidade de Aprendizado"</em></small></p>
          {skills.map((skill, index) => {
            if(skill.delete === false){
              return (
                <div key={index}>

                  { !skill.id ? (
                    <p className="fw-bold">{`Nova Habilidade`}:</p>
                  ) : (
                    <p className="fw-bold">{`Habilidade ${index + 1}`}:</p>
                  ) }

                  <input
                    className={`form-control ${validation && validation[`skill_${index}`] ? "is-invalid" : ''}`}
                    type="text"
                    onChange={(e) => handleSkillChange(e, index, skills, setSkills)}
                    value={skill.nameSkill}
                    placeholder={`Nome da Habilidade`}
                  />
                  {validation && validation[`skill_${index}`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`skill_${index}`]}</small>)}
                  <br />
                  <button type="button" onClick={() => removeItem(index, skills, setSkills)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"><BsTrash />Remover</button>
                  <br />
                </div>
              )
            }

            return null
          })}
          <button id="btn-add-skill" className={`btn btn-success d-flex align-items-center gap-1 ${styles.iconAdd}`}  type="button" onClick={() => addSkill(skills, setSkills)}>
          <MdAddCircleOutline /> Habilidade
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>4</span>Formações Acadêmicas</h5>
          <p className={styles.description}><small><span>Descrição:</span> Formação Acadêmica em um currículo refere-se à educação formal que você recebeu ao longo de sua vida acadêmica, você pode adicionar até <span>(3)</span> formações. Observação: Se você ainda não terminou a sua formação, é interessante inserir-la e adicionar o ano de formação previsto. Exemplo: <em>"Ensino Médio" - "IFRN" - "2024" - "2028" </em></small></p>
          {academics.map((academic, index) => { 
            if(academic.delete === false){
              return (
                <div key={index}>

                  { !academic.id ? (
                    <p className="fw-bold">{`Nova Formação`}:</p>
                  ) : (
                    <p className="fw-bold">{`Formação ${index + 1}`}:</p>
                  ) }
              
                  <input
                    className={`form-control ${validation && validation[`academic_${index}_schooling`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`schooling`}
                    onChange={(e) => handleGenericListChange(e, index, academics, setAcademics)}
                    value={academic.schooling}
                    placeholder={`Nome da Formação`}
                  />
                  {validation && validation[`academic_${index}_schooling`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`academic_${index}_schooling`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`academic_${index}_foundation`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`foundation`}
                    onChange={(e) => handleGenericListChange(e, index, academics, setAcademics)}
                    value={academic.foundation}
                    placeholder={`Instituição`}
                  />
                  {validation && validation[`academic_${index}_foundation`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`academic_${index}_foundation`]}</small>)}                  
                  <br />
                  <input
                    className={`form-control ${validation && validation[`academic_${index}_initialYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`initialYear`}
                    onChange={(e) => handleGenericListChange(e, index, academics, setAcademics)}
                    value={academic.initialYear}
                    placeholder={`Ano de Inicio`}
                  />
                  {validation && validation[`academic_${index}_initialYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`academic_${index}_initialYear`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`academic_${index}_closingYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`closingYear`}
                    onChange={(e) => handleGenericListChange(e, index, academics, setAcademics)}
                    value={academic.closingYear}
                    placeholder={`Ano de Conclusão`}
                  />
                  {validation && validation[`academic_${index}_closingYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`academic_${index}_closingYear`]}</small>)}
                  <br />
                  <button type="button" onClick={() => removeItem(index, academics, setAcademics)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"><BsTrash />Remover</button>
                  <br />
                </div>
              )
            }

            return null
          })}
          <button id="btn-add-academic" className={`btn btn-success d-flex align-items-center gap-1 ${styles.iconAdd}`}  type="button" onClick={() => addAcademic(academics, setAcademics)}>
          <MdAddCircleOutline /> Formação 
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>5</span>Projetos</h5>
          <p className={styles.description}><small><span>Descrição:</span> Projeto em um currículo refere-se a trabalhos específicos, iniciativas ou empreendimentos nos quais você esteve envolvido, você pode adicionar até <span>(3)</span> projetos. Exemplo: <em>"Projeto Escola Conectada" - "IFRN" - "2022" - "2023"</em></small></p>
          {projects.map((project, index) => {
            if(project.delete === false) { 
              return (
                <div key={index}>

                  { !project.id ? (
                    <p className="fw-bold">{`Novo Projeto`}:</p>
                  ) : (
                    <p className="fw-bold">{`Projeto ${index + 1}`}:</p>
                  ) }
                  
                  <input
                  className={`form-control ${validation && validation[`project_${index}_titleProject`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`titleProject`}
                    onChange={(e) => handleGenericListChange(e, index, projects, setProjects)}
                    value={project.titleProject}
                    placeholder={`Nome do Projeto`}
                  />
                  {validation && validation[`project_${index}_titleProject`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`project_${index}_titleProject`]}</small>)}
                  <br />
                  <input
                  className={`form-control ${validation && validation[`project_${index}_foundation`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`foundation`}
                    onChange={(e) => handleGenericListChange(e, index, projects, setProjects)}
                    value={project.foundation}
                    placeholder={`Instituição`}
                  />
                  {validation && validation[`project_${index}_foundation`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`project_${index}_foundation`]}</small>)}
                  <br />
                  <input
                  className={`form-control ${validation && validation[`project_${index}_initialYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`initialYear`}
                    onChange={(e) => handleGenericListChange(e, index, projects, setProjects)}
                    value={project.initialYear}
                    placeholder={`Ano de Inicio`}
                  />
                  {validation && validation[`project_${index}_initialYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`project_${index}_initialYear`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`project_${index}_closingYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`closingYear`}
                    onChange={(e) => handleGenericListChange(e, index, projects, setProjects)}
                    value={project.closingYear}
                    placeholder={`Ano de Conclusão`}
                  />
                  {validation && validation[`project_${index}_closingYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`project_${index}_closingYear`]}</small>)}
                  <br />
                  <button type="button" onClick={() => removeItem(index, projects, setProjects)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"><BsTrash />Remover</button>
                  <br />
                </div>
              )
            }

            return null
          })}
          <button id="btn-add-project" className={`btn btn-success d-flex align-items-center gap-1 ${styles.iconAdd}`}  type="button" onClick={() => addProject(projects, setProjects)}>
          <MdAddCircleOutline /> Projeto
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>6</span>Experiências</h5>
          <p className={styles.description}><small><span>Descrição:</span> Experiência em um currículo refere-se ao histórico de empregos, estágios ou trabalho voluntário que você esteve envolvido, você pode adicionar até <span>(5)</span> experiências. Exemplo: <em>"Atendente" - "Comércio Familiar" - "2023" - "2024"</em></small></p>
          {experiences.map((experience, index) => {
            if(experience.delete === false){
              return (
                <div key={index}>

                  { !experience.id ? (
                    <p className="fw-bold">{`Nova Experiência`}:</p>
                  ) : (
                    <p className="fw-bold">{`Experiência ${index + 1}`}:</p>
                  ) }

                  <input
                    className={`form-control ${validation && validation[`experience_${index}_functionName`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`functionName`}
                    onChange={(e) => handleGenericListChange(e, index, experiences, setExperiences)}
                    value={experience.functionName}
                    placeholder={`Nome da Função`}
                  />
                  {validation && validation[`experience_${index}_functionName`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`experience_${index}_functionName`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`experience_${index}_company`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`company`}
                    onChange={(e) => handleGenericListChange(e, index, experiences, setExperiences)}
                    value={experience.company}
                    placeholder={`Empresa`}
                  />
                  {validation && validation[`experience_${index}_company`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`experience_${index}_company`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`experience_${index}_initialYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`initialYear`}
                    onChange={(e) => handleGenericListChange(e, index, experiences, setExperiences)}
                    value={experience.initialYear}
                    placeholder={`Ano de Inicio`}
                  />
                  {validation && validation[`experience_${index}_initialYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`experience_${index}_initialYear`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`experience_${index}_closingYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`closingYear`}
                    onChange={(e) => handleGenericListChange(e, index, experiences, setExperiences)}
                    value={experience.closingYear}
                    placeholder={`Ano de Conclusão`}
                  />
                  {validation && validation[`experience_${index}_closingYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`experience_${index}_closingYear`]}</small>)}
                  <br />
                  <button type="button" onClick={() => removeItem(index, experiences, setExperiences)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"><BsTrash />Remover</button>
                  <br />
              </div>
              )
            }

            return null
          })}
          <button id="btn-add-experience" className={`btn btn-success d-flex align-items-center gap-1 ${styles.iconAdd}`}  type="button" onClick={() => addExperience(experiences, setExperiences)}>
          <MdAddCircleOutline /> Experiência
          </button>
        </div>

        <div>
          <h5 className="fw-bold"><span>7</span>Cursos Complementares</h5>
          <p className={styles.description}><small><span>Descrição:</span> Curso complementar em um currículo refere-se a qualquer formação adicional que você tenha realizado além de sua formação ou experiência, você pode adicionar até <span>(5)</span> cursos complementares. Exemplo: <em>"Excel do Básico ao Avançado" - "Udemy" - "2023" - "2023"</em></small></p>
          {complementaryCourses.map((complementaryCourse, index) => {

            if(complementaryCourse.delete === false){
              return (
                <div key={index}>

                  { !complementaryCourse.id ? (
                    <p className="fw-bold">{`Novo Curso`}:</p>
                  ) : (
                    <p className="fw-bold">{`Curso ${index + 1}`}:</p>
                  ) }
                  
                  <input
                    className={`form-control ${validation && validation[`complementaryCourse_${index}_courseName`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`courseName`}
                    onChange={(e) => handleGenericListChange(e, index, complementaryCourses, setComplementaryCourses)}
                    value={complementaryCourse.courseName}
                    placeholder={`Nome do curso`}
                  />
                  {validation && validation[`complementaryCourse_${index}_courseName`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`complementaryCourse_${index}_courseName`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`complementaryCourse_${index}_foundation`] ? "is-invalid" : ''}`}
                    type="text"
                    name={`foundation`}
                    onChange={(e) => handleGenericListChange(e, index, complementaryCourses, setComplementaryCourses)}
                    value={complementaryCourse.foundation}
                    placeholder={`Organização`}
                  />
                  {validation && validation[`complementaryCourse_${index}_foundation`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`complementaryCourse_${index}_foundation`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`complementaryCourse_${index}_initialYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`initialYear`}
                    onChange={(e) => handleGenericListChange(e, index, complementaryCourses, setComplementaryCourses)}
                    value={complementaryCourse.initialYear}
                    placeholder={`Ano de Inicio`}
                  />
                  {validation && validation[`complementaryCourse_${index}_initialYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`complementaryCourse_${index}_initialYear`]}</small>)}
                  <br />
                  <input
                    className={`form-control ${validation && validation[`complementaryCourse_${index}_closingYear`] ? "is-invalid" : ''}`}
                    type="number"
                    name={`closingYear`}
                    onChange={(e) => handleGenericListChange(e, index, complementaryCourses, setComplementaryCourses)}
                    value={complementaryCourse.closingYear}
                    placeholder={`Ano de Conclusão`}
                  />
                  {validation && validation[`complementaryCourse_${index}_closingYear`] && (<small className="invalid-feedback d-block fw-bold" >{validation[`complementaryCourse_${index}_closingYear`]}</small>)}
                  <br />
                  <button type="button" onClick={() => removeItem(index, complementaryCourses, setComplementaryCourses)} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"><BsTrash />Remover</button>
                  <br />
                </div>
              )
            }

            return null
          })}
          <button id="btn-add-complementaryCourse" className={`btn btn-success d-flex align-items-center gap-1 ${styles.iconAdd}`}  type="button" onClick={() => addComplementaryCourses(complementaryCourses, setComplementaryCourses)}>
          <MdAddCircleOutline /> Curso Complementar
          </button>
        </div>

        <div className="d-flex justify-content-end mt-5 gap-3">
          <button id="btn-download-my-resume" className="btn btn-warning px-3" onClick={async() => { await downloadResumePDF(studentId, resumeId) }} data-toggle="tooltip" data-placement="top" title="Baixar currículo"><FiDownloadCloud/><span></span></button>
          <button id="btn-save-resume" type="submit" className={styles.buttonSave}><LuSave /> Salvar</button>
        </div>
      </form>
    </div>
  )
}

export default Resume