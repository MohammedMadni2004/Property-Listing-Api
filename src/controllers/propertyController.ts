import z from "zod";
import { PropertyModel } from "../models/propertyModel";
import propertySchema from "../schemas/propetySchema";
import { CustomRequest } from "../types/request";
import { Response, Request } from "express";
import { querySchema, putSchema } from "../schemas/querySchema";
import redisClient from "../providers/redis";
import { invalidateCache, normalizeCacheKey } from "../utils/cacheUtils";

const queryThreshold = 2;
const queryCounts: Record<string, number> = {};

const client = redisClient;

async function createProperty(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const validatedData = propertySchema.parse(req.body);
  const userId = req.user?._id;
  
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return; 
  }
  
  const propertyData = {
    ...validatedData,
    createdBy: userId,
  };
  
  try {
    await PropertyModel.create(propertyData);
    res.status(201).json({ message: "Property created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid property data" });
      return;
    }
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllProperties(req: Request, res: Response): Promise<void> {
  const cacheKey = normalizeCacheKey(req.query);
  queryCounts[cacheKey] = (queryCounts[cacheKey] || 0) + 1;

  try {
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return; 
    }

    const properties = await PropertyModel.find().select("-_id");
    
    if (queryCounts[cacheKey] >= queryThreshold) {
      await client.setex(cacheKey, 3600, JSON.stringify(properties));
    }
    
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getPropertiesByQuery(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const query = querySchema.parse(req.query);
    const cacheKey = normalizeCacheKey(query);
    queryCounts[cacheKey] = (queryCounts[cacheKey] || 0) + 1;

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return; 
    }

    const properties = await PropertyModel.find(query);
    
    if (!properties.length) {
      res.status(404).json({ message: "No properties found matching the query" });
      return; 
    }

    if (queryCounts[cacheKey] >= queryThreshold) {
      await client.setex(cacheKey, 3600, JSON.stringify(properties));
    }

    res.status(200).json(properties);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid query parameters:", error);
      console.log('something')
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteProperty(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const propertyId = req.params.id;
  const userId = req.user?._id;
  
  try {
    const deletedProperty = await PropertyModel.findOneAndDelete({
      id: propertyId,
      createdBy: userId,
    });
    
    if (!deletedProperty) {
      res.status(404).json({ 
        error: "Property not found or you do not own this property" 
      });
      return; 
    }

    const cacheKey = `cache:property:${propertyId}`;
    invalidateCache(cacheKey);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProperty(
  req: CustomRequest, 
  res: Response
): Promise<void> {
  try {
    const propertyId = req.params.id;
    const userId = req.user?._id;
    const validatedData = putSchema.parse(req.body);
    
    const property = await PropertyModel.findOneAndReplace(
      { id: propertyId, createdBy: userId },
      { ...validatedData, createdBy: userId },
      { new: true }
    );
    
    if (!property) {
      res.status(404).json({ 
        error: "Property not found or you do not own this property" 
      });
      return; 
    }

    const cacheKey = `cache:property:${propertyId}`;
    invalidateCache(cacheKey);

    res.status(200).json({ 
      message: "Property updated successfully", 
      property 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid property data" });
      return;
    }
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  createProperty,
  getAllProperties,
  getPropertiesByQuery,
  deleteProperty,
  updateProperty,
};