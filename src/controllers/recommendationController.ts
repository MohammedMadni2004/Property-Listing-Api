import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { PropertyModel } from "../models/propertyModel";
import { CustomRequest } from "../types/request";
import { sendEmail } from "../utils/emailUtils";

export async function searchRecipient(req: Request, res: Response): Promise<void> {
  const { recipientEmail } = req.query;
  
  if (!recipientEmail) {
    res.status(400).json({ error: "Recipient email is required" });
    return;
  }
  
  try {
    const recipient = await UserModel.findOne({ email: recipientEmail });
    
    if (!recipient) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }
    
    res.status(200).json({
      recipient: {
        id: recipient._id,
        email: recipient.email,
        name: recipient.name,
      },
    });
  } catch (error) {
    console.error("Error searching recipient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function recommendProperty(req: CustomRequest, res: Response): Promise<void> {
  const { recipientEmail, propertyId } = req.body;
  const recommendingUserId = req.user?._id;
  
  if (!recommendingUserId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  
  try {
    const recipient = await UserModel.findOne({ email: recipientEmail });
    
    if (!recipient) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }
    
    const property = await PropertyModel.findOne({id:propertyId});
    
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    
    if (property.createdBy.toString() === recipient._id.toString()) {
      res.status(400).json({ error: "You cannot recommend the recipient's own property" });
      return;
    }
    
    await UserModel.updateOne(
      { _id: recipient._id },
      {
        $addToSet: {
          recommendationsReceived: {
            propertyId: property.id,
            recommendedBy: recommendingUserId,
          },
        },
      }
    );
    
    const emailSubject = "New Property Recommendation";
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const propertyLink = `${appUrl}/getPropertyByQuery?id=${property.id}`;
    const emailText = `Hello ${recipient.name},\n\nYou have received a new property recommendation. Check it out here: ${propertyLink}\n\nBest regards,\nProperty Listing Team`;
    
    await sendEmail(recipient.email, emailSubject, emailText);
    
    res.status(200).json({ message: "Property recommended successfully and email sent" });
  } catch (error) {
    console.error("Error recommending property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRecommendations(req: CustomRequest, res: Response): Promise<void> {
  const userId = req.user?._id;
  
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  
  try {
    const user = await UserModel.findById(userId).populate(
      "recommendationsReceived.recommendedBy",
      "name email"
    );
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const recommendations = user.recommendationsReceived;
    
    if (recommendations.length === 0) {
      res.status(200).json({ message: "No property recommendations received yet", recommendations: [] });
      return;
    }
    
    res.status(200).json({ recommendations: user.recommendationsReceived });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}