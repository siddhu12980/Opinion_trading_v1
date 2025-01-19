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

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);

  // Initialize state with the saved value in localStorage, if it exists
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  // Save changes to localStorage whenever the atom's state changes
  onSet((newValue: any, _: any, isReset: boolean) => {
    if (isReset) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};



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
  effects: [localStorageEffect("userState")],
});

const userStockSelector = selector({
  key: "userStock",
  get: ({ get }) => {
    const user = get(userState);
    return user.stock;
  },
});

//make a selector and sestter for user banalce

export const userBalanceSelector = selector({
  key: "userBalance",
  get: ({ get }) => {
    const user = get(userState);
    return user.balance.freeBalances;
  },
  set: ({ set }, newValue) => {
    set(userState, (oldUser) => {
      if (newValue instanceof DefaultValue) return oldUser;
      return {
        ...oldUser,
        balance: {
          ...oldUser.balance,
          freeBalances: newValue,
        },
      };
    });
  },
});
export const userIdSelector = selector({
  key: "userId",
  get: ({ get }) => {
    const user = get(userState);
    return user.userId;
  },
  set: ({ set }, newValue) => {
    set(userState, (oldUser) => {
      if (newValue instanceof DefaultValue) return oldUser;
      
      return {
        ...oldUser,
        userId: newValue,
      };
    });
  },
});

export { userState, userStockSelector };
