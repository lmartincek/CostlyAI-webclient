export const months: { readonly [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
} as const

export const daysAsOrdinals: { readonly [key: number]: string }  = {
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th",
} as const