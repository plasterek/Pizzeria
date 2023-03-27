export const removeItemFromArray = <T>(array: T[], item: T): void => {
  const indexOfItem = array.findIndex((items) => items === item);
  array.splice(indexOfItem, 1);
};
