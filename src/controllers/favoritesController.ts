import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { PropertyModel } from "../models/propertyModel";
import { CustomRequest } from "../types/request";

export async function addFavorite(req: CustomRequest, res: Response): Promise<void> {
  const { propertyId } = req.body;
  const userId = req.user?._id;
  
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  
  try {
    const property = await PropertyModel.findById(propertyId);
    
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    if (user.favorites.some(fav => fav.toString() === propertyId.toString())) {
      res.status(400).json({ error: "Property already in favorites" });
      return;
    }
    
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { favorites: propertyId } }
    );
    
    res.status(200).json({ message: "Property added to favorites" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeFavorite(req: CustomRequest, res: Response): Promise<void> {
  const { propertyId } = req.params;
  const userId = req.user?._id;
  
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  
  try {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    if (!user.favorites.toString().includes(propertyId)) {
      res.status(400).json({ error: "Property not in favorites" });
      return;
    }
    
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { favorites: propertyId } }
    );
    
    res.status(200).json({ message: "Property removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFavorites(req: CustomRequest, res: Response): Promise<void> {
  const userId = req.user?._id;
  
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  
  try {
    const user = await UserModel.findById(userId).populate("favorites");
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}