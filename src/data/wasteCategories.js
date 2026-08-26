export const wasteCategories = [
  {
    id: 1,
    slug: 'plastic',
    name: 'Plastic',
    icon: '♳',
    description: 'Containers and packaging',
    overview:
      'Plastic items should be checked for recycling symbols before disposal.',
    commonItems: [
      { name: 'Plastic Bottle', icon: '🧴' },
      { name: 'Food Container', icon: '🥡' },
      { name: 'Packaging', icon: '📦' },
      { name: 'Plastic Tub', icon: '🪣' },
    ],
    firstTip:
      'Empty and rinse accepted plastic containers before recycling.',
    secondTip:
      'Check your local council rules because accepted plastics can vary.',
  },
  {
    id: 2,
    slug: 'glass',
    name: 'Glass',
    icon: '🍾',
    description: 'Bottles and jars',
    overview:
      'Glass bottles and jars can often be recycled through household services.',
    commonItems: [
      { name: 'Glass Bottle', icon: '🍾' },
      { name: 'Glass Jar', icon: '🫙' },
      { name: 'Drink Bottle', icon: '🥤' },
      { name: 'Food Jar', icon: '🫙' },
    ],
    firstTip:
      'Remove lids and empty glass bottles and jars before recycling.',
    secondTip:
      'Do not place drinking glasses, mirrors or ceramics in the recycling bin.',
  },
  {
    id: 3,
    slug: 'paper',
    name: 'Paper',
    icon: '📄',
    description: 'Paper and cardboard',
    overview:
      'Clean paper and cardboard are commonly accepted for recycling.',
    commonItems: [
      { name: 'Newspaper', icon: '📰' },
      { name: 'Cardboard', icon: '📦' },
      { name: 'Office Paper', icon: '📄' },
      { name: 'Paper Packaging', icon: '🛍️' },
    ],
    firstTip:
      'Keep recyclable paper and cardboard clean and dry.',
    secondTip:
      'Flatten cardboard boxes to save space in the recycling bin.',
  },
  {
    id: 4,
    slug: 'e-waste',
    name: 'E-waste',
    icon: '🖥️',
    description: 'Electronics and devices',
    overview:
      'Electronic items should be recycled through suitable e-waste collection services.',
    commonItems: [
      { name: 'Laptop', icon: '💻' },
      { name: 'Mobile Phone', icon: '📱' },
      { name: 'Charger', icon: '🔌' },
      { name: 'Small Appliance', icon: '📻' },
    ],
    firstTip:
      'Do not place electronic waste in general household bins.',
    secondTip:
      'Take unwanted electronic items to a suitable e-waste recycling location.',
  },
  {
    id: 5,
    slug: 'batteries',
    name: 'Batteries',
    icon: '🔋',
    description: 'Household batteries',
    overview:
      'Batteries require special collection because they can create safety risks.',
    commonItems: [
      { name: 'AA Battery', icon: '🔋' },
      { name: 'AAA Battery', icon: '🔋' },
      { name: 'Button Battery', icon: '🪙' },
      { name: 'Rechargeable Battery', icon: '🔋' },
    ],
    firstTip:
      'Do not place batteries in general waste or household recycling bins.',
    secondTip:
      'Take used batteries to an approved battery collection point.',
  },
  {
    id: 6,
    slug: 'food-waste',
    name: 'Food Waste',
    icon: '🍎',
    description: 'Food and organic waste',
    overview:
      'Food scraps can often be composted or collected through an organic waste service.',
    commonItems: [
      { name: 'Fruit Scraps', icon: '🍎' },
      { name: 'Vegetable Scraps', icon: '🥕' },
      { name: 'Coffee Grounds', icon: '☕' },
      { name: 'Leftover Food', icon: '🍽️' },
    ],
    firstTip:
      'Use a food and garden organics bin when your council provides one.',
    secondTip:
      'Consider home composting suitable fruit and vegetable scraps.',
  },
]