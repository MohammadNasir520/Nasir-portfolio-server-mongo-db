export const userSearchableFields = ["name", "email", "contactNo"];

export const userFilterableFields = ["searchTerm", "name", "email", "role"];

// Fields safe to return to clients (password is excluded at schema level too).
export const userPublicFields = "_id name email role contactNo image1 image2";
