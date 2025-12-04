export const mockPosts = [
  {
    id: "p1",
    userId: "u1",
    username: "user 01234567",
    createdAt: "2025-01-01 12:20:20",
    content: "Tôi vui lắm",
    likes: 10,
    comments: 10,
    isLiked: true,
    likedBy: [
      { userId: "u1", username: "You" },
      { userId: "u3", username: "David" },
      { userId: "u4", username: "Emma" },
      { userId: "u5", username: "John" },
    ],
  },
  {
    id: "p2",
    userId: "u2",
    username: "user 987654321",
    createdAt: "2025-01-02 10:15:00",
    content: "Hôm nay trời đẹp",
    likes: 0,
    comments: 1,
    isLiked: false,
  },
];