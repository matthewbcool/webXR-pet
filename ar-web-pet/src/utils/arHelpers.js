export const enterAR = (store) => {
    store.enterAR();
};

export const exitAR = (store) => {
    store.exitAR();
};

export const toggleAR = (store) => {
    if (store.isInAR) {
        exitAR(store);
    } else {
        enterAR(store);
    }
};