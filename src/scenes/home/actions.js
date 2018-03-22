import Parse from "parse";

export const services_fetched = services => {
  return {
    type: "SERVICES_FETCHED",
    payload: services
  };
};

const bgColors = ["#7bbed6", "#82689a", "#75c1a5", "#ed837f", "#ffb777"];
const hoverBgColors = ["#84c5dd", "#9379ab", "#76caac", "#eb8e8a", "#ffc089"];

export const retrieve_popular_tags = services => {
  let services_with_tags = services.services.filter(
    service => service.tags && service.tags.length
  );
  let tags = [];
  services_with_tags.forEach(service => {
    tags.push(service.tags);
  });
  let flatten_tags = tags.reduce((flatten, arr) => [...flatten, ...arr]);
  let tag_recurrence_count_hash = new Map(
    [...new Set(flatten_tags)].map(x => [
      x,
      flatten_tags.filter(y => y === x).length
    ])
  );
  let tags_array = [];
  tag_recurrence_count_hash.forEach((k, v) =>
    tags_array.push({ tag: v, count: k })
  );
  let tags_ordered_by_count = tags_array.sort((a, b) => b.count - a.count);
  let tags_ordered_by_popularity = tags_ordered_by_count.map(tag => {
    let randBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    let randHoverBg =
      hoverBgColors[Math.floor(Math.random() * hoverBgColors.length)];
    return { label: tag.tag, background: randBg, hoverBg: randHoverBg };
  });
  // Ugly code to retrive popular tags but we might refactor tags data model in near future
  return {
    type: "POPULAR_TAGS_RETRIEVED",
    payload: tags_ordered_by_popularity
  };
};

export const fetch_services = () => {
  return dispatch => {
    let Service = Parse.Object.extend("Service");
    let query = new Parse.Query(Service);
    query.descending("createdAt");
    query
      .find()
      .then(response => {
        let str_services = JSON.stringify(response);
        let json_services = JSON.parse(str_services);
        dispatch(services_fetched({ services: json_services }));
        dispatch(retrieve_popular_tags({ services: json_services }));
      })
      .catch(error => {
        console.log(error);
      });
  };
};
