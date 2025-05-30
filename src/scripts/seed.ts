import mongoose from "mongoose";
import fs from "fs";
import csvParser from "csv-parser";
import { PropertyModel } from "../models/propertyModel";
import { UserModel } from "../models/userModel";
import { Property, PropertyType, FurnishingType, ListedBy, ListingType } from "../types/property";
import bcrypt from "bcrypt";
import { connectDatabase, disconnectDatabase } from "../config";

async function seedDatabase() {
  try {
    await connectDatabase();

    const hashedPassword = await bcrypt.hash("12345678", 10);
    const defaultUser = await UserModel.create({
      name: "admin",
      email: "testlife@gmail.com",
      password: hashedPassword,
    });

    const results: Property[] = [];

    fs.createReadStream("./src/data/data.csv")
      .on("error", async (err: Error) => {
        console.error("Error reading CSV:", err);
        await mongoose.disconnect();
        process.exit(1);
      })
      .pipe(csvParser())
      .on("data", (data: Record<string, string>) => {
        if (!data.id) return;

        const property: Property = {
          id: data.id,
          title: data.title,
          type: data.type as PropertyType,
          price: parseFloat(data.price),
          state: data.state,
          city: data.city,
          areaSqFt: parseInt(data.areaSqFt, 10),
          bedrooms: parseInt(data.bedrooms, 10),
          bathrooms: parseInt(data.bathrooms, 10),
          amenities: data.amenities.split("|"),
          furnished: data.furnished as FurnishingType,
          availableFrom: new Date(data.availableFrom),
          listedBy: data.listedBy as ListedBy,
          tags: data.tags.split("|"),
          colorTheme: data.colorTheme,
          rating: parseFloat(data.rating),
          isVerified: data.isVerified.toLowerCase() === "true",
          listingType: data.listingType as ListingType,
          createdBy: defaultUser._id,
        };

        results.push(property);
      })
      .on("end", async () => {
        try {
          await PropertyModel.insertMany(results);
          console.log("✅ CSV data imported successfully.");
        } catch (err) {
          console.error("Error inserting properties:", err);
        } finally {
          disconnectDatabase();
        }
      });
  } catch (err) {
    console.error("Error during seeding:", err);
    disconnectDatabase();
    process.exit(1);
  }
}

seedDatabase();
