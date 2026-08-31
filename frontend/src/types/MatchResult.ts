/**
 * Defines one restaurant's ranked voting result.
 */
export interface MatchResult {
    restaurantId: number;
    restaurant: string;
    yesVotes: number;
    participants: number;
    matchPercentage: number;
}