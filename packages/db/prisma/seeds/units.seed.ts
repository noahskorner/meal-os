import { UnitType } from "../../src/generated/prisma/client.js";
import { defineSeed } from "./helpers.js";

export const units = [
  { name: "teaspoon", abbreviation: "tsp", type: UnitType.VOLUME },
  { name: "tablespoon", abbreviation: "tbsp", type: UnitType.VOLUME },
  { name: "fluid ounce", abbreviation: "fl oz", type: UnitType.VOLUME },
  { name: "cup", abbreviation: "cup", type: UnitType.VOLUME },
  { name: "pint", abbreviation: "pt", type: UnitType.VOLUME },
  { name: "quart", abbreviation: "qt", type: UnitType.VOLUME },
  { name: "gallon", abbreviation: "gal", type: UnitType.VOLUME },
  { name: "milliliter", abbreviation: "mL", type: UnitType.VOLUME },
  { name: "liter", abbreviation: "L", type: UnitType.VOLUME },
  { name: "dash", abbreviation: "dash", type: UnitType.VOLUME },
  { name: "pinch", abbreviation: "pinch", type: UnitType.VOLUME },
  { name: "splash", abbreviation: "splash", type: UnitType.VOLUME },
  { name: "drop", abbreviation: "drop", type: UnitType.VOLUME },
  { name: "shot", abbreviation: "shot", type: UnitType.VOLUME },
  { name: "ounce", abbreviation: "oz", type: UnitType.WEIGHT },
  { name: "pound", abbreviation: "lb", type: UnitType.WEIGHT },
  { name: "gram", abbreviation: "g", type: UnitType.WEIGHT },
  { name: "kilogram", abbreviation: "kg", type: UnitType.WEIGHT },
  { name: "milligram", abbreviation: "mg", type: UnitType.WEIGHT },
  { name: "each", abbreviation: "ea", type: UnitType.COUNT },
  { name: "piece", abbreviation: "pc", type: UnitType.COUNT },
  { name: "slice", abbreviation: "slice", type: UnitType.COUNT },
  { name: "loaf", abbreviation: "loaf", type: UnitType.COUNT },
  { name: "stick", abbreviation: "stick", type: UnitType.COUNT },
  { name: "clove", abbreviation: "clove", type: UnitType.COUNT },
  { name: "bunch", abbreviation: "bunch", type: UnitType.COUNT },
  { name: "sprig", abbreviation: "sprig", type: UnitType.COUNT },
  { name: "head", abbreviation: "head", type: UnitType.COUNT },
  { name: "stalk", abbreviation: "stalk", type: UnitType.COUNT },
  { name: "rib", abbreviation: "rib", type: UnitType.COUNT },
  { name: "fillet", abbreviation: "fillet", type: UnitType.COUNT },
  { name: "breast", abbreviation: "breast", type: UnitType.COUNT },
  { name: "thigh", abbreviation: "thigh", type: UnitType.COUNT },
  { name: "link", abbreviation: "link", type: UnitType.COUNT },
  { name: "dozen", abbreviation: "doz", type: UnitType.COUNT },
  { name: "can", abbreviation: "can", type: UnitType.PACKAGE },
  { name: "jar", abbreviation: "jar", type: UnitType.PACKAGE },
  { name: "bottle", abbreviation: "bottle", type: UnitType.PACKAGE },
  { name: "box", abbreviation: "box", type: UnitType.PACKAGE },
  { name: "bag", abbreviation: "bag", type: UnitType.PACKAGE },
  { name: "package", abbreviation: "pkg", type: UnitType.PACKAGE },
  { name: "carton", abbreviation: "carton", type: UnitType.PACKAGE },
  { name: "tube", abbreviation: "tube", type: UnitType.PACKAGE },
  { name: "pouch", abbreviation: "pouch", type: UnitType.PACKAGE },
  { name: "container", abbreviation: "container", type: UnitType.PACKAGE },
  { name: "block", abbreviation: "block", type: UnitType.PACKAGE },
  { name: "case", abbreviation: "case", type: UnitType.PACKAGE },
] as const satisfies readonly {
  name: string;
  abbreviation: string;
  type: UnitType;
}[];

export type UnitName = (typeof units)[number]["name"];

export const seedUnits = defineSeed("units", async (prisma) =>
  prisma.$transaction(async (tx) => {
    for (const unit of units) {
      await tx.unit.upsert({
        where: {
          name: unit.name,
        },
        update: {
          abbreviation: unit.abbreviation,
          type: unit.type,
        },
        create: {
          name: unit.name,
          abbreviation: unit.abbreviation,
          type: unit.type,
        },
      });
    }

    return units.length;
  }),
);
