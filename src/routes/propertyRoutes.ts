import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { createProperty, getAllProperties, getPropertiesByQuery } from '../controllers/propertyController';

const propertyRoutes = express.Router();

propertyRoutes.post('/createProperty',validateRequest, createProperty );
propertyRoutes.get('/getAllPropertiesa',getAllProperties);
propertyRoutes.get('getPropertyByQuery', getPropertiesByQuery);

export default propertyRoutes;