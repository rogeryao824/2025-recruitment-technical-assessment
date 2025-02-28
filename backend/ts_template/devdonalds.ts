import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface RequiredItem {
  name: string;
  quantity: number;
}

interface Recipe {
  type: "recipe";
  name: string;
  requiredItems: RequiredItem[];
}

interface Ingredient {
  type: "ingredient";
  name: string;
  cookTime: number;
}

type CookbookEntry = Recipe | Ingredient;

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: CookbookEntry[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  recipeName = recipeName.replace(/[_\s-]+/g, " ");
  recipeName = recipeName.replace(/[^a-zA-Z ]/g, "");
  recipeName = recipeName.trim();
  const words = recipeName.split(/\s+/);
  recipeName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  
  return recipeName.length === 0 ? null : recipeName;
}

const isValidType = (type: string): boolean => {
  return type === 'recipe' || type === 'ingredient';
}

const isUniqueName = (name: string): boolean => {
  return !cookbook.some(entry => entry.name === name);
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const data = req.body;

  // Check that the type is correct.
  if (!isValidType(data.type)) {
    return res.status(400).send("type can only be 'recipe' or 'ingredient'!");
  }

  // Check that the entry name is unique.
  if (isUniqueName(data.name)) {
    return res.status(400).send("entry already exists in cookbook!");
  }

  if (data.type === 'ingredient') {
    if (parseInt(data.cooktime) < 0) {
      return res.status(400).send("Invalid cook time");
    }

    // Otherwise, it is a valid ingredient. 
    const newEntry: Ingredient = {
      type: "ingredient", 
      name: data.name, 
      cookTime: parseInt(data.cookTime)
    };
    cookbook.push(newEntry);

  } else if (data.type === 'recipe') {
    // Check that requiredItems only have one element per name. 
    const itemNames = new Set<string>();
    for (const item of data.requiredItems) {
      if (itemNames.has(item.name)) {
        return res.status(400).send("Duplicate item!");
      }
      itemNames.add(item.name);
    }

    // If everything has a unique name, it is a valid recipe
    const newEntry: Recipe = {
      type: "recipe",
      name: data.name,
      requiredItems: data.requiredItems
    };
    cookbook.push(newEntry);
  }

  res.status(200).send();
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
