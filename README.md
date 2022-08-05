# 🧑‍🏫 @mtucourses/rate-my-professors

[![codecov](https://codecov.io/gh/Michigan-Tech-Courses/rate-my-professors/branch/master/graph/badge.svg?token=YSBV5T5GVY)](https://codecov.io/gh/Michigan-Tech-Courses/rate-my-professors)

A basic wrapper for Rate My Professors's GraphQL API. Includes TypeScript definitions.

It is possible to pull full ratings with content as well, but currently this package just returns the average.

## 🏗 Usage

```js
// Change to 
// const ratings = require('@mtucourses/rate-my-professors').default;
// if using JS instead of TS
import ratings from '@mtucourses/rate-my-professors';

(async () => {
  const schools = await ratings.searchSchool('michigan technological university');

  console.log(schools);
  /*
    [
      {
        city: 'Houghton',
        id: 'U2Nob29sLTYwMg==',
        name: 'Michigan Technological University',
        state: 'MI'
      }
    ]
  */

  const teachers = await ratings.searchTeacher('mtu shene');

  console.log(teachers);
  /*
    [
      {
        firstName: 'Ching-Kuang',
        id: 'VGVhY2hlci0yMjkxNjI=',
        lastName: 'Shene',
        school: {
          id: 'U2Nob29sLTYwMg==',
          name: 'Michigan Technological University'
        }
      }
    ] 
  */

  const teacher = await ratings.getTeacher('VGVhY2hlci0yMjkxNjI=');

  console.log(teacher);
  /*
    {
      avgDifficulty: 4.4,
      avgRating: 3.3,
      numRatings: 28,
      department: 'Computer Science',
      firstName: 'Ching-Kuang',
      id: 'VGVhY2hlci0yMjkxNjI=',
      lastName: 'Shene',
      school: {
        city: 'Houghton',
        id: 'U2Nob29sLTYwMg==',
        name: 'Michigan Technological University',
        state: 'MI'
      },
      legacyId: 1234567
    }
  */
})();
```

## 🧰  Development

```bash
# First:
# install dependencies
yarn install

# then:
# build in watch mode
yarn build:watch

# and you can:

# run tests
yarn test

# run tests in watch mode
yarn test:watch
```

To publish a new package version, run `npm version [patch|minor|major]` and then `git push && git push --tags` on the master branch.
