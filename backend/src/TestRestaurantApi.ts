import "dotenv/config";
import { FoursquareRestaurantService } from "./services/FoursquareRestaurantService";

async function main(): Promise<void> {
    const service = new FoursquareRestaurantService();

    const restaurants = await service.search({
        location: "San Francisco, CA",
        radiusMiles: 10,
        cuisine: "Mexican",
        minPrice: 1,
        maxPrice: 2,
        minRating: 0,
    });

    console.log(`Found ${restaurants.length} restaurants.`);

    console.table(
        restaurants.map((restaurant) => ({
            name: restaurant.name,
            address: restaurant.address,
            rating: restaurant.rating ?? "Unavailable",
            price: restaurant.priceLevel ?? "Unavailable",
        })),
    );
}

main().catch((error: unknown) => {
    console.error(
        error instanceof Error ? error.message : "API test failed.",
    );
    process.exitCode = 1;
});