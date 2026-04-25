import { connectDatabase } from "./config/database";
import { User } from "./models/User";

const seed = async () => {
  await connectDatabase();

  console.log("🌱 Seeding database...");

  // Create admin user (the business owner)
  const existingAdmin = await User.findOne({ role: "ADMIN" });
  if (!existingAdmin) {
    await User.create({
      email: "jpatrikar1@gmail.com",
      phone: "+917875132513",
      name: "Image Tours Admin",
      password: "Admin@1234",
      role: "ADMIN",
      isVerified: true,
      isActive: true,
    });
    console.log("✅ Admin user created: jpatrikar1@gmail.com / Admin@1234");
  } else {
    console.log("ℹ️  Admin already exists, skipping");
  }

  // Create a test customer
  const existingCustomer = await User.findOne({ email: "testcustomer@example.com" });
  if (!existingCustomer) {
    await User.create({
      email: "testcustomer@example.com",
      phone: "+919876543210",
      name: "Test Customer",
      password: "Customer@123",
      role: "CUSTOMER",
      isVerified: true,
      isActive: true,
    });
    console.log("✅ Test customer created: testcustomer@example.com / Customer@123");
  }

  console.log("🌱 Seeding complete!");
  process.exit(0);
};

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
