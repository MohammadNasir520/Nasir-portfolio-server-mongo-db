/**
 * Canonical reference data: the 64 districts of Bangladesh.
 *
 * This lives server-side and is served over `GET /travel/districts` so the
 * frontend never keeps a second copy that can drift. It is also the source of
 * the zod enum, which is what stops a typo like "Coxs Bazar" from silently
 * under-counting the district progress metric.
 */
export type BdDistrict = {
  name: string;
  division: string;
  /** Deliberately outside the travel goal. */
  excluded?: boolean;
};

export const BD_DISTRICTS: BdDistrict[] = [
  // Barishal
  { name: "Barguna", division: "Barishal" },
  { name: "Barishal", division: "Barishal" },
  { name: "Bhola", division: "Barishal" },
  { name: "Jhalokati", division: "Barishal" },
  { name: "Patuakhali", division: "Barishal" },
  { name: "Pirojpur", division: "Barishal" },
  // Chattogram
  { name: "Bandarban", division: "Chattogram" },
  { name: "Brahmanbaria", division: "Chattogram" },
  { name: "Chandpur", division: "Chattogram" },
  { name: "Chattogram", division: "Chattogram" },
  { name: "Cumilla", division: "Chattogram" },
  { name: "Cox's Bazar", division: "Chattogram" },
  { name: "Feni", division: "Chattogram" },
  { name: "Khagrachhari", division: "Chattogram" },
  { name: "Lakshmipur", division: "Chattogram" },
  { name: "Noakhali", division: "Chattogram" },
  { name: "Rangamati", division: "Chattogram" },
  // Dhaka
  { name: "Dhaka", division: "Dhaka" },
  { name: "Faridpur", division: "Dhaka" },
  { name: "Gazipur", division: "Dhaka" },
  { name: "Gopalganj", division: "Dhaka" },
  { name: "Kishoreganj", division: "Dhaka" },
  { name: "Madaripur", division: "Dhaka" },
  { name: "Manikganj", division: "Dhaka" },
  { name: "Munshiganj", division: "Dhaka" },
  { name: "Narayanganj", division: "Dhaka" },
  { name: "Narsingdi", division: "Dhaka" },
  { name: "Rajbari", division: "Dhaka" },
  { name: "Shariatpur", division: "Dhaka" },
  { name: "Tangail", division: "Dhaka" },
  // Khulna
  { name: "Bagerhat", division: "Khulna" },
  { name: "Chuadanga", division: "Khulna" },
  { name: "Jashore", division: "Khulna" },
  { name: "Jhenaidah", division: "Khulna" },
  { name: "Khulna", division: "Khulna" },
  // { name: "Kushtia", division: "Khulna", excluded: true },
  { name: "Kushtia", division: "Khulna" },
  { name: "Magura", division: "Khulna" },
  { name: "Meherpur", division: "Khulna" },
  { name: "Narail", division: "Khulna" },
  { name: "Satkhira", division: "Khulna" },
  // Mymensingh
  { name: "Jamalpur", division: "Mymensingh" },
  { name: "Mymensingh", division: "Mymensingh" },
  { name: "Netrokona", division: "Mymensingh" },
  { name: "Sherpur", division: "Mymensingh" },
  // Rajshahi
  { name: "Bogura", division: "Rajshahi" },
  { name: "Chapai Nawabganj", division: "Rajshahi" },
  { name: "Joypurhat", division: "Rajshahi" },
  { name: "Naogaon", division: "Rajshahi" },
  { name: "Natore", division: "Rajshahi" },
  { name: "Pabna", division: "Rajshahi" },
  { name: "Rajshahi", division: "Rajshahi" },
  { name: "Sirajganj", division: "Rajshahi" },
  // Rangpur
  { name: "Dinajpur", division: "Rangpur" },
  { name: "Gaibandha", division: "Rangpur" },
  { name: "Kurigram", division: "Rangpur" },
  { name: "Lalmonirhat", division: "Rangpur" },
  { name: "Nilphamari", division: "Rangpur" },
  { name: "Panchagarh", division: "Rangpur" },
  { name: "Rangpur", division: "Rangpur" },
  { name: "Thakurgaon", division: "Rangpur" },
  // Sylhet
  { name: "Habiganj", division: "Sylhet" },
  { name: "Moulvibazar", division: "Sylhet" },
  { name: "Sunamganj", division: "Sylhet" },
  { name: "Sylhet", division: "Sylhet" },
];

export const BD_DISTRICT_NAMES = BD_DISTRICTS.map((d) => d.name) as [
  string,
  ...string[]
];

/** Districts in the travel goal - everything except the excluded ones. */
export const DISTRICT_GOAL = BD_DISTRICTS.filter((d) => !d.excluded).length;
