import { BrowserRouter, createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Verifyotp from "../pages/Verifyotp";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrder from "../pages/MyOrder";
import Address from "../pages/Address";
import Category from "../pages/Category";
import Sub_Category from "../pages/Sub_Category";
import Upload_product from "../pages/Upload_product";
import Product_Admin from "../pages/Product_Admin";
import Permision from "../layouts/Permision";

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
        },{
            path:"usermenu",
            element:<UserMenuMobile/>
        },
        {
            path:"dashboard",
            element:<Dashboard/>,
            children:[
                {
                    path:"profile",
                    element:<Profile/>
                },
                {
                    path:"myorder",
                    element:<MyOrder/>
                },
                {
                    path:"saveaddress",
                    element:<Address/>
                },
                {
                    path:"category",
                    element:<Permision><Category/></Permision>
                },
                {
                    path:"sub_category",
                    element:<Permision><Sub_Category/></Permision>
                },
                {
                    path:"upload_product",
                    element:<Permision><Upload_product/></Permision>
                },{
                    path:'product_admin',
                    element:<Permision><Product_Admin/></Permision>
                },{
                    path:''
                }
            ]
        }
    ]
    }
])
export default router
