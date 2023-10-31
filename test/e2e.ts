import test from 'ava';
import createRmpClient from '../src';

const michiganTechID = 'U2Nob29sLTYwMg==';
const smcID = 'U2Nob29sLTEzNzE=';
const ratings = createRmpClient(10000);

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

test('get departments', async t => {
  const departments = await ratings.getDepartments(smcID);

  t.true(departments.some(department => department.value === 'mathematics'));
});

test('get teachers by department', async t => {
  const mathDeptID = 'RGVwYXJ0bWVudC0zOA==';
  const mathTeachers = await ratings.getTeachersByDepartment(smcID, mathDeptID);

  t.true(mathTeachers.some(teacher => teacher.firstName === 'Hafedh' && teacher.lastName === 'Herichi'));
});
