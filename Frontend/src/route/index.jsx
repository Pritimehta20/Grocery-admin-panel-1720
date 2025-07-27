import { BrowserRouter, createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Verifyotp from "../pages/Verifyotp";
import ResetPassword from "../pages/ResetPassword";

const router= createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
        {
            path:"",
            element:<Home/>
        },{
            path:"search",
            element:<SearchPage/>
        },{
            path:"login",
            element:<Login/>
        },{
            path:"register",
            element:<Register/>
        },
        {
            path:"forgotpassword",
            element:<ForgotPassword/>
        },
        {
            path:"verifyotp",
            element:<Verifyotp/>
        },
        {
            path:"resetpassword",
            element:<ResetPassword/>
        }
    ]
    }
])
export default router
