import z from "zod";
import { PropertyModel } from "../models/propertyModel";
import propertySchema from "../schemas/propetySchema";
import { CustomRequest } from "../types/Request";
import { Response, Request } from "express";
import { querySchema, putSchema } from '../schemas/querySchema';
import redis from "redis";
import { normalizeCacheKey } from "../middleware/checkCache";

const client = redis.createClient();
const queryThreshold = 2; 
const queryCounts: Record<string, number> = {}; 

client.on("error", (err) => {
  console.error("Redis error:", err);
});

async function createProperty(req: CustomRequest, res: Response) {
  const validatedData = propertySchema.parse(req.body);
  const userId = req.user?._id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const propertyData = {
    ...validatedData,
    createdBy: userId,
  };
  try {
    await PropertyModel.create(propertyData);
    return res.status(201).json({ message: "Property created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid property data" });
    }
    console.error("Error creating property:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllProperties(req: Request, res: Response) {
  const cacheKey = normalizeCacheKey(req.query);
  queryCounts[cacheKey] = (queryCounts[cacheKey] || 0) + 1;

  client.get(cacheKey, async (err, cachedData) => {
    if (err) {
      console.error("Redis get error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    try {
      const properties = await PropertyModel.find().select("-_id");
      if (queryCounts[cacheKey] >= queryThreshold) {
        client.setex(cacheKey, 3600, JSON.stringify(properties));
      }
      return res.status(200).json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function getPropertiesByQuery(req: Request, res: Response) {
  try {
    const query = querySchema.parse(req.query);
    const cacheKey = normalizeCacheKey(query);
    queryCounts[cacheKey] = (queryCounts[cacheKey] || 0) + 1;

    client.get(cacheKey, async (err, cachedData) => {
      try {
        if (err) {
          console.error("Redis get error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (cachedData) {
          return res.status(200).json(JSON.parse(cachedData));
        }

        const properties = await PropertyModel.find(query);

        if (!properties.length) {
          return res.status(404).json({ message: "No properties found matching the query" });
        }

        if (queryCounts[cacheKey] >= queryThreshold) {
          client.setex(cacheKey, 3600, JSON.stringify(properties));
        }

        return res.status(200).json(properties);
      } catch (callbackErr) {
        console.error("Error inside Redis callback:", callbackErr);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }
    console.error("Error fetching properties:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


async function deleteProperty(req: CustomRequest, res: Response) {
  const propertyId = req.params.id;
  const userId = req.user?._id;
  try {
    const deletedProperty = await PropertyModel.findOneAndDelete({
      id: propertyId,
      createdBy: userId,
    });
    if (!deletedProperty) {
      return res
        .status(404)
        .json({ error: "Property not found or you do not own this property" });
    }
    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProperty(req: CustomRequest, res: Response) {
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
      return res
        .status(404)
        .json({ error: "Property not found or you do not own this property" });
    }
    return res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid property data" });
    }
    console.error("Error updating property:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export {
  createProperty,
  getAllProperties,
  getPropertiesByQuery,
  deleteProperty,
  updateProperty,
};
