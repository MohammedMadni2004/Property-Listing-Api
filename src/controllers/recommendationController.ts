import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { PropertyModel } from "../models/propertyModel";
import { CustomRequest } from "../types/Request";

export async function searchRecipient(req: Request, res: Response) {
  const { recipientEmail } = req.query;

  if (!recipientEmail) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  try {
    const recipient = await UserModel.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    return res.status(200).json({
      recipient: {
        id: recipient._id,
        email: recipient.email,
        name: recipient.name,
      },
    });
  } catch (error) {
    console.error("Error searching recipient:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function recommendProperty(req: CustomRequest, res: Response) {
  const { recipientId, propertyId } = req.body;
  const recommendingUserId = req.user?._id;

  if (!recommendingUserId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const recipient = await UserModel.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    recipient.recommendationsReceived.push({
      propertyId: property.id,
      recommendedBy: recommendingUserId,
    });

    await recipient.save();

    return res
      .status(200)
      .json({ message: "Property recommended successfully" });
  } catch (error) {
    console.error("Error recommending property:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRecommendations(req: CustomRequest, res: Response) {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await UserModel.findById(userId).populate(
      "recommendationsReceived.recommendedBy",
      "name email"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ recommendations: user.recommendationsReceived });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
