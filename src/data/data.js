export const orders = [
  {
    id: 1,
    ref: "CDD1049",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: 2,
    ref: "CDD1048",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: 3,
    ref: "CDD1047",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: 4,
    ref: "CDD1046",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: 5,
    ref: "CDD1045",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: 6,
    ref: "CDD1044",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
];

export const API_DATA = {
  data: [
    {
      id: 2,
      name: "Garrett Metz DDS",
      debt: "93137",
    },
    {
      id: 3,
      name: "Mose Becker MD",
      debt: "171432",
    },
    {
      id: 11,
      name: "Mrs. Claudie Pouros V",
      debt: "1698",
    },
    {
      id: 12,
      name: "Mrs. Romaine Roob",
      debt: "5150",
    },
    {
      id: 13,
      name: "Miss Destini O'Conner MD",
      debt: "77370",
    },
  ],
  links: {
    first: "http://127.0.0.1:8000/users?page=1",
    last: "http://127.0.0.1:8000/users?page=3",
    prev: null,
    next: "http://127.0.0.1:8000/users?page=2",
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 3,
    links: [
      {
        url: null,
        label: "Previous",
        active: false,
      },
      {
        url: "http://127.0.0.1:8000/users?page=1",
        label: "1",
        active: true,
      },
      {
        url: "http://127.0.0.1:8000/users?page=2",
        label: "2",
        active: false,
      },
      {
        url: "http://127.0.0.1:8000/users?page=3",
        label: "3",
        active: false,
      },
      {
        url: "http://127.0.0.1:8000/users?page=2",
        label: "Next",
        active: false,
      },
    ],
    path: "http://127.0.0.1:8000/users",
    per_page: 5,
    to: 5,
    total: 12,
  },
};
