import "./Pagination.css"
import { Link } from "react-router-dom";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = Math.min(3, totalPages);

    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (totalPages > visiblePages && currentPage <= Math.floor(visiblePages / 2) + 1) {
      endPage = visiblePages;
    } else if (totalPages > visiblePages && currentPage >= totalPages - Math.floor(visiblePages / 2)) {
      startPage = totalPages - visiblePages + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <ul className="pagination custom-pagination custom-modified-box-shadow">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <Link className="page-link" to={`/?page=${currentPage - 1}`} onClick={() => onPageChange(currentPage - 1)}>
            Anterior
          </Link>
        </li>

        {renderPageNumbers().map((pageNumber) => (
          <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
            <Link className="page-link" to={`/?page=${pageNumber}`} onClick={() => onPageChange(pageNumber)}>
              {pageNumber}
            </Link>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <Link className="page-link" to={`/?page=${currentPage + 1}`} onClick={() => onPageChange(currentPage + 1)}>
            Próxima
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Pagination;

