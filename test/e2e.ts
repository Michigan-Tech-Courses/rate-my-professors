import test from 'ava';
import createRmpClient from '../src';

const michiganTechID = 'U2Nob29sLTYwMg==';
const ratings = createRmpClient(120000);

test('search for school', async t => {
  const schools = await ratings.searchSchool('michigan technological university');

  t.snapshot(schools);
});

test('search for non-existent school', async t => {
  const schools = await ratings.searchSchool('this school does not exist');

  t.is(schools.length, 0);
});

test('search for teacher', async t => {
  const teachers = await ratings.searchTeacher('shene', michiganTechID);

  t.snapshot(teachers);
});

test('search for non-existent teacher', async t => {
  const teachers = await ratings.searchTeacher('this teacher does not exist', michiganTechID);

  t.is(teachers.length, 0);
});

test('get details of teacher', async t => {
  const teacher = await ratings.getTeacher('VGVhY2hlci0yMjkxNjI=');

  t.is(teacher.firstName, 'Ching-Kuang');
  t.is(teacher.lastName, 'Shene');
});

test('get details with invalid ID', async t => {
  await t.throwsAsync(ratings.getTeacher('VGVhY2hlci1udWxs'));
});
