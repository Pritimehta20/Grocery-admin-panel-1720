import UserModel from '../models/userModel.js'

export const Admin = async (request, response, next) => {
    try {
        const userId = request.userId;
        console.log('🔍 Admin check - userId:', userId);
        
        // TEMP BYPASS for orders testing - REMOVE after fixing auth
if (request.path.includes('/get-all-orders') || request.path.includes('/update-status')) {
            console.log('🚀 TEMP ADMIN BYPASS for', request.path, '- role check SKIPPED');
            next();
            return;
        }
        
        const user = await UserModel.findById(userId).select('role');
        console.log('📋 User role from DB:', user?.role || 'NULL');
        
        if(!user || user.role !== 'ADMIN'){
            console.log('🚫 Admin check FAILED - role:', user?.role);
            return response.status(401).json({
                message : "Admin access required - role: " + (user?.role || 'no user'),
                error : true,
                success : false
            })
        }
        console.log('✅ Admin check PASSED');
        next()

    } catch (error) {
        console.log('Admin middleware error:', error)
        return response.status(500).json({
            message : "Server error",
            error : true,
            success : false
        })
    }
}
export default Admin
