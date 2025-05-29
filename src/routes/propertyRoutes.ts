import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { createProperty, getAllProperties } from '../controllers/propertyController';

const propertyRoutes = express.Router();

propertyRoutes.post('/createProperty',validateRequest, createProperty );
propertyRoutes.get('/getAllPropertiesa',getAllProperties)