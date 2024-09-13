export const DELAY_INTERVAL = 1;

// Helper function to simulate response delays
export const delay = (seconds) => {
  return new Promise((resolve, _2) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};

export let users = {
  1: {
    user_id: "1",
    name: "Alice",
    news: [
      {
        news_id: "101",
        title: "Alice's News",
        content: "This is some news content.",
      },
    ],
  },
  2: {
    user_id: "2",
    name: "Bob",
    news: [
      {
        news_id: "102",
        title: "Bob's News",
        content: "This is Bob's news content.",
      },
    ],
  },
  3: {
    user_id: "3",
    name: "Claire",
    news: [
      {
        news_id: "103",
        title: "Claire's News",
        content: "This is Claire's news content.",
      },
    ],
  },
};

export let comments = {
  1: {
    news_id: "101",
    content: "a comment on some news content",
  },
  2: {
    news_id: "102",
    content: "a comment on Bob's news content.",
  },
  3: {
    news_id: "103",
    content: "a comment on Claire's news content.",
  },
  4: {
    news_id: "103",
    content: "another comment on Claire's news content.",
  },
  5: {
    news_id: "101",
    content: "another comment on some news content.",
  },
};
