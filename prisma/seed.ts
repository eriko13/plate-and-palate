import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient, Role } from "../src/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const cookSeeds = [
  {
    email: "marisol@plateandpalate.test",
    name: "Marisol Hernandez",
    password: "cook1234",
    slug: "marisol-hernandez",
    handle: "@marisolcooks",
    location: "Rexburg, ID",
    bio: "Mexican comfort food made with the recipes my abuela taught me.",
    story:
      "I learned to cook by standing on a wooden stool beside my abuela in her tiny kitchen in Guadalajara. Every weekend, I make the dishes that filled our home with music, family, and the smell of toasted chiles.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85",
    specialty: "Mexican comfort food",
  },
  {
    email: "noah@plateandpalate.test",
    name: "Noah Williams",
    password: "cook1234",
    slug: "noah-williams",
    handle: "@noahbakes",
    location: "Idaho Falls, ID",
    bio: "Slow-fermented breads and pastries for your breakfast table.",
    story:
      "My sourdough starter, Bubbles, is older than my houseplants. I love the slow rhythm of baking and sending something warm out into the neighborhood.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85",
    specialty: "Small-batch baking",
  },
  {
    email: "aisha@plateandpalate.test",
    name: "Aisha Patel",
    password: "cook1234",
    slug: "aisha-patel",
    handle: "@aishastable",
    location: "Rexburg, ID",
    bio: "Bright, fragrant Indian dishes inspired by my family table.",
    story:
      "Food is how my family tells stories. My cooking brings together recipes from three generations, with fresh spices ground in small batches before every menu.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=85",
    specialty: "Indian home cooking",
  },
];

const dishSeeds = [
  {
    slug: "birria-tacos",
    name: "Birria Tacos",
    description:
      "Slow-braised beef, melted Oaxaca cheese, cilantro, and onion in crisped corn tortillas with a rich consommé for dipping.",
    price: 14,
    category: "Mexican",
    image:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1000&q=85",
    cookSlug: "marisol-hernandez",
    rating: 4.9,
    reviewCount: 38,
    prepTime: "Ready Friday",
    tags: ["Best seller", "Spicy"],
  },
  {
    slug: "rosemary-focaccia",
    name: "Rosemary Focaccia",
    description:
      "Pillowy, olive-oil-rich focaccia topped with fresh rosemary, flaky sea salt, and roasted garlic.",
    price: 9,
    category: "Bakery",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",
    cookSlug: "noah-williams",
    rating: 4.8,
    reviewCount: 24,
    prepTime: "Ready Saturday",
    tags: ["Vegetarian"],
  },
  {
    slug: "butter-chicken",
    name: "Butter Chicken",
    description:
      "Tender chicken simmered in a silky tomato, cream, and toasted spice sauce. Served with fragrant basmati rice.",
    price: 16,
    category: "Indian",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85",
    cookSlug: "aisha-patel",
    rating: 5,
    reviewCount: 19,
    prepTime: "Ready Sunday",
    tags: ["Popular"],
  },
  {
    slug: "tres-leches-cake",
    name: "Tres Leches Cake",
    description:
      "A cloud-soft sponge soaked in three milks, finished with cinnamon whipped cream and fresh strawberries.",
    price: 12,
    category: "Dessert",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85",
    cookSlug: "marisol-hernandez",
    rating: 4.7,
    reviewCount: 16,
    prepTime: "Ready Friday",
    tags: ["Sweet"],
  },
  {
    slug: "cardamom-buns",
    name: "Cardamom Buns",
    description:
      "Twisted sweet rolls layered with cardamom, brown sugar, and butter, baked until golden.",
    price: 8,
    category: "Bakery",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85",
    cookSlug: "noah-williams",
    rating: 4.9,
    reviewCount: 31,
    prepTime: "Ready Saturday",
    tags: ["Vegetarian", "New"],
  },
  {
    slug: "samosa-box",
    name: "Golden Samosa Box",
    description:
      "Six flaky samosas filled with potato, peas, ginger, and warm spices, with mint chutney on the side.",
    price: 11,
    category: "Indian",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85",
    cookSlug: "aisha-patel",
    rating: 4.8,
    reviewCount: 22,
    prepTime: "Ready Sunday",
    tags: ["Vegetarian"],
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cookProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const categories = ["Mexican", "Bakery", "Indian", "Dessert", "Homemade"];
  const categoryMap = new Map<string, string>();

  for (const name of categories) {
    const category = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase(),
      },
    });
    categoryMap.set(name, category.id);
  }

  const cookMap = new Map<string, string>();

  for (const cook of cookSeeds) {
    const passwordHash = await hash(cook.password, 10);
    const user = await prisma.user.create({
      data: {
        email: cook.email,
        name: cook.name,
        passwordHash,
        role: Role.COOK,
        image: cook.avatar,
        cookProfile: {
          create: {
            slug: cook.slug,
            handle: cook.handle,
            location: cook.location,
            bio: cook.bio,
            story: cook.story,
            avatar: cook.avatar,
            specialty: cook.specialty,
          },
        },
      },
      include: { cookProfile: true },
    });
    cookMap.set(cook.slug, user.cookProfile!.id);
  }

  const buyerHash = await hash("buyer1234", 10);
  await prisma.user.create({
    data: {
      email: "buyer@plateandpalate.test",
      name: "Alex Buyer",
      passwordHash: buyerHash,
      role: Role.BUYER,
    },
  });

  for (const dish of dishSeeds) {
    await prisma.dish.create({
      data: {
        slug: dish.slug,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        prepTime: dish.prepTime,
        tags: dish.tags,
        rating: dish.rating,
        reviewCount: dish.reviewCount,
        cookId: cookMap.get(dish.cookSlug)!,
        categoryId: categoryMap.get(dish.category)!,
      },
    });
  }

  console.log("Seeded cooks, dishes, categories, and demo accounts.");
  console.log("Cook login: marisol@plateandpalate.test / cook1234");
  console.log("Buyer login: buyer@plateandpalate.test / buyer1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
