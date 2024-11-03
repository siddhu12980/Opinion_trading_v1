import { atom, DefaultValue, selector } from "recoil";

type User = {
    userId: string;
    balance: number;
    stock: UserStockBalances
};


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
    key: 'user',
    default: {
        userId: "",
        balance: 0,
        stock: {}
    },
});



const userBalanceSelector = selector<number>({
    key: 'userBalance',
    get: ({ get }) => {
        const user = get(userState);
        return user.balance;
    },
    set: ({ get, set }, newBalance) => {
        if (!(newBalance instanceof DefaultValue)) {
            const user = get(userState);
            set(userState, {
                ...user,
                balance: newBalance
            });
        }
    }
});

const userStockSelector = selector({
    key: 'userStock',
    get: ({ get }) => {
        const user = get(userState);
        return user.stock;
    },
});



const userIdSelector = selector<string>({
    key: 'userId',
    get: ({ get }) => {
        const user = get(userState);
        return user.userId;
    },
    set: ({ get, set }, userId) => {
        if (!(userId instanceof DefaultValue)) {
            const user = get(userState);
            set(userState, {
                ...user,
                userId: userId
            });
        }
    }
});



export { userState, userBalanceSelector, userStockSelector };
