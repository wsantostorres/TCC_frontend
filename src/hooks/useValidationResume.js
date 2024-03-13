export const useValidationResume = () => {

  const validateFields = (resume) => {
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

  return {validateFields}
}