import { BrowserRouter, createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import Verifyotp from "../pages/Verifyotp.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import UserMenuMobile from "../pages/UserMenuMobile.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import MyOrder from "../pages/MyOrder.jsx";
import OrderManagement from "../pages/OrderManagement.jsx";
import Category from "../pages/Category.jsx";
import Sub_Category from "../pages/Sub_Category.jsx";
import Upload_product from "../pages/Upload_product.jsx";
import Product_Admin from "../pages/Product_Admin.jsx";
import Permision from "../layouts/Permision.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDisplayPage from "../pages/ProductDisplayPage.jsx";
import CartMobile from "../pages/CartMobile.jsx";
// Checkout removed - integrated into cart/sidebar

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
                    path:"order-management",
                    element:<Permision><OrderManagement/></Permision>
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
                }]
            },
            {
                path:":category",
                children:[
                    {
                        path:":subCategory",
                        element:<ProductListPage/>
                    }
                ]
            },
             {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
             {
                path : 'cart',
                element : <CartMobile/>
            }
        ]
    }
])
export default router

