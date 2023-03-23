import {GraphQLClient} from 'graphql-request';
import {
  autocompleteSchoolQuery,
  searchTeacherQuery,
  getTeacherQuery
} from './queries';
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
  numRatings: number;
  department: string;
  school: ISchoolFromSearch;
  legacyId: number;
  wouldTakeAgainPercent: number;
}

export const searchSchool = async (
  query: string
): Promise<ISchoolFromSearch[]> => {
  try {
    const response = await client.request(autocompleteSchoolQuery, {query});

    return response.autocomplete.schools.edges.map(
      (edge: { node: ISchoolFromSearch }) => edge.node
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in searchSchool:', error.message);
    } else {
      console.error('Error in searchSchool:', error);
    }

    return [];
  }
};

export const searchTeacher = async (
  name: string,
  schoolID: string
): Promise<ITeacherFromSearch[]> => {
  try {
    const response = await client.request(searchTeacherQuery, {
      text: name,
      schoolID
    });

    if (response.newSearch.teachers === null) {
      return [];
    }

    return response.newSearch.teachers.edges.map(
      (edge: { node: ITeacherFromSearch }) => edge.node
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in searchTeacher:', error.message);
    } else {
      console.error('Error in searchTeacher:', error);
    }

    return [];
  }
};

export const getTeacher = async (id: string): Promise<ITeacherPage> => {
  try {
    const response = await client.request(getTeacherQuery, {id});

    return response.node;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in getTeacher:', error.message);
    } else {
      console.error('Error in getTeacher:', error);
    }

    throw error;
  }
};

export default {searchSchool, searchTeacher, getTeacher};
