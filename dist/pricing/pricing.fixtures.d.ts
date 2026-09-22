export interface PricingCase {
    label: string;
    input: {
        priceHTCents: number;
        vatPercent?: number;
        uptakeForm?: string;
        cardCountry?: string;
    };
    expected: {
        vatCents: number;
        platformFeeCents: number;
        subtotalCents: number;
        stripeFeeCents: number;
        totalCents: number;
        netSellerCents: number;
        isPeriodic: boolean;
    };
}
export declare const PRICING_CASES: PricingCase[];
