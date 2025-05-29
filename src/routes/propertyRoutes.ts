import express from 'express';
import validateRequest from '../middleware/validateRequest';

const propertyRoutes = express.Router();

propertyRoutes.post('/createProperty',validateRequest, )