import { atom, DefaultValue, selector } from "recoil";

type User = {
  userId: string;
  balance: Balance;
  stock: UserStockBalances;
};

export interface Balance {
  freeBalances: number;
  lockedBalances: number;
}

export interface Stock {
  quantity: number;
  locked: number;
}

export interface UserStockBalances {
  [contract: string]: {
    yes?: Stock;
    no?: Stock;
  };
}

const userState = atom<User>({
  key: "user",
  default: {
    userId: "",
    balance: {
      freeBalances: 0,
      lockedBalances: 0,
    },
    stock: {},
  },
});

const userStockSelector = selector({
  key: "userStock",
  get: ({ get }) => {
    const user = get(userState);
    return user.stock;
  },
});

const userIdSelector = selector<string>({
  key: "userId",
  get: ({ get }) => {
    const user = get(userState);
    return user.userId;
  },
  set: ({ get, set }, userId) => {
    if (!(userId instanceof DefaultValue)) {
      const user = get(userState);
      set(userState, {
        ...user,
        userId: userId,
      });
    }
  },
});

export { userState, userStockSelector };
