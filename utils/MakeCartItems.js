function MakeCartItems(cartItems) {
  const items = {};
  cartItems.map(
    (item) =>
      (items[item._id] = {...item.product._doc, quantity: item.quantity})
  );
  return items;
}
module.exports = MakeCartItems;
