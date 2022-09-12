exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
  const { count: totalRows, rows } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalRows / limit);
  return { rows, currentPage, totalPages, totalRows };
};

exports.getSort = (sort, models) => {
  let sortType;
  switch (sort) {
    case "skills":
      sortType = [[models.Skills, "name"]];
      break;
    case "name":
      sortType = [["name"]];
      break;
    default:
      sortType = null;
      break;
  }

  return sortType;
};
