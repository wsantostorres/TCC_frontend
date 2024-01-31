import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";

import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from "../../contexts/MessageContext";

import styles from './Home.module.css';

import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { BsSearch } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';

import VacancyCard from "./VacancyCard";

const HomeStudent = () => {

    document.title = "Home";

    const { vacancyMessage, setVacancyMessage } = useMessage();
    const { bondType, logout, name, course} = useAuth()
    const { searchVacancies, getAllVacancies, vacancyLoading } = useFetchVacancies();

    const [vacancies, setVacancies] = useState(null);
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        (async () => {
            const allVacancies = await getAllVacancies(course, bondType);
            setVacancies(allVacancies)
            setSearchText("")
            setErrorMessage("")
        })()
    }, [course, getAllVacancies, bondType])

    useEffect(() => {
        if (vacancyMessage.type === "error") {
          setErrorMessage(vacancyMessage);
          setVacancyMessage("");
        }
      }, [vacancyMessage, setErrorMessage, setVacancyMessage]);

    const handleSearch = async(e) => {
        e.preventDefault();
        const searchResults = await searchVacancies(search, course, bondType);
        setVacancies(searchResults)
        setSearchText(search)
      }

    const initialLetter = (name) => {
        return name[0];
    }

  return (
    <div className={styles.pageHome}>

        <nav>
            {/* Search */}
            <div>
                <Link to="/"><img src="logo.svg" alt="logo" /></Link>
                <form onSubmit={handleSearch}>
                    <button type='submit'><BsSearch /></button>
                    <input type="text"
                    placeholder="Pesquise por vagas..."
                    onChange={(e) => setSearch(e.target.value)} value={search}/>
                </form>
            </div>

            {/* User */}
            <div id="btn-dropdown-user" className="position-relative" >

                <button className={styles.button_dropdown_user} data-bs-toggle="dropdown" aria-expanded="false">{initialLetter(name)}
                </button>

                <ul className={`${styles.dropdown_boostrap} dropdown-menu`} id="dropdown">
                    <li>
                        <div className={styles.open_dropdown_user}>
                            <div className={styles.button_dropdown_user}>{initialLetter(name)}</div>
                            <div>
                                <small>{name}</small>
                                <small className="fw-bold">{bondType}(a)</small>
                            </div>
                        </div>
                    </li>
                    
                    <hr className="dropdown-divider"/>
            
                    <li>
                        <Link id="link-resume" to="/curriculo"><CgFileDocument />Currículo</Link>
                    </li>
                    
                    <hr className="dropdown-divider"/>
 
                    <li>
                        <button id="btn-logout" onClick={logout}><MdOutlinePowerSettingsNew /> Sair</button>
                    </li>
                </ul>
            </div>
        </nav>

        {/* Mensagens de Feedback*/}
        {vacancyMessage.type === "success" && (<p className="alert alert-success my-3 mb-0 text-center">{vacancyMessage.msg } </p>)}
        {errorMessage.type === "error" && (<p className="alert alert-danger my-3 text-center">{errorMessage.msg }</p>)}

        <main>
            
            {/* Title */}
            <section className={styles.title}>
                <div>
                    <h4>Vagas</h4>
                    {course && (<p>{course}</p>)}
                </div>
            </section>

            {/* Loading */}
            {vacancyLoading && (
                <div className="w-100 d-flex justify-content-center my-3"> 
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            )}
           

            {/* Search */}
            {searchText && (
                <p className="my-3">Exibindo resultados para: <span className="fw-bold">{searchText}</span></p>
            )}

            <section className={styles.vacancies}>
                {vacancies && vacancies.map( (vacancy) => (
                    <VacancyCard key={vacancy.id} id={vacancy.id} 
                        title={vacancy.title} 
                        description={vacancy.description}  
                        date={vacancy.closingDate}
                        type={vacancy.type} 
                        morning={vacancy.morning} 
                        afternoon={vacancy.afternoon} 
                        night={vacancy.night} />
                ))}
            </section>
        </main>

    </div>
  )
}

export default HomeStudent