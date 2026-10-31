import { JwtPayload } from "jsonwebtoken";
import { ITravelMap, TravelMap } from "./travelMap.model";

type SavePayload = Pick<ITravelMap, "name" | "districts" | "places">;

/** The signed-in user's map, or an empty one if they have not saved yet. */
const getMine = async (user: JwtPayload) => {
  const map = await TravelMap.findOne({ user: user.userId });
  return map ?? { name: "", districts: [], places: [] };
};

/** Replace the signed-in user's map. Upsert: the first save creates it. */
const saveMine = async (user: JwtPayload, payload: SavePayload) => {
  const unique = (list: string[]) => Array.from(new Set(list));
  return TravelMap.findOneAndUpdate(
    { user: user.userId },
    {
      $set: {
        name: payload.name,
        districts: unique(payload.districts),
        places: unique(payload.places),
      },
    },
    { new: true, upsert: true, runValidators: true }
  );
};

export const TravelMapService = { getMine, saveMine };
