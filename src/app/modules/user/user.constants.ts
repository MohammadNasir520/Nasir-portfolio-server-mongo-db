export const userSearchableFields = ["name", "email"];

export const userFilterableFields = ["searchTerm", "name", "email", "role"];

// Fields safe to return to clients (password is excluded at schema level too).
// contactNo/image1/image2 moved to the siteProfile singleton.
export const userPublicFields = "_id name email role";
