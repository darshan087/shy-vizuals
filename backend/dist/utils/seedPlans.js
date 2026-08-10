"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = __importDefault(require("../config/prisma"));
const plans = [
    {
        name: "Car Delivery",
        description: "Cinematic car delivery reel",
        price: 3000,
    },
    {
        name: "Bike Delivery",
        description: "Cinematic bike delivery reel",
        price: 2000,
    },
    {
        name: "Shops Promotion",
        description: "Professional promotional reel for shops and businesses",
        price: 5000,
    },
    {
        name: "Model Shoot",
        description: "Cinematic model photography and video shoot",
        price: 4000,
    },
    {
        name: "Brand Shoot",
        description: "Professional commercial content for brands",
        price: 6000,
    },
    {
        name: "Pre Wedding",
        description: "Cinematic pre-wedding video and photography",
        price: 10000,
    },
];
const seedPlans = async () => {
    try {
        for (const plan of plans) {
            const existingPlan = await prisma_1.default.plan.findFirst({
                where: {
                    name: plan.name,
                },
            });
            if (existingPlan) {
                console.log(`Already exists: ${plan.name}`);
                continue;
            }
            await prisma_1.default.plan.create({
                data: plan,
            });
            console.log(`Created: ${plan.name} - ₹${plan.price}`);
        }
        console.log("Plans seeding completed.");
    }
    catch (error) {
        console.error("Seed plans error:", error);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
};
seedPlans();
