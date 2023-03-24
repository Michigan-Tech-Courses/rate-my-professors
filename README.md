# 🧑‍🏫 @mtucourses/rate-my-professors

[![codecov](https://codecov.io/gh/Michigan-Tech-Courses/rate-my-professors/branch/master/graph/badge.svg?token=YSBV5T5GVY)](https://codecov.io/gh/Michigan-Tech-Courses/rate-my-professors)

A basic wrapper for Rate My Professors' GraphQL API, including TypeScript definitions. This package retrieves school and professor information with capabilities to retrieve detailed ratings of professors.

## 🚀 Getting Started

### Installation

To install the package, run:

```bash
npm install @mtucourses/rate-my-professors
or
pnpm install @mtucourses/rate-my-professors
```

# Usage

```ts
// Use the following line if using JavaScript instead of TypeScript
// const ratings = require('@mtucourses/rate-my-professors').default;
import ratings from "@mtucourses/rate-my-professors";

(async () => {
  // Search for a school
  const schools = await ratings.searchSchool("arizona state university");
  /*
  [
    ...response truncated for brevity
    {
      city: '',
      id: 'U2Nob29sLTEzNjQ3',
      name: 'Arizona State University',
      state: ''
    },
    {
      city: 'Tucson',
      id: 'U2Nob29sLTE1NzIz',
      name: 'Arizona State University',
      state: 'AZ'
    },
    ...response truncated for brevity
  ]
  */

  // Search for a teacher at a specific school
  const teachers = await ratings.searchTeacher(
    "steven osburn",
    "U2Nob29sLTEzNjQ3"
  );
  /*
  [
    {
      firstName: 'Steven',
      id: 'VGVhY2hlci0yMzAwOTAw',
      lastName: 'Osburn',
      school: { id: 'U2Nob29sLTEzNjQ3', name: 'Arizona State University' }
    }
  ]
  */

  // Get detailed information about a teacher
  const teacher = await ratings.getTeacher("VGVhY2hlci0yMzAwOTAw");
  /*
  {
    avgDifficulty: 2.5,
    avgRating: 4.3,
    department: 'Engineering',
    firstName: 'Steven',
    id: 'VGVhY2hlci0yMzAwOTAw',
    lastName: 'Osburn',
    legacyId: 2300900,
    numRatings: 79,
    school: {
      city: '',
      id: 'U2Nob29sLTEzNjQ3',
      name: 'Arizona State University',
      state: ''
    },
    wouldTakeAgainPercent: 88.8889
  }
  */
})();
```

# API

### `searchSchool(searchQuery: string): Promise<School[]>`

Searches for a school by its name.

### `searchTeacher(searchQuery: string): Promise<Teacher[]>`

Searches for a teacher by their name or school abbreviation.

### `getTeacher(teacherId: string): Promise<TeacherDetails>`

Retrieves detailed information about a teacher by their ID.

# Development

## Setup

```bash
# Install dependencies
yarn install
```

## Build

```bash
# Build in watch mode
yarn build:watch
```

## Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

# Contributors

[codetheweb](https://github.com/codetheweb)

[Leo6Leo](https://github.com/Leo6Leo)

[patrickdemers6](https://github.com/patrickdemers6)

[spabolu](https://github.com/spabolu)
