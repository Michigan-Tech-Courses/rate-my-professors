import {GraphQLClient} from 'graphql-request';
import {fetch as crossFetch} from 'cross-fetch';
import {autocompleteSchoolQuery, searchTeacherQuery, getTeacherQuery, getTeachersByDepartmentQuery} from './queries';
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

interface ITeacherNode {
  __typename: string;
  avgDifficulty: number;
  avgRating: number;
  department: string;
  firstName: string;
  id: string;
  isSaved: boolean;
  lastName: string;
  legacyId: number;
  numRatings: number;
  school: {
    id: string;
    name: string;
  };
  wouldTakeAgainPercent: number;
}

interface ITeacherEdge {
  cursor: string;
  node: ITeacherNode;
}

interface IFilterOption {
  value: string;
  id: string;
}

export interface IFilter {
  field: string;
  options: IFilterOption[];
}

export interface ITeachersByDepartmentPage {
  search: {
    teachers: {
      didFallback: boolean;
      edges: ITeacherEdge[];
      filters: IFilter[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      resultCount: number;
    };
  };
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

interface ILibraryFunctions {
  searchSchool: (query: string) => Promise<ISchoolFromSearch[]>;
  searchTeacher: (name: string, schoolID: string) => Promise<ITeacherFromSearch[]>;
  getTeacher: (id: string) => Promise<ITeacherPage>;
  getDepartments: (schoolID: string) => Promise<IFilterOption[]>;
}

const createRmpClient = (timeout = 5000): ILibraryFunctions => {
  const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
    headers: {
      authorization: `Basic ${AUTH_TOKEN}`
    },
    fetch: fetch ?? crossFetch
  });

  const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
      controller.abort();
    }, timeout);

    const response: ISearchSchoolResponse = await client.request({
      document: autocompleteSchoolQuery,
      variables: {query},
      signal
    });

    return response.autocomplete.schools.edges.map((edge: { node: ISchoolFromSearch }) => edge.node);
  };

  const searchTeacher = async (name: string, schoolID: string): Promise<ITeacherFromSearch[]> => {
    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
      controller.abort();
    }, timeout);

    const response: ISearchTeacherResponse = await client.request({
      document: searchTeacherQuery,
      variables: {
        text: name,
        schoolID
      },
      signal
    });

    if (response.newSearch.teachers === null) {
      return [];
    }

    return response.newSearch.teachers.edges.map((edge: { node: ITeacherFromSearch }) => edge.node);
  };

  const getTeacher = async (id: string): Promise<ITeacherPage> => {
    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
      controller.abort();
    }, timeout);

    const response: IGetTeacherResponse = await client.request({
      document: getTeacherQuery,
      variables: {id},
      signal
    });

    return response.node;
  };

  const getDepartments = async (schoolID: string): Promise<IFilterOption[]> => {
    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
      controller.abort();
    }, timeout);

    const response: ITeachersByDepartmentPage = await client.request({
      document: getTeachersByDepartmentQuery,
      variables: {
        query: {
          departmentID: null,
          schoolID,
          fallback: true,
          text: ''
        },
        count: 8,
        cursor: ''
      },
      signal
    });

    if (response.search.teachers === null) {
      return [];
    }

    const departmentFilter: IFilter | undefined = response.search.teachers.filters.find(filter => filter.field === 'teacherdepartment_s');
    if (!departmentFilter) {
      return [];
    }

    return departmentFilter.options;
  };

  return {searchSchool, searchTeacher, getTeacher, getDepartments};
};

export default createRmpClient;
