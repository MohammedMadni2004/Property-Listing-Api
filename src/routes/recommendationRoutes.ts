import express from "express";
import validateRequest from "../middleware/validateRequest";
import {
  searchRecipient,
  recommendProperty,
  getRecommendations,
} from "../controllers/recommendationController";

const recommendationRoutes = express.Router();

recommendationRoutes.get("/searchRecipient", validateRequest, searchRecipient);
recommendationRoutes.post(
  "/recommendProperty",
  validateRequest,
  recommendProperty
);
recommendationRoutes.get(
  "/getRecommendations",
  validateRequest,
  getRecommendations
);

export default recommendationRoutes;
