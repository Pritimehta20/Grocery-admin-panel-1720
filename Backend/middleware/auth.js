import jwt from 'jsonwebtoken'

const auth = async (request, response, next) => {
  try {
    console.log('🔐 auth middleware - Headers:', request.headers.authorization ? 'Bearer FOUND' : 'NO TOKEN');
    console.log('🔐 auth middleware - Cookies:', !!request.cookies.accessToken);
    
    const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
   
    if(!token){
      console.log('🚫 NO TOKEN');
      return response.status(401).json({
        message : "Login or Register "
      })
    }

    console.log('🔓 Verifying token...');
    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

    if(!decode){
      console.log('🚫 INVALID TOKEN');
      return response.status(401).json({
        message : "unauthorized access",
        error : true,
        success : false
      })
    }

    console.log('✅ TOKEN OK - userId:', decode.id);
    request.userId = decode.id

    next()

  } catch (error) {
    console.error('💥 auth error:', error.message);
    return response.status(500).json({
      message : "You have not login",
      error : true,
      success : false
    })
  }
}

export default auth
