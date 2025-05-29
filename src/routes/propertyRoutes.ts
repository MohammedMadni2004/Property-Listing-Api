import express from "express";
import validateRequest from "../middleware/validateRequest";
import {
  createProperty,
  getAllProperties,
  getPropertiesByQuery,
  updateProperty,
} from "../controllers/propertyController";
import checkPropertyOwner from "../middleware/checkPropertyOwner";
import checkCache from "../middleware/checkCache"; // Middleware to check Redis cache

const propertyRoutes = express.Router();

propertyRoutes.post("/createProperty", validateRequest, createProperty);
propertyRoutes.get("/getAllProperties", checkCache, getAllProperties); // Corrected route and added caching middleware
propertyRoutes.get("/getPropertyByQuery", checkCache, getPropertiesByQuery); // Added caching middleware

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
