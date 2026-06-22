export type ListIngredientsModel = {
  id: string;
  name: string;
  aliases: string[];
  category: {
    id: string;
    name: string;
  };
  defaultUnit: {
    id: string;
    name: string;
    abbreviation: string;
    type: string;
  };
};
