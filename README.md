# Billed

Project carried out as part of the Front-End Web Development Career Path of OpenClassrooms.

## Table of contents
- [Table of contents](#table-of-contents)
  - [Summary](#summary)
    - [1) Fix some bugs identified](#1-fix-some-bugs-identified)
    - [2) Write additional tests](#2-write-additional-tests)
    - [3) Write an End-to-End test for the employee's path.](#3-write-an-end-to-end-test-for-the-employees-path)
  - [How to use](#how-to-use)
    - [Visualize the project](#visualize-the-project)
    - [Manage tests](#manage-tests)


### Summary
For this project, I had three tasks to complete:
#### 1) Fix some bugs identified
    - Sort bills by date (descending) in Bills page.
    - Fix login problem if user try to log as an admin.
    - Prevent invalid file upload.
    - Bug on dashboard when unfolding bills and trying to select them.

I have also fixed some visual bugs that I have noticed (set the lateral menu bar to "position: fixed", add some icons for a better User Experience) and linked the labels of the NewBill form to their respective inputs.

#### 2) Write additional tests
    - For the file `containers/Bills.js`.
    - For the file `container/NewBill`.

Here is the coverage report for the tests (currently 94.69% of the code is covered) :

#### 3) Write an End-to-End test for the employee's path.

You can read It in French or in English :
    - [Billed-E2E-parcours-employé]()
    - [Billed-E2E-employee-path]()

### How to use

#### Visualize the project

1) Run the backend :
    - Make sure that you are in the right directory `cd Billed-app-FR-Back-main`.
    - Run `yarn run:dev`.

2) Run the frontend :
    - Make sure that you are in the right directory `cd Billed-app-FR-Front-main`.
    - Make sure that [live-server](https://www.npmjs.com/package/live-server) is installed on your machine (run : `npm install -g live-server` to install It).
    - Run `live-server`.

3) Navigate in the APP :
    - In order to access the Bills page for employees, you need to be logged in. Here are the id and password :
        ```
        id : employee@test.tld
        password : employee
        ```

    - In order to access the Dashboard page for the admin, you need to be logged in. Here are the id and password :
        ```
        id : admin@test.tld
        password : admin
        ```

#### Manage tests

- To run a specific test : `yarn jest src/__tests__/Bills.js`
- To run coverage test : `yarn test`
- To see the coverage report, make sure that you are running the frontend, then use this URL : http://127.0.0.1:8080/coverage/lcov-report/

[⬆ Back to top](#billed)