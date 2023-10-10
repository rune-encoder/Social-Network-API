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

  const emailSet = [
    "@gmail.com",
    "@yahoo.com",
    "@hotmail.com",
    "@outlook.com",
    "@icloud.com",
    "@aol.com",
    "@zoho.com",
    "@protonmail.com",
  ];

  const randomWord = (wordSet) => {
    const randomIndex = Math.floor(Math.random() * wordSet.length);
    return wordSet[randomIndex];
  };

  const randomSetOne = randomWord(wordSets[0]);
  const randomSetTwo = randomWord(wordSets[1]);

  // Generate a random number between 10 and 99 after the username
  const username = randomSetTwo + randomSetOne + Math.floor(Math.random() * 90 + 10);

  // Randomly select an email domain from emailSet
  const randomEmailDomain = emailSet[Math.floor(Math.random() * emailSet.length)];

  // Generate the email using the username and email domain
  const email = username.toLowerCase() + randomEmailDomain;

  return { username, email };
}

// Generate 30 usernames and emails
const usernamesAndEmails = Array.from({ length: 30 }, generateRandomUsername);
console.log(usernamesAndEmails);

module.exports = usernamesAndEmails;