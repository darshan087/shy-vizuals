"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const createOwner = async () => {
    const email = "shyvizuals@gmail.com";
    const password = "ShyVizuals@123";
    const existingOwner = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingOwner) {
        console.log("Owner already exists.");
        await prisma_1.default.$disconnect();
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const owner = await prisma_1.default.user.create({
        data: {
            email,
            passwordHash,
            role: "OWNER",
        },
    });
    console.log("Owner created successfully:");
    console.log(owner.email);
    await prisma_1.default.$disconnect();
};
createOwner().catch(async (error) => {
    console.error(error);
    await prisma_1.default.$disconnect();
    process.exit(1);
});
