
// sort array of objects by nested date property
const sortElementsByDate = (calculations) => {
  return calculations.slice().sort(function (a, b) {
    // sort by datetime, descending from newest
    return new Date(b.datetime_created) - new Date(a.datetime_created);
  });
};
export { sortElementsByDate }
