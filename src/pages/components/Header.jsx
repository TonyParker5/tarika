import { Link } from 'react-router-dom'
import '../../css/Header.css'

function Header() {

  return (
    <header className="header floating-header">
      <div className="container">

        <Link to="/comments" className="comment-link" aria-label="Open comments">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 10h.01M12 10h.01M16 10h.01"/>
          </svg>
        </Link>

        <div className="brand">
          <h3 style={{paddingRight:'5px', paddingLeft:'5px'}}>تركة - لحساب قيمة الميراث</h3>
          <p>*نموذج أولي*</p>
        </div>

      </div>
    </header>
  )
}

export default Header