import express from "express";
import validateRequest from "../middleware/validateRequest";
import {
  createProperty,
  getAllProperties,
  getPropertiesByQuery,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";
import checkPropertyOwner from "../middleware/checkPropertyOwner";
import checkCache from "../middleware/checkCache"; 

const propertyRoutes = express.Router();

propertyRoutes.post("/createProperty", validateRequest, createProperty);
propertyRoutes.get("/getAllProperties", checkCache, getAllProperties); 
propertyRoutes.get("/getPropertyByQuery", checkCache, getPropertiesByQuery); 
propertyRoutes.get(
  "/getPropertyById",
  checkCache,
  getPropertiesByQuery
);

propertyRoutes.delete(
  "/deleteProperty/:id",
  validateRequest,
  checkPropertyOwner,
  deleteProperty
);
propertyRoutes.put(
  "/updateProperty/:id",
  validateRequest,
  checkPropertyOwner,
  updateProperty
);

export default propertyRoutes;
