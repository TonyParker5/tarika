import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Maliki from './pages/Maliki/Maliki';
import MCalc from './pages/Maliki/MCalc';
import Hanafi from './pages/Hanafi/Hanafi';
import HCalc from './pages/Hanafi/HCalc';
import Shafiai from './pages/Shafiai/Shafiai';
import SCalc from './pages/Shafiai/SCalc';
import Hanbali from './pages/Hanbali/Hanbali';
import ACalc from './pages/Hanbali/ACalc';
import './css/App.css';

function App() {

  const router = createBrowserRouter([
    { path: "/",
      element: <Home/> ,
      children:[
                  {index:true      , element:<Maliki/>},
                  {path:"MCalc"    , element:<MCalc/>},
                  {path:"/Shafiai" , element:<Shafiai/>},
                  {path:"SCalc"    , element:<SCalc/>},
                  {path:"/Hanbali" , element:<Hanbali/>},
                  {path:"ACalc"    , element:<ACalc/>},
                  {path:"/Hanafi"  , element:<Hanafi/>},
                  {path:"HCalc"    , element:<HCalc/>}
               ] 
    }
  ])
  
  return (
    <div className="App">
     <RouterProvider router={router}/>
    </div>
  );
}

export default App;