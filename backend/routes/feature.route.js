import express from 'express';
import { createFeature, getAllFeatures, deleteFeature } from '../controllers/feature.controller.js';


const router = express.Router();

router.post('/create', createFeature);
router.get('/all', getAllFeatures);
router.delete('/delete/:id', deleteFeature);

export default router;