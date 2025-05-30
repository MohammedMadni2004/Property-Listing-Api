import express from "express";
import validateRequest from "../middleware/validateRequest";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favoritesController";

const favoritesRoutes = express.Router();

favoritesRoutes.post("/addFavorite", validateRequest, addFavorite);
favoritesRoutes.delete(
  "/removeFavorite/:propertyId",
  validateRequest,
  removeFavorite
);
favoritesRoutes.get("/getFavorites", validateRequest, getFavorites);

export default favoritesRoutes;
