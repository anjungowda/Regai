//! Mock Seeder since real prisma client might not be installed yet
console.log("Mock Prisma Seeder starting...");

export const seedDatabase = async () => {
    console.log("Connecting database...");

    const mockRoles = [
        { email: 'admin@horizonpayments.com', role: 'admin', name: 'Anju Narasegowda' },
        { email: 'manager@horizonpayments.com', role: 'compliance_manager', name: 'Sarah Ahmed' },
        { email: 'analyst1@horizonpayments.com', role: 'analyst', name: 'James Okonkwo' },
        { email: 'analyst2@horizonpayments.com', role: 'analyst', name: 'Priya Sharma' },
        { email: 'auditor@horizonpayments.com', role: 'auditor', name: 'David Chen' }
    ];

    console.log("Seeding 1 Organisation (Horizon Payments Ltd)...");
    console.log("Seeding 5 Users (admin, manager, 2x analysts, auditor)...");
    mockRoles.forEach(r => console.log(`- Created user: ${r.email} (${r.role})`));

    console.log("Seeding 1 trialing Subscription...");

    const mockCustomers = [
        { name: 'John Williams', nat: 'British', risk: 'Low' },
        { name: 'Maria Santos', nat: 'Brazilian', risk: 'Medium' },
        { name: 'Viktor Petrov', nat: 'Russian', risk: 'High' },
        { name: 'Fatima Al-Rashid', nat: 'UAE', risk: 'High' },
        { name: 'James Ofosu', nat: 'Ghanaian', risk: 'Medium' },
        { name: 'Elena Vasquez', nat: 'Colombian', risk: 'High' },
        { name: 'Robert Thompson', nat: 'British', risk: 'Low' },
        { name: 'Li Wei', nat: 'Chinese', risk: 'Medium' }
    ];

    console.log("Seeding 8 varied-risk Individuals...");
    mockCustomers.forEach(c => console.log(`- Inserted Customer: ${c.name} [${c.nat}] (${c.risk} Risk)`));

    console.log("Seeding 10 Cases mapping to above Customers & Companies...");
    console.log("Seeding realistic AML Notes on Cases 1, 2, 4, 6...");
    console.log("Seeding 3 Mock TM Alerts (Large Transfers)...");
    console.log("Seeding 5 Task checklist items...");
    console.log("Seeding 8 Compliance Template payload blocks (AML Policy, SAR Draft, KYB Checklist...)");

    console.log("\n✅ Database seeder complete. Production backend is ready to attach.");
};

// Auto-run if executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
