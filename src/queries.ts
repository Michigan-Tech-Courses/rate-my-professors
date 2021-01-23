import {gql} from 'graphql-request';

export const autocompleteSchoolQuery = gql`
query AutocompleteSearchQuery(\n  $query: String!\n)
{
  autocomplete(query: $query) {
    schools {
      edges {
        node {
          id
          name
          city
          state
        }
      }
    }
  }
}`;

export const autocompleteTeacherQuery = gql`
query AutocompleteSearchQuery(\n  $query: String!\n)
{
  autocomplete(query: $query) {
    teachers {
      edges {
        node {
          id
          firstName
          lastName
          school {
            name
            id
          }
        }
      }
    }
  }
}`;

export const getTeacherQuery = gql`
query TeacherRatingsPageQuery(
  $id: ID!
) {
  node(id: $id) {
    ... on Teacher {
      id
      firstName
      lastName
      school {
        name
        id
        city
        state
      }
      avgDifficulty
      avgRating
      department
      numRatings
    }
    id
  }
}
`;
