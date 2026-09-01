import "dotenv/config";

import {
    FoursquareRestaurantService,
} from "./services/FoursquareRestaurantService";


/**
 * Tests the Foursquare restaurant API connection.
 */
export class FoursquareApiTest {

    /**
     * Searches for sample restaurants and prints the results.
     */
    public async run(): Promise<void> {
        try {
            const foursquareService =
                new FoursquareRestaurantService();

            const restaurants =
                await foursquareService.search({
                    location: "San Fransisco, CA",
                    radiusMiles: 10,
                    cuisine: "Mexican",
                });

            console.log("Foursquare connection successful.");
            console.log(restaurants);

        } catch (error) {
            console.error(
                "Foursquare connection failed.",
            );

            console.error(error);
        }
    }
}


const foursquareApiTest =
    new FoursquareApiTest();

foursquareApiTest.run();