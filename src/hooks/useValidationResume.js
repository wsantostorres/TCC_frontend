export const useValidationResume = () => {

  const validateFields = (resume, skills, academics, projects, experiences, complementaryCourses) => {
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

    // Validar habilidades
    skills.forEach((skill, index) => {
      if(skill.delete === false){
        if(skill.nameSkill === ""){
          errors[`skill_${index}`] = "O nome da habilidade não pode ser vazio."
        }
      }
    });

    // Validar formações acadêmicas
    academics.forEach((academic, index) => {
      
      if(academic.delete === false){
        if(academic.schooling === ""){
          errors[`academic_${index}_schooling`] = "O nome da formação não pode ser vazio."
        }
  
        if(academic.foundation === ""){
          errors[`academic_${index}_foundation`] = "A instituição não pode ser vazia."
        }
  
        if(academic.initialYear === ""){
          errors[`academic_${index}_initialYear`] = "O ano de início não pode ser vazio."
        }
  
        if(academic.closingYear === ""){
          errors[`academic_${index}_closingYear`] = "O ano de conclusão não pode ser vazio."
        }

        if(academic.initialYear.length > 4){
          errors[`academic_${index}_initialYear`] = "O ano de início não pode ser maior que 4 caracteres."
        }

        if(academic.closingYear.length > 4){
          errors[`academic_${index}_closingYear`] = "O ano de conclusão não pode ser maior que 4 caracteres."
        }
      }

    });

    // Validar projetos
    projects.forEach((project, index) => {
  
      if(project.delete === false){
        if(project.titleProject === ""){
          errors[`project_${index}_titleProject`] = "O nome do projeto não pode ser vazio."
        }

        if(project.foundation === ""){
          errors[`project_${index}_foundation`] = "A instituição não pode ser vazia."
        }

        if(project.initialYear === ""){
          errors[`project_${index}_initialYear`] = "O ano de início não pode ser vazio."
        }

        if(project.closingYear === ""){
          errors[`project_${index}_closingYear`] = "O ano de conclusão não pode ser vazio."
        }

        if(project.initialYear.length > 4){
          errors[`project_${index}_initialYear`] = "O ano de início não pode ser maior que 4 caracteres."
        }

        if(project.closingYear.length > 4){
          errors[`project_${index}_closingYear`] = "O ano de conclusão não pode ser maior que 4 caracteres."
        }

        if(project.activities === ""){
          errors[`project_${index}_activities`] = "As atividades não podem ser vazias."
        }

        if(project.activities.length > 150){
          errors[`project_${index}_activities`] = "A quantidade de caracteres não pode ser maior que 150."
        }
        
      }

    });

    // Validar experiências
    experiences.forEach((experience, index) => {
      
      if(experience.delete === false){
        if(experience.functionName === ""){
          errors[`experience_${index}_functionName`] = "O nome da função não pode ser vazio."
        }

        if(experience.company === ""){
          errors[`experience_${index}_company`] = "A empresa não pode ser vazia."
        }

        if(experience.initialYear === ""){
          errors[`experience_${index}_initialYear`] = "O ano de início não pode ser vazio."
        }

        if(experience.closingYear === ""){
          errors[`experience_${index}_closingYear`] = "O ano de conclusão não pode ser vazio."
        }

        if(experience.initialYear.length > 4){
          errors[`experience_${index}_initialYear`] = "O ano de início não pode ser maior que 4 caracteres."
        }

        if(experience.closingYear.length > 4){
          errors[`experience_${index}_closingYear`] = "O ano de conclusão não pode ser maior que 4 caracteres."
        }

        if(experience.activities === ""){
          errors[`experience_${index}_activities`] = "As atividades não podem ser vazias."
        }

        if(experience.activities.length > 150){
          errors[`experience_${index}_activities`] = "A quantidade de caracteres não pode ser maior que 150."
        }
      }

    });

    // Validar cursos complementares
    complementaryCourses.forEach((complementaryCourse, index) => {
  
      if(complementaryCourse.delete === false){
        if(complementaryCourse.courseName === ""){
          errors[`complementaryCourse_${index}_courseName`] = "O nome do curso não pode ser vazio."
        }
  
        if(complementaryCourse.foundation === ""){
          errors[`complementaryCourse_${index}_foundation`] = "A organização não pode ser vazia."
        }
  
        if(complementaryCourse.initialYear === ""){
          errors[`complementaryCourse_${index}_initialYear`] = "O ano de início não pode ser vazio."
        }
  
        if(complementaryCourse.closingYear === ""){
          errors[`complementaryCourse_${index}_closingYear`] = "O ano de conclusão não pode ser vazio."
        }

        if(complementaryCourse.initialYear.length > 4){
          errors[`complementaryCourse_${index}_initialYear`] = "O ano de início não pode ser maior que 4 caracteres."
        }

        if(complementaryCourse.closingYear.length > 4){
          errors[`complementaryCourse_${index}_closingYear`] = "O ano de conclusão não pode ser maior que 4 caracteres."
        }
      }

    });
  
    return errors;
  };

  return {validateFields}
}