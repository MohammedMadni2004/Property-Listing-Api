import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { createProperty, getAllProperties, getPropertiesByQuery, updateProperty } from '../controllers/propertyController';
import checkPropertyOwner from '../middleware/checkPropertyOwner';
import { de } from 'zod/v4/locales';

const propertyRoutes = express.Router();

propertyRoutes.post('/createProperty',validateRequest, createProperty );
propertyRoutes.get('/getAllPropertiesa',getAllProperties);
propertyRoutes.get('getPropertyByQuery', getPropertiesByQuery);

propertyRoutes.delete('/deleteProperty/:id',validateRequest, checkPropertyOwner, deleteProperty);
propertyRoutes.put('/updateProperty/:id',validateRequest, checkPropertyOwner, updateProperty);

export default propertyRoutes;