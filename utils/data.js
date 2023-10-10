const wordSetOne = [
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
];

const wordSetsTwo = [
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

const getRandomUsername = () => {
  // Randomly select a word from each wordSet
  const randomWord = (wordSet) => {
    const randomIndex = Math.floor(Math.random() * wordSet.length);
    return wordSet[randomIndex];
  };

  // Generate a username using the random words and a random numbers.
  const randomSetOne = randomWord(wordSetOne);
  const randomSetTwo = randomWord(wordSetsTwo);

  // Generate a random number between 10 and 99 after the username.
  const username =
    randomSetTwo + randomSetOne + Math.floor(Math.random() * 90 + 10);

  return username;
};

const getRandomEmail = (username) => {
  // Randomly select an email domain from emailSet.
  const randomEmailDomain =
    emailSet[Math.floor(Math.random() * emailSet.length)];

  // Generate the email using the username and email domain.
  const email = username.toLowerCase() + randomEmailDomain;

  return email;
};

const  getRandomFriends = (users, currentUser, friendCount) => {
  const randomFriends = [];
  const shuffledUsers = [...users]; // Clone the users array

  // Shuffle the array of users to randomize friend selection
  // Fisher-Yates algorithm (To Shuffle Array)
  for (let i = shuffledUsers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledUsers[i], shuffledUsers[j]] = [shuffledUsers[j], shuffledUsers[i]];
  }

  // Iterate through the shuffled users and add them as friends (up to friendCount)
  for (const user of shuffledUsers) {
    if (user._id !== currentUser._id && randomFriends.length < friendCount) {
      randomFriends.push(user._id);
    }
  }

  return randomFriends;
}

module.exports = { getRandomUsername, getRandomEmail, getRandomFriends };
