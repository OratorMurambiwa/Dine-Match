/**
 * Defines a participant's vote for one restaurant.
 */
export interface Vote {
    participantId: number;
    restaurantId: number;
    vote: boolean;
}