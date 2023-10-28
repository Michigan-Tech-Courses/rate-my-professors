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

interface ISearchSchoolResponse {
  autocomplete: {
    schools: {
      edges: Array<{ node: ISchoolFromSearch }>;
    };
  };
}

interface ISearchTeacherResponse {
  newSearch: {
    teachers: {
      edges: Array<{ node: ITeacherFromSearch }>;
    } | null;
  };
}

interface IGetTeacherResponse {
  node: ITeacherPage;
}

const createRmpClient = (timeout = 5000) => {
  const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
    headers: {
      authorization: `Basic ${AUTH_TOKEN}`
    },
    fetch: fetch ?? crossFetch
  });

  const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
    const response: ISearchSchoolResponse = await client.request({
      document: autocompleteSchoolQuery,
      variables: {query},
      signal: AbortSignal.timeout(timeout)
    });

    return response.autocomplete.schools.edges.map((edge: { node: ISchoolFromSearch }) => edge.node);
  };

  const searchTeacher = async (name: string, schoolID: string): Promise<ITeacherFromSearch[]> => {
    const response: ISearchTeacherResponse = await client.request({
      document: searchTeacherQuery,
      variables: {
        text: name,
        schoolID
      },
      signal: AbortSignal.timeout(timeout)
    });

    if (response.newSearch.teachers === null) {
      return [];
    }

    return response.newSearch.teachers.edges.map((edge: { node: ITeacherFromSearch }) => edge.node);
  };

  const getTeacher = async (id: string): Promise<ITeacherPage> => {
    const response: IGetTeacherResponse = await client.request({
      document: getTeacherQuery,
      variables: {id},
      signal: AbortSignal.timeout(timeout)
    });

    return response.node;
  };

  return {searchSchool, searchTeacher, getTeacher};
};

export default createRmpClient;
