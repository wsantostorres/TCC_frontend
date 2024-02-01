import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";

import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from "../../contexts/MessageContext";

import styles from './Home.module.css';

import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { BsSearch } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';

import VacancyCard from "./VacancyCard";
import Pagination from "../../components/Pagination";

const HomeStudent = () => {

    document.title = "Home";

    const [searchParams, setSearchParams] = useSearchParams();

    const { vacancyMessage, setVacancyMessage } = useMessage();
    const { bondType, logout, name, course} = useAuth()
    const { searchVacancies, getAllVacancies, vacancyLoading } = useFetchVacancies();

    const [vacancies, setVacancies] = useState(null);
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [pageableData, setPageableData] = useState({
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0
    });

    const page = searchParams.get('page');

    useEffect(() => {
        (async () => {

            const data = {
                course: course,
                bondType: bondType
            }

            let allVacancies;

            if(page > 1){
                allVacancies = await getAllVacancies(data, page);
            }else{
                setSearchParams({});
                allVacancies = await getAllVacancies(data);
            }

            setVacancies(allVacancies.vacancies)

            const pageableVacancies = {
                totalElements: allVacancies.totalElements,
                totalPages: allVacancies.totalPages,
                currentPage: allVacancies.currentPage + 1,
                pageSize: allVacancies.pageSize
            }
            setPageableData(pageableVacancies);

            setSearchText("")
            setErrorMessage("")
        })()
    }, [course, getAllVacancies, bondType, setSearchParams, page])

    useEffect(() => {
        if (vacancyMessage.type === "error") {
          setErrorMessage(vacancyMessage);
          setVacancyMessage("");
        }
      }, [vacancyMessage, setErrorMessage, setVacancyMessage]);

    const handleSearch = async(e) => {
        e.preventDefault();

        const data = {
            course: course,
            bondType: bondType
        }

        const searchResults = await searchVacancies(data, null, search);
        
        setVacancies(searchResults.vacancies)

        const pageableVacancies = {
            totalElements: searchResults.totalElements,
            totalPages: searchResults.totalPages,
            currentPage: searchResults.currentPage + 1,
            pageSize: searchResults.pageSize
        }
        setPageableData(pageableVacancies);

        setSearchText(search)
      }

    const initialLetter = (name) => {
        return name[0];
    }

    const handlePageChange = async (pageNumber) => {

        const data = {
            course: course,
            bondType: bondType
        }

        if(search){
            const searchResults = await searchVacancies(data, pageNumber, search);
        
            setVacancies(searchResults.vacancies)
    
            const pageableVacancies = {
                totalElements: searchResults.totalElements,
                totalPages: searchResults.totalPages,
                currentPage: searchResults.currentPage + 1,
                pageSize: searchResults.pageSize
            }
            setPageableData(pageableVacancies);

        }else{
            const allVacancies = await getAllVacancies(data, pageNumber);

            setVacancies(allVacancies.vacancies)
    
            const pageableVacancies = {
                totalElements: allVacancies.totalElements,
                totalPages: allVacancies.totalPages,
                currentPage: allVacancies.currentPage + 1,
                pageSize: allVacancies.pageSize
            }
    
            setPageableData(pageableVacancies);
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    };

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
            {vacancies && vacancies.length === 0 && (
                 <p className="d-flex justify-content-center">Não foram encontradas vagas.</p>
            )}
        </main>

        <Pagination totalPages={pageableData.totalPages} currentPage={pageableData.currentPage} onPageChange={handlePageChange}/>

    </div>
  )
}

export default HomeStudent