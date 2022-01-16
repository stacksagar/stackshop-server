function MakeCategoriesList(categories, parentID) {
  const list = [];
  let children;

  if (parentID) {
    children = categories.filter((c) => c.parent == parentID);
  } else {
    children = categories.filter((c) => c.parent == undefined);
  }

  for (let c of children) {
    list.push({
      ...c._doc,
      children: MakeCategoriesList(categories, c._id),
    });
  }

  return list;
}
module.exports = MakeCategoriesList;
