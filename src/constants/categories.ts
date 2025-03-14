const CostOfLivingCategoryID = {
    Rent: 1,
    Airbnb: 2,
    Groceries: 3,
    Utilities: 4,
    PublicTransport: 5,
    Healthcare: 6,
    Education: 7,
    Entertainment: 8,
    DiningOut: 9,
    Clothing: 10,
    SportsAndLeisure: 11,
    Insurance: 12,
    Childcare: 14,
    Fitness: 15,
    InternetAndMobile: 16,
    PetCare: 17,
    HomeMaintenance: 18,
    CarOwnership: 19,
} as const;

type CostOfLivingCategoryID = typeof CostOfLivingCategoryID[keyof typeof CostOfLivingCategoryID];

export interface CostOfLivingCategory {
    id: CostOfLivingCategoryID;
    name: string;
    icon: string;
}

export const COST_OF_LIVING_CATEGORIES: CostOfLivingCategory[] = [
    {
        id: CostOfLivingCategoryID.Rent,
        name: "Rent (monthly)",
        icon: 'fa-solid fa-house'
    },
    {
        id: CostOfLivingCategoryID.Airbnb,
        name: "Airbnb (1 night)",
        icon: 'fa-brands fa-airbnb'
    },
    {
        id: CostOfLivingCategoryID.PublicTransport,
        name: "Public Transport",
        icon: 'fa-solid fa-bus'
    },
    {
        id: CostOfLivingCategoryID.Groceries,
        name: "Groceries",
        icon: 'fa-solid fa-cart-shopping'
    },
    {
        id: CostOfLivingCategoryID.Utilities,
        name: "Utilities (Monthly)",
        icon: 'fa-solid fa-bolt'
    },
    {
        id: CostOfLivingCategoryID.Healthcare,
        name: "Healthcare",
        icon: 'fa-solid fa-heart-pulse'
    },
    {
        id: CostOfLivingCategoryID.Education,
        name: "Education",
        icon: 'fa-solid fa-graduation-cap'
    },
    {
        id: CostOfLivingCategoryID.Entertainment,
        name: "Entertainment",
        icon: 'fa-solid fa-film'
    },
    {
        id: CostOfLivingCategoryID.DiningOut,
        name: "Dining Out",
        icon: 'fa-solid fa-utensils'
    },
    {
        id: CostOfLivingCategoryID.Clothing,
        name: "Clothing And Shoes",
        icon: 'fa-solid fa-shirt'
    },
    {
        id: CostOfLivingCategoryID.SportsAndLeisure,
        name: "Sports And Leisure",
        icon: 'fa-solid fa-volleyball'
    },
    {
        id: CostOfLivingCategoryID.Insurance,
        name: "Insurance",
        icon: 'fa-solid fa-shield'
    },
    {
        id: CostOfLivingCategoryID.Childcare,
        name: "Childcare",
        icon: 'fa-solid fa-baby'
    },
    {
        id: CostOfLivingCategoryID.Fitness,
        name: "Fitness And Gym",
        icon: 'fa-solid fa-dumbbell'
    },
    {
        id: CostOfLivingCategoryID.InternetAndMobile,
        name: "Internet And Mobile",
        icon: 'fa-solid fa-wifi'
    },
    {
        id: CostOfLivingCategoryID.PetCare,
        name: "Pet Care",
        icon: 'fa-solid fa-paw'
    },
    {
        id: CostOfLivingCategoryID.HomeMaintenance,
        name: "Home Maintenance",
        icon: 'fa-solid fa-screwdriver-wrench'
    },
    {
        id: CostOfLivingCategoryID.CarOwnership,
        name: "Car Ownership",
        icon: 'fa-solid fa-car-side'
    },
];

export type CostOfLivingCategoryNames = typeof COST_OF_LIVING_CATEGORIES[number]['name'];