import { CustomRequest } from "../types/request";
import { Response, NextFunction } from "express";
import { PropertyModel } from "../models/propertyModel";


async function checkPropertyOwner(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    const propertyId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }

    try {
        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            res.status(404).json({ error: "Property not found" });
            return 
        } 

        if (property.createdBy.toString() !== userId.toString()) {
            res.status(403).json({ error: "You do not own this property" });
            return;
        }

        next();
    } catch (error) {
        console.error("Error checking property owner:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}

export default checkPropertyOwner;