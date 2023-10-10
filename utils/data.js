function generateRandomUsername() {
  const wordSets = [
    [
      "Bacon",
      "Biscuit",
      "Burger",
      "Cake",
      "Candy",
      "Cheese",
      "Chips",
      "Chocolate",
      "Cookie",
      "Donut",
      "Fries",
      "Milkshake",
      "Nuggets",
    ],
    [
      "Axe",
      "Battle",
      "Berserk",
      "Dragon",
      "Glory",
      "Gold",
      "Helmet",
      "Horn",
      "Horse",
      "Longboat",
      "Raven",
      "Sail",
      "Shield",
      "Warrior",
    ],
  ];

  const randomWord = (wordSet) => {
    const randomIndex = Math.floor(Math.random() * wordSet.length);
    return wordSet[randomIndex];
  };

  const randomSetOne = randomWord(wordSets[0]);
  const randomSetTwo = randomWord(wordSets[1]);

  // Generate a random number between 10 and 99 after the username
  return randomSetTwo + randomSetOne + Math.floor(Math.random() * 90 + 10);
}

// Generate 30 usernames
const usernames = Array.from({ length: 30 }, generateRandomUsername);
console.log(usernames);
