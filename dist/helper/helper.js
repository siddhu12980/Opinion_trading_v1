"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBalance = exports.matchOrders = void 0;
function matchOrders(orderList, quantity) {
    let remainingQuantity = quantity;
    for (const user in orderList) {
        const availableQuantity = orderList[user];
        const quantityToTake = Math.min(remainingQuantity, availableQuantity);
        orderList[user] -= quantityToTake;
        if (orderList[user] === 0) {
            delete orderList[user];
        }
        remainingQuantity -= quantityToTake;
        if (remainingQuantity === 0)
            break;
    }
    return remainingQuantity;
}
exports.matchOrders = matchOrders;
function updateUserBalance(userBalance, quantity, price) {
    const amount = quantity * price;
    userBalance.balance -= amount;
    userBalance.locked += amount;
}
exports.updateUserBalance = updateUserBalance;
