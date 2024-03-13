export const useHandleChangeResumes = () => {

    const handleOnChange = (e, item, setItem) => {
        const { name, value } = e.target;
        const updatedResume = { ...item};
    
        // Verifica se o campo pertence a um objeto aninhado
        if (name.includes(".")) {
          const [parentField, childField] = name.split(".");
          updatedResume[parentField][childField] = value;
        } else {
          updatedResume[name] = value;
        }
    
        setItem(updatedResume);
        
    };

    const handleSkillChange = (e, index, item, setItem) => {
        const { value } = e.target;
        const updatedSkills = [...item];
    
        if (updatedSkills[index].id) {
          updatedSkills[index] = { id: updatedSkills[index].id, nameSkill: value };
        } else {
          updatedSkills[index] = { nameSkill: value };
        }
    
        setItem(updatedSkills);
    };

    const handleGenericListChange = (e, index, item, setItem) => {
        const { name, value } = e.target;
        const updatedItems = [...item];
    
        if (updatedItems[index].id) {
            updatedItems[index][name] = value;
        } else {
            updatedItems[index] = { ...updatedItems[index], [name]: value };
        }
    
        setItem(updatedItems);
    };


  return { handleOnChange, handleSkillChange, handleGenericListChange}
}