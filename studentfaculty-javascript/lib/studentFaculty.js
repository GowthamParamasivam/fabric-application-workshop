/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');

class StudentFaculty extends Contract {

    async enrollStudent(ctx, name, department, age) {
        let commonName = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID');
        let studentId = commonName;
        
        let student = {
            id: studentId,
            name: name,
            department: department,
            age: age,
            type: 'student',
            courses: []
        };
        await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(student)));
        return JSON.stringify(student);
    }

    async getStudent(ctx) {
        let commonName = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID');
        let studentId = commonName;

        let studentAsBytes = await ctx.stub.getState(studentId);
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${studentId} does not exist`);
        }
        let student = JSON.parse(studentAsBytes.toString());
        if (student.type !== 'student') {
            throw new Error(`${studentId} is not a student`);
        }
        return studentAsBytes.toString();
    }

    async getStudentById(ctx, studentId) {
        // get the client msp id
        let mspId = ctx.clientIdentity.getMSPID();
        // check if the client msp id is not equal to the org2 msp id
        if (mspId !== 'Org2MSP') {
            throw new Error('You are not authorized to query student by Id');
        }
        let studentAsBytes = await ctx.stub.getState(studentId);
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${studentId} does not exist`);
        }
        let student = JSON.parse(studentAsBytes.toString());
        if (student.type !== 'student') {
            throw new Error(`${studentId} is not a student`);
        }
        return studentAsBytes.toString();
    }

    // function to enroll faculty
    async enrollFaculty(ctx, name, department, age) {
        let commonName = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID');
        let facultyId = commonName;

        // get the client msp id
        let mspId = ctx.clientIdentity.getMSPID();
        // check if the client msp id is not equal to the org2 msp id
        if (mspId !== 'Org2MSP') {
            throw new Error('You are not authorized to enroll faculty');
        }
        let faculty = {
            id: facultyId,
            name: name,
            department: department,
            age: age,
            type: 'faculty'
        };
        await ctx.stub.putState(facultyId, Buffer.from(JSON.stringify(faculty)));
        return JSON.stringify(faculty);
    }

    // function to get faculty
    async getFacultyById(ctx, facultyId) {
        // get the client msp id
        let mspId = ctx.clientIdentity.getMSPID();
        // check if the client msp id is not equal to the org2 msp id
        if (mspId !== 'Org2MSP') {
            throw new Error('You are not authorized to query faculty');
        }
        let facultyAsBytes = await ctx.stub.getState(facultyId);
        if (!facultyAsBytes || facultyAsBytes.length === 0) {
            throw new Error(`${facultyId} does not exist`);
        }
        let faculty = JSON.parse(facultyAsBytes.toString());
        if (faculty.type !== 'faculty') {
            throw new Error(`${facultyId} is not a faculty`);
        }
        return facultyAsBytes.toString();
    }

    async getFaculty(ctx) {
        let commonName = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID');
        let facultyId = commonName;

        let facultyAsBytes = await ctx.stub.getState(facultyId);
        if (!facultyAsBytes || facultyAsBytes.length === 0) {
            throw new Error(`${facultyId} does not exist`);
        }
        let faculty = JSON.parse(facultyAsBytes.toString());
        if (faculty.type !== 'faculty') {
            throw new Error(`${facultyId} is not a faculty`);
        }
        return facultyAsBytes.toString();
    }

    async queryAllStudents(ctx) {
        // get the client msp id
        let mspId = ctx.clientIdentity.getMSPID();
        // check if the client msp id is not equal to the org2 msp id
        if (mspId !== 'Org2MSP') {
            throw new Error('You are not authorized to query faculty');
        }
        let startKey = '';
        let endKey = '~';
        let resultsIterator = await ctx.stub.getStateByRange(startKey, endKey);
        let results = [];
        while (true) {
            let res = await resultsIterator.next();
            if (res.value && res.value.value.toString()) {
                let student = JSON.parse(res.value.value.toString('utf8'));
                if (student.type === 'student') {
                    results.push(student);
                }
            }
            if (res.done) {
                await resultsIterator.close();
                return JSON.stringify(results);
            }
        }
    }

    async queryAllFaculty(ctx) {
        // get the client msp id
        let mspId = ctx.clientIdentity.getMSPID();
        // check if the client msp id is not equal to the org2 msp id
        if (mspId !== 'Org2MSP') {
            throw new Error('You are not authorized to query faculty');
        }
        let startKey = '';
        let endKey = '~';
        let resultsIterator = await ctx.stub.getStateByRange(startKey, endKey);
        let results = [];
        while (true) {
            let res = await resultsIterator.next();
            if (res.value && res.value.value.toString()) {
                let faculty = JSON.parse(res.value.value.toString('utf8'));
                if (faculty.type === 'faculty') {
                    results.push(faculty);
                }
            }
            if (res.done) {
                await resultsIterator.close();
                return JSON.stringify(results);
            }
        }
    }

//  function to enroll course to the students
    async enrollCourse(ctx, courseName) {
        // get common name from the x509 certificate
        let commonName = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID');
        let studentId = commonName;
        let studentAsBytes = await ctx.stub.getState(studentId);
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${studentId} does not exist`);
        }
        let student = JSON.parse(studentAsBytes.toString());
        if (student.type !== 'student') {
            throw new Error(`${studentId} is not a student`);
        }
        // check if the student is already enrolled to the course
        if (student.courses.includes(courseName)) {
            throw new Error(`${studentId} is already enrolled to ${courseName}`);
        }
        // push the course name to the student courses array
        student.courses.push(courseName);
        await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(student)));
        return JSON.stringify(student);
    }
    }
    
module.exports = StudentFaculty;
