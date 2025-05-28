import mongoose from 'mongoose';
import fs from 'fs';
import csvParser from 'csv-parser';
import { PropertyModel } from '../models/propertyModel';
import { UserModel } from '../models/usereModel';
import { Property } from '../types';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

async function seedDatabase() {
  try {
    mongoose.connect(process.env.DB_URL || '').then(
            () => { console.log("connected succesfully") }
        ).catch(err => {
            console.log(err);
        });   

    const hashedPassword = await bcrypt.hash('12345678', 10);
    const defaultUser = await UserModel.create({
      name: 'admin',
      email: 'testlife@gmail.com',
      password: hashedPassword,
    });

    const results: Property[] = [];

    fs.createReadStream('./src/data/data.csv')
      .on('error', async (err) => {
        console.error('Error reading CSV:', err);
        await mongoose.disconnect();
        process.exit(1);
      })
      .pipe(csvParser())
      .on('data', (data) => {
        results.push({
          ...data,
          isVerified: data.isVerified === 'True',
          createdBy: defaultUser._id,
        });
      })
      .on('end', async () => {
        try {
          await PropertyModel.insertMany(results);
          console.log('✅ CSV data imported successfully.');
        } catch (err) {
          console.error(' Error inserting properties:', err);
        } finally {
          await mongoose.disconnect();
          console.log('🔌 MongoDB disconnected.');
          process.exit(0);
        }
      });
  } catch (err) {
    console.error('Error during seeding:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
