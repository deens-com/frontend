import Parse from "parse";
import history from "./../../main/history";
import queryString from "query-string";

export const results_fetched = results => {
  return {
    type: "RESULTS_FETCHED",
    payload: results
  };
};

export const search_query_updated = search_query => {
  return {
    type: "SEARCH_QUERY_UPDATED",
    payload: search_query
  };
};

export const toggle_tag_from_search_query = (
  current_search_query,
  item_tag
) => {
  return dispatch => {
    let search_params = current_search_query;
    if (current_search_query.tags.length) {
      // if tags present in url
      let selected_tags_array = current_search_query.tags.splice("+");
      let tags_str = "";
      if (selected_tags_array.includes(item_tag)) {
        // if tag already present, remove it
        let new_arr = selected_tags_array.filter(tag => tag !== item_tag);
        selected_tags_array = new_arr;
        tags_str = new_arr.join("+");
      } else {
        // if tag was not present, add it
        selected_tags_array.push(item_tag);
        tags_str = selected_tags_array.join("+");
      }
      search_params.tags = selected_tags_array;
    } else {
      // If No tags yet
      if (item_tag) {
        search_params.tags.push(item_tag);
      }
    }
    dispatch(update_path(search_params));
    // will trigger update_search_query from results_container
  };
};

export const update_path = search_params => {
  return dispatch => {
    const query_params = {
      service_types: !search_params.type.length
        ? undefined
        : search_params.type.join("+"),
      start_date: search_params.start_date || undefined,
      end_date: search_params.end_date || undefined,
      person_nb: search_params.person_nb || undefined,
      //address: this.state.address,
      latitude: search_params.latitude || undefined,
      longitude: search_params.longitude || undefined,
      tags: !search_params.tags.length
        ? undefined
        : search_params.tags.join("+")
    };
    let query_arr = [];
    Object.entries(query_params).forEach(([key, value]) => {
      if(value){
        let to_concat = key + "=" + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join("&");
    // const query = queryString.stringify({
    //   service_types: !search_params.type.length
    //     ? undefined
    //     : search_params.type.join(" "),
    //   start_date: search_params.start_date || undefined,
    //   end_date: search_params.end_date || undefined,
    //   person_nb: search_params.person_nb || undefined,
    //   //address: this.state.address,
    //   latitude: search_params.latitude || undefined,
    //   longitude: search_params.longitude || undefined,
    //   tags: !search_params.tags.length
    //     ? undefined
    //     : search_params.tags.join(" ")
    // });
    history.push("/results?" + query_string);
    // will trigger update_search_query from results_container
  };
};

/* called from componentWillUpdate of results_container */
/* is triggered whenever service_types or tags props have changed */
export const update_search_query = search_params => {
  return dispatch => {
    dispatch(search_query_updated({ search_query: search_params }));
    dispatch(fetch_results(search_params));
  };
};

export const fetch_results = result_search_query => {
  return dispatch => {

    if(result_search_query.keywords){

      // let db_request = {"where": {
      //    "name": {
      //      "$text": {
      //       "$search": {
      //        "description": result_search_query.keywords
      //       }
      //      }
      //    }
      //  }
      // }
      /* curl -X GET  -H "X-Parse-Application-Id: myAppId"   -H "X-Parse-REST-API-Key: myMasterKey"   -G   --data-urlencode 'where={"name":{"$text":{"$search":{"$term":"food"}}}}'   http://api.please.docker/parse/classes/Service */
      /* Very useful to convert curl to fetch : https://kigiri.github.io/fetch/ */
      /* db.stores.createIndex( { name: "text", description: "text" } ) to create indexes */
      // first db.getCollection("Service").dropIndex("name_text")
      // then db.getCollection("Service").createIndex({ name: "text", description: "text" })

      fetch(`http://api.please.docker/parse/classes/Service?where={\"name\":{\"$text\":{\"$search\":{\"$term\":\"${result_search_query.keywords}\"}}}}`, {
         method: 'get',
         headers: new Headers({
           "X-Parse-Application-Id": "myAppId",
           "X-Parse-Master-Key": "myMasterKey"
         })
       }).then(response => response.json())
       .then(json_res => {
         let results = undefined;
         results = mapServiceObjects( json_res.results );
         dispatch(results_fetched({results: results}));
       }).catch(error => console.log(error))

    }else{

      Parse.Cloud.run("fetch_results_search_query", {
        search_query: result_search_query
      }).then(results => {
        dispatch(results_fetched(results));
      });

    }

  };
};















const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const get_service_image = mainPicture => {
  if (!mainPicture) {
    return "https://dummyimage.com/600x400/000/fff";
  }
  return mainPicture.url;
};

const mapServiceObjects = services => {
  return services.map(service => {
    service.excerpt = service.description;
    service.title = service.name;
    service.location = `${service.city} ${service.country}`;
    service.rating = getRandomInt(1, 5);
    service.reviews = getRandomInt(1, 100);
    service.price = service.pricePerSession || getRandomInt(200, 800);
    if (service.type === undefined) {
      service.image = service.picture.url;
    } else {
      service.image = get_service_image(service.mainPicture);
    }
    return service;
  });
};
