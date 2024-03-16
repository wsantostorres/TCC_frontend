export const useAddItemResume = () => {

  const addSkill = (skills, setSkills) => {

    let itemsNotDeleted = skills.filter((skill) => skill.delete === false)
  
    if (itemsNotDeleted.length < 5) {
      setSkills([...skills, { 
        nameSkill: '',
        delete: false 
      }]);
    }
  };

  const addAcademic = (academics, setAcademics) => {

    let itemsNotDeleted = academics.filter((academic) => academic.delete === false)

    if (itemsNotDeleted.length < 2) {
      setAcademics([...academics, {
        schooling: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '',
        delete: false }]);
    }
  };

  const addProject = (projects, setProjects) => {

    let itemsNotDeleted = projects.filter((project) => project.delete === false)

    if (itemsNotDeleted.length < 2) {
      setProjects([...projects, {
        titleProject: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '',
        activities: '',
        delete: false 
      }]);
    }
  };

  const addExperience = (experiences, setExperiences) => {

    let itemsNotDeleted = experiences.filter((experience) => experience.delete === false)

    if (itemsNotDeleted.length < 2) {
      setExperiences([...experiences, {
        functionName: '',
			  company: '',
			  initialYear: '',
			  closingYear: '',
        activities: '',
        delete: false}]);
    }
  };

  const addComplementaryCourses = (complementaryCourses, setComplementaryCourses) => {

    let itemsNotDeleted = complementaryCourses.filter((complementaryCourse) => complementaryCourse.delete === false)

    if (itemsNotDeleted.length < 2) {
      setComplementaryCourses([...complementaryCourses, {
        courseName: '',
			  foundation: '',
			  initialYear: '',
			  closingYear: '',
        delete: false}]);
    }
  };

  return { addSkill, addAcademic, addProject, addExperience, addComplementaryCourses }
}
