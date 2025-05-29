import { CustomRequest } from "../types/Request";
import { Response, NextFunction } from "express";
import { PropertyModel } from "../models/propertyModel";


async function checkPropertyOwner(req: CustomRequest, res: Response, next: NextFunction) {
    const propertyId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        if (property.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You do not own this property" });
        }

        next();
    } catch (error) {
        console.error("Error checking property owner:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default checkPropertyOwner;