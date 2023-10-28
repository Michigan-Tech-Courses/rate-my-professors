import {GraphQLClient} from 'graphql-request';
import {fetch as crossFetch} from 'cross-fetch';
import {autocompleteSchoolQuery, searchTeacherQuery, getTeacherQuery} from './queries';
import {AUTH_TOKEN} from './constants';

export interface ISchoolFromSearch {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ITeacherFromSearch {
  id: string;
  firstName: string;
  lastName: string;
  school: {
    id: string;
    name: string;
  };
}

export interface ITeacherPage {
  id: string;
  firstName: string;
  lastName: string;
  avgDifficulty: number;
  avgRating: number;
  numRatings: number;
  department: string;
  school: ISchoolFromSearch;
  legacyId: number;
}

const createRmpClient = (timeout = 5000) => {
  const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
    headers: {
      authorization: `Basic ${AUTH_TOKEN}`
    },
    fetch: globalThis.fetch ?? crossFetch,
    timeout
  });

  const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
    const response = await client.request(autocompleteSchoolQuery, {query});

    return response.autocomplete.schools.edges.map((edge: { node: ISchoolFromSearch }) => edge.node);
  };

  const searchTeacher = async (name: string, schoolID: string): Promise<ITeacherFromSearch[]> => {
    const response = await client.request(searchTeacherQuery, {
      text: name,
      schoolID
    });

    if (response.newSearch.teachers === null) {
      return [];
    }

    return response.newSearch.teachers.edges.map((edge: { node: ITeacherFromSearch }) => edge.node);
  };

  const getTeacher = async (id: string): Promise<ITeacherPage> => {
    const response = await client.request(getTeacherQuery, {id});

    return response.node;
  };

  return {searchSchool, searchTeacher, getTeacher};
};

export default createRmpClient;
