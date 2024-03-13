export const useAddItemResume = () => {

const addSkill = (skills, setSkills) => {
    if (skills.length < 5) {
      setSkills([...skills, { nameSkill: '' }]);
    }
  };

  const addAcademic = (academics, setAcademics) => {
    if (academics.length < 3) {
      setAcademics([...academics, {
        schooling: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  const addProject = (projects, setProjects) => {
    if (projects.length < 3) {
      setProjects([...projects, {
        titleProject: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  const addExperience = (experiences, setExperiences) => {
    if (experiences.length < 5) {
      setExperiences([...experiences, {
        functionName: '',
			  company: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  const addComplementaryCourses = (complementaryCourses, setComplementaryCourses) => {
    if (complementaryCourses.length < 5) {
      setComplementaryCourses([...complementaryCourses, {
        courseName: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '' }]);
    }
  };

  return { addSkill, addAcademic, addProject, addExperience, addComplementaryCourses }
}
