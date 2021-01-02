import {GraphQLClient} from 'graphql-request';
import {autocompleteSchoolQuery, autocompleteTeacherQuery, getTeacherQuery} from './queries';
import {AUTH_TOKEN} from './constants';

const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
  headers: {
    authorization: `Basic ${AUTH_TOKEN}`
  }
});

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
  department: string;
  school: ISchoolFromSearch;
}

const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
  const response = await client.request(autocompleteSchoolQuery, {query});

  return response.autocomplete.schools.edges.map((edge: { node: ISchoolFromSearch }) => edge.node);
};

const searchTeacher = async (query: string): Promise<ITeacherFromSearch[]> => {
  const response = await client.request(autocompleteTeacherQuery, {query});

  return response.autocomplete.teachers.edges.map((edge: { node: ITeacherFromSearch }) => edge.node);
};

const getTeacher = async (id: string): Promise<ITeacherPage> => {
  const response = await client.request(getTeacherQuery, {id});

  return response.node;
};

export default {searchSchool, searchTeacher, getTeacher};

