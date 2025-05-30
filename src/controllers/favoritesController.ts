import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { PropertyModel } from "../models/propertyModel";
import { CustomRequest } from "../types/Request";

export async function addFavorite(req: CustomRequest, res: Response) {
  const { propertyId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.favorites.some(fav => fav.toString() === propertyId.toString())) {
        return res.status(400).json({ error: "Property already in favorites" });
      }      
     await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { favorites: propertyId } }
    );

    return res.status(200).json({ message: "Property added to favorites" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeFavorite(req: CustomRequest, res: Response) {
  const { propertyId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.favorites.toString().includes(propertyId)) {
      return res.status(400).json({ error: "Property not in favorites" });
    }
     await UserModel.updateOne(
      { _id: userId },
      { $pull: { favorites: propertyId } }
    );
    return res.status(200).json({ message: "Property removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFavorites(req: CustomRequest, res: Response) {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await UserModel.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
