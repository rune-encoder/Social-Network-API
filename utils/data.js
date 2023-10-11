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

const wordSetTwo = [
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

const thoughtSetOne = [
  "The unexamined life is not worth living.",
  "Whereof one cannot speak, thereof one must be silent.",
  "Entities should not be multiplied unnecessarily.",
  "Do not allow yourselves to be deceived: Great Minds are Skeptical.",
  "He who thinks great thoughts, often makes great errors.",
  "Life must be understood backward. But it must be lived forward.",
  "I can control my passions and emotions if I can understand their nature.",
  "Happiness is not an ideal of reason, but of imagination.",
  "I don't know why we are here, but I'm pretty sure it is not in order to enjoy ourselves.",
  "He who is unable to live in society, or who has no need because he is sufficient for himself, must be either a beast or a god.",
  "You can discover more about a person in an hour of play than in a year of conversation.",
  "The only thing I know is that I know nothing.",
  "To find yourself, think for yourself.",
];

const thoughtSetTwo = [
  "So, where's the Cannes Film Festival being held this year?",
  "I invented the internet.",
  "I know how hard it is for you to put food on your family.",
  "Rarely is the question asked: Is our children learning?",
  "They misunderestimated me.",
  "I know the human being and fish can coexist peacefully.",
  "I know how hard it is for you to put food on your family.",
  "Just remember it's the birds that's supposed to suffer, not the hunter.",
  "I think we agree, the past is over.",
  "Can we all get along?",
  "I'm not a real movie star. I've still got the same wife I started out with twenty-eight years ago.",
  "I'm the president of the United States and I'm not going to eat any more broccoli!",
  "I'm not the smartest fellow in the world, but I can sure pick smart colleagues.",
];

const reactionSetOne = [
  "Tell me more...",
  "Wow!",
  "Mind blown!",
  "Cool!",
  "Interesting...",
  "I agree!",
  "I disagree!",
  "I don't know...",
  "Fascinating!",
  "Cool story, bro!",
  "Awesome!",
  "I'm speechless!",
  "I'm at a loss for words!",
];

const reactionSetTwo = [
  "😆",
  "😢",
  "😡",
  "🤯",
  "😱",
  "🤔",
  "😬",
  "😍",
  "😴",
  "😈",
  "👽",
  "👾",
  "🤖",
];

// HELPER FUNCTION TO GET A RANDOM ITEM FROM AN ARRAY
const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// GENERATE RANDOM USERNAME
const getRandomUsername = () => {
  const randomSetOne = getRandomItem(wordSetOne);
  const randomSetTwo = getRandomItem(wordSetTwo);
  
  // Generate a random number between 10 and 99 after the generated username
  const username =
    randomSetTwo + randomSetOne + Math.floor(Math.random() * 90 + 10);

  return username;
};

// GENERATE RANDOM EMAIL FOR A USER
const getRandomEmail = (username) => {
  const randomEmailDomain = getRandomItem(emailSet);
  const email = username.toLowerCase() + randomEmailDomain;

  return email;
};

// GENERATE RANDOM FRIENDS FOR A USER
const getRandomFriends = (users, currentUser, friendCount) => {
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
};

// GENERATE RANDOM THOUGHTS
const getRandomThoughts = () => {
  const randomThought =
    getRandomItem(thoughtSetOne) + " " + getRandomItem(thoughtSetTwo);
  return randomThought;
};

// GENERATE RANDOM REACTIONS FOR A THOUGHT
const getRandomReaction = () => {
  const randomReaction =
    getRandomItem(reactionSetOne) + " " + getRandomItem(reactionSetTwo);
  return randomReaction;
};

module.exports = {
  getRandomUsername,
  getRandomEmail,
  getRandomFriends,
  getRandomThoughts,
  getRandomReaction,
};
