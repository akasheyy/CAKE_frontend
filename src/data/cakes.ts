import cakeChocolate from "@/assets/cake-chocolate.jpg";
import cakeVanilla from "@/assets/cake-vanilla.jpg";
import cakeRedVelvet from "@/assets/cake-redvelvet.jpg";
import cakeLemon from "@/assets/cake-lemon.jpg";

export interface Cake {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  flavors: string[];
  servings: string;
  featured?: boolean;
}

export const cakes: Cake[] = [
  {
    id: "1",
    name: "Belgian Chocolate Truffle",
    description: "Rich dark chocolate layers with silky ganache, topped with fresh berries and gold leaf",
    price: "From $85",
    image: cakeChocolate,
    category: "Chocolate",
    flavors: ["Dark Chocolate", "Raspberry", "Hazelnut"],
    servings: "10-12",
    featured: true,
  },
  {
    id: "2",
    name: "Vanilla Dream",
    description: "Light vanilla sponge with strawberry buttercream, fresh strawberries and edible flowers",
    price: "From $75",
    image: cakeVanilla,
    category: "Classic",
    flavors: ["Vanilla", "Strawberry", "Cream"],
    servings: "8-10",
    featured: true,
  },
  {
    id: "3",
    name: "Red Velvet Romance",
    description: "Classic red velvet with cream cheese frosting, decorated with rose petals",
    price: "From $80",
    image: cakeRedVelvet,
    category: "Specialty",
    flavors: ["Red Velvet", "Cream Cheese"],
    servings: "12-14",
    featured: true,
  },
  {
    id: "4",
    name: "Lemon Sunshine",
    description: "Zesty lemon cake with lemon curd filling, topped with candied citrus and flowers",
    price: "From $70",
    image: cakeLemon,
    category: "Fruit",
    flavors: ["Lemon", "Citrus", "Vanilla"],
    servings: "8-10",
    featured: true,
  },
];

export const testimonials = [
  {
    id: "1",
    name: "Sophie Anderson",
    role: "Bride",
    content: "Our wedding cake was absolutely stunning! Every guest commented on how beautiful and delicious it was. La Belle exceeded all our expectations.",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Corporate Client",
    content: "We've ordered from La Belle for multiple company events. The quality and presentation are always impeccable. Our go-to bakery for special occasions.",
    rating: 5,
  },
  {
    id: "3",
    name: "Emma Laurent",
    role: "Birthday Celebration",
    content: "The custom cake for my daughter's birthday was a dream come true. The attention to detail and flavors were outstanding. Highly recommend!",
    rating: 5,
  },
];

export const flavors = [
  { name: "Chocolate", description: "Belgian dark, milk, or white chocolate" },
  { name: "Vanilla", description: "Madagascar bourbon vanilla bean" },
  { name: "Red Velvet", description: "Classic with cream cheese" },
  { name: "Lemon", description: "Fresh citrus with lemon curd" },
  { name: "Strawberry", description: "Fresh strawberry buttercream" },
  { name: "Caramel", description: "Salted caramel with dulce de leche" },
  { name: "Raspberry", description: "Fresh raspberry with rose" },
  { name: "Pistachio", description: "Italian pistachio cream" },
];
