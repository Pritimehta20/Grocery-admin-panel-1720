import { Router } from 'express';
import auth from '../middleware/auth.js';
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from '../controllers/subCategory.controller.js';

export const subcategoryRouter=Router()
subcategoryRouter.post('/create',auth,AddSubCategoryController)
subcategoryRouter.post('/get',getSubCategoryController)
subcategoryRouter.put('/update',auth,updateSubCategoryController)
subcategoryRouter.delete('/delete',auth,deleteSubCategoryController)