import { gql } from 'apollo-angular';

const USER_TYPE = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
    }
`;

const GENDER = gql`
    enum Gender {
        male,
        female,
        other
    }
`;

// ${GENDER}
const EMPLOYEE_TYPE = gql`
    type Employee {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: Gender!
        salary: Float!
    }
`;

// ${USER_TYPE}
const LOGIN_RESPONSE = gql`
    type LoginResponse {
        user: User
        token: String
    }
`;

export const USER_INPUT = gql`
    input UserInput {
        username: String!
        email: String!
        password: String!
    }
`;

const EMPLOYEE_INPUT = gql`
    ${GENDER}

    input EmployeeInput {
        first_name: String!
        last_name: String!
        email: String!
        gender: Gender!
        salary: Float!
    }
`;

// const QUERIES = gql`
//     ${EMPLOYEE_TYPE}
//     ${LOGIN_RESPONSE}

//     type Query {
//         login(username: String!, password: String!): LoginResponse
//         getAllEmployees: [Employee]
//         getEmployeeById(_id: String!): Employee
//     }
// `;

// const MUTATIONS = gql`
//     ${USER_TYPE}
//     ${USER_INPUT}
//     ${EMPLOYEE_INPUT}
//     ${EMPLOYEE_TYPE}
    
//     type Mutation {
//         signup(user: UserInput!): User
//         addEmployee(employee: EmployeeInput!): Employee
//         updateEmployee(_id: String!, employee: EmployeeInput!): Employee
//         deleteEmployee(_id: String!): Boolean
//     }
// `;



export const LOGIN = gql`
    query login($username: String!, $password: String!){
        login(username: $username, password: $password){
            user{
                _id
                username
                email
            }
            token
        }
    }
`;

export const GET_ALL_EMPLOYEES = gql`
    query getAllEmployees{
        getAllEmployees{
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

export const GET_EMPLOYEE_BY_ID = gql`
    query getEmployeeById($_id: String!){
        getEmployeeById(_id: $_id){
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

// ${USER_INPUT}
export const SIGNUP = gql`
    mutation signup($user: UserInput!){
        signup(user: $user){
            _id
            username
            email
        }
    }
`;

// ${EMPLOYEE_INPUT}
export const ADD_EMPLOYEE = gql`
    mutation addEmployee($employee: EmployeeInput!){
        addEmployee(employee: $employee){
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

// ${EMPLOYEE_INPUT}
export const UPDATE_EMPLOYEE = gql`
    mutation updateEmployee($_id: String!, $employee: EmployeeInput!){
        updateEmployee(_id: $_id, employee: $employee){
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

export const DELETE_EMPLOYEE = gql`
    mutation deleteEmployee($_id: String!){
        deleteEmployee(_id: $_id)
    }
`;