export const recipeData = [
    {
        id: 1,
        title: 'Bock',
        description: 'A strong, dark German beer',
        difficulty: 'Intermediate',
        timeInWeeks: 8,
        ingredients: [
            '10 lbs Munich malt',
            '2 lbs Vienna malt',
            '0.5 lbs Caramunich malt',
            '2 oz Hallertauer hops (bittering)',
            '1 oz Tettnanger hops (aroma)',
            'German lager yeast'
        ],
        instructions: [
            'Mash grains at 152°F for 60 minutes',
            'Sparge and collect wort',
            'Boil for 90 minutes, adding hops per schedule',
            'Ferment at 50°F for 4 weeks',
            'Lager for 4 weeks at 35°F'
        ],
        type: 'Lager',
        abv: '6.5%',
        ibu: '25'
    },
    {
        id: 2,
        title: 'Pilsener',
        description: 'Fresh malt, fresh hops, correct population of yeast',
        difficulty: 'Beginner',
        timeInWeeks: 6,
        ingredients: [
            '8 lbs Pilsner malt',
            '0.5 lbs Carafoam',
            '2.5 oz Saaz hops',
            'Czech Pilsner yeast'
        ],
        instructions: [
            'Mash at 148°F for 90 minutes',
            'Sparge with 170°F water',
            'Boil for 90 minutes',
            'Ferment at 50°F for 2 weeks',
            'Lager for 4 weeks at 35°F'
        ],
        type: 'Lager',
        abv: '4.8%',
        ibu: '35'
    },
    {
        id: 3,
        title: 'Weizen',
        description: 'A wheat beer of South German or Bavarian origin',
        difficulty: 'Beginner',
        timeInWeeks: 3,
        ingredients: [
            '5 lbs Wheat malt',
            '4 lbs Pilsner malt',
            '1 oz Hallertauer hops',
            'Weihenstephan yeast'
        ],
        instructions: [
            'Mash at 152°F for 60 minutes',
            'Sparge with 170°F water',
            'Boil for 60 minutes',
            'Ferment at 68°F for 2 weeks',
            'Bottle condition for 1 week'
        ],
        type: 'Ale',
        abv: '5.2%',
        ibu: '15'
    },
    {
        id: 4,
        title: 'Triple',
        description: 'A strong malty, hop bitter taste heavy top-fermented beer',
        difficulty: 'Advanced',
        timeInWeeks: 10,
        ingredients: [
            '12 lbs Pilsner malt',
            '2 lbs Belgian candi sugar',
            '2 oz Styrian Goldings hops',
            'Belgian abbey yeast',
            '1 lb Carapils malt'
        ],
        instructions: [
            'Mash at 147°F for 90 minutes',
            'Add candi sugar during last 15 minutes of boil',
            'Boil for 90 minutes',
            'Primary fermentation at 68°F for 2 weeks',
            'Secondary fermentation at 72°F for 2 weeks',
            'Bottle condition for 6 weeks'
        ],
        type: 'Ale',
        abv: '9.5%',
        ibu: '35'
    },
    {
        id: 5,
        title: 'IPA',
        description: 'A perfectly balanced India Pale Ale with citrus notes',
        difficulty: 'Intermediate',
        timeInWeeks: 4,
        ingredients: [
            '11 lbs Pale malt',
            '1 lb Crystal malt',
            '3 oz Cascade hops',
            '2 oz Centennial hops',
            '1 oz Simcoe hops',
            'American ale yeast'
        ],
        instructions: [
            'Mash at 152°F for 60 minutes',
            'Sparge with 170°F water',
            'Boil for 60 minutes, adding hops per schedule',
            'Dry hop for 5 days',
            'Ferment at 68°F for 2 weeks',
            'Bottle condition for 2 weeks'
        ],
        type: 'Ale',
        abv: '6.8%',
        ibu: '65'
    },
    {
        id: 6,
        title: 'Summer Wheat',
        description: 'Light and refreshing wheat beer perfect for warm days',
        difficulty: 'Beginner',
        timeInWeeks: 3,
        ingredients: [
            '5 lbs Wheat malt',
            '4 lbs Pilsner malt',
            '1 oz Hallertauer hops',
            '0.5 oz Orange peel',
            '0.5 oz Coriander',
            'Belgian witbier yeast'
        ],
        instructions: [
            'Mash at 152°F for 60 minutes',
            'Add spices in last 5 minutes of boil',
            'Boil for 60 minutes',
            'Ferment at 68°F for 2 weeks',
            'Bottle condition for 1 week'
        ],
        type: 'Ale',
        abv: '4.5%',
        ibu: '15'
    },
    {
        id: 7,
        title: 'Dark Stout',
        description: 'Rich and creamy with coffee and chocolate notes',
        difficulty: 'Advanced',
        timeInWeeks: 6,
        ingredients: [
            '10 lbs Pale malt',
            '2 lbs Roasted barley',
            '1 lb Chocolate malt',
            '1 lb Flaked oats',
            '2 oz East Kent Goldings hops',
            'Irish ale yeast'
        ],
        instructions: [
            'Mash at 154°F for 60 minutes',
            'Sparge with 170°F water',
            'Boil for 60 minutes',
            'Ferment at 65°F for 3 weeks',
            'Condition for 3 weeks'
        ],
        type: 'Stout',
        abv: '7.2%',
        ibu: '45'
    }
];