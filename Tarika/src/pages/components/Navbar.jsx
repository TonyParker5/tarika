import {NavLink} from 'react-router-dom'
import "../../css/Navbar.css"

function Navbar() {


   
  return (
    <div>
        <div className='navbar' >
    <ul>
        <li><NavLink to="/" ><span className="buble"></span><span>المالكي</span></NavLink></li>
        <li><NavLink to="/Shafiai" ><span className="buble"></span><span>الشافعي</span></NavLink></li>
        <li><NavLink to="/Hanafi" ><span className="buble"></span><span>الحنفي</span></NavLink></li>
        <li><NavLink to="/Hanbali" ><span className="buble"></span><span>الحنبلي</span></NavLink></li>
    </ul>
</div>
</div>
  )
}

export default Navbar