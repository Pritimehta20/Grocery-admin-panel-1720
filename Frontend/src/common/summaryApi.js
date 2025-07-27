export const baseUrl="http://localhost:8080"

const summaryApi={
    register:{
        url:'/api/user/register',
        method:'post'
    },
    login:{
        url:'/api/user/login',
        method:'post'
    },
    forgot_password:{
        url:'/api/user/forgotpassword',
        method:'put'
    },
    verify_otp:{
        url:'/api/user/verify-forgot-pass-otp',
        method:'put'
    },
    reset_pass:{
        url:'/api/user/resetpass',
        method:'put'
    },
    refreshToken:{
        url:'/api/user/refreshtoken',
        method:'post'
    }
}
export default summaryApi