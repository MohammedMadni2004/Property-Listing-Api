import z from "zod";
import { PropertyModel } from "../models/propertyModel";
import propertySchema from "../schemas/propetySchema";
import { CustomRequest } from "../types/Request";
import { Response } from "express";
import { ca } from "zod/v4/locales";

async function createProperty(req: CustomRequest, res: Response){
    const validatedData = propertySchema.parse(req.body);
    const userId = req.user?._id;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const propertyData = {
        ...validatedData,
        createdBy: userId,
    };
    try{
        await PropertyModel.create(propertyData);
        return res.status(201).json({ message: "Property created successfully" });
    }catch (error) {
        if (error instanceof z.ZodError){
            return res.status(400).json({ error: "Invalid property data" });
        }
        console.error("Error creating property:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

async function getAllProperties(req: Request, res: Response) {
    try{
        const properties = await PropertyModel.find();
        return res.status(200).json(properties);
    }catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { createProperty, getAllProperties };