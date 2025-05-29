import z from "zod";
import { PropertyModel } from "../models/propertyModel";
import propertySchema from "../schemas/propetySchema";
import { CustomRequest } from "../types/Request";
import { Response, Request } from "express";
import querySchema from "../schemas/querySchema";

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
        const properties = await PropertyModel.find().select('-_id');
        return res.status(200).json(properties);
    }catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getPropertiesByQuery(req: Request, res: Response) {
   const query = querySchema.parse(req.query);
   try{
    const properties = await PropertyModel.find(query);
    if (properties.length === 0) {
        return res.status(404).json({ message: "No properties found matching the query" });
    }
    return res.status(200).json(properties);

   }catch (error) {
    if(error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid query parameters" });
    }
        console.error("Error fetching property by query:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteProperty(req: CustomRequest, res: Response) {
    const propertyId = req.params.id;
    const userId = req.user?._id;
    try{
        const deletedProperty = await PropertyModel.findOneAndDelete({ id: propertyId, createdBy: userId });
        if (!deletedProperty) {
            return res.status(404).json({ error: "Property not found or you do not own this property" });
        }
        return res.status(200).json({ message: "Property deleted successfully" });

    }catch (error) {
        console.error("Error deleting property:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { createProperty, getAllProperties, getPropertiesByQuery, deleteProperty };