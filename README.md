# Habit Tracker API

<hr/>

# Overview

##### This app uses an express api to create,read,update and delete habit trackers by interacting with an HTML front end.

<hr/>

# Technologies used

- html, css, vanilla/javascript
- bootstrap
- node.js 
- jest
- express.js
- mongodb / mongoose / atlas
- docker
- github
- slack
- trello
- excalidraw
- zoom

<hr/>

# Getting started
<i>how to run*</i>

* it is recommended you have docker desktop installed on your machine.

1) clone the Repo
0) navigate into the project directory your terminal.
0) run command: 
    - for windows :<code>bash _script/startDev.sh</code>
    - for linux :  <code>sudo bash _script/startDev.sh</code>

0) navigate to <strong>http://localhost:3000</strong> to view the api responses within your browser

- <strong><i>terminate the docker containers by replacing startDev.sh with teardown.sh in step 3</i></strong>

# API Endpoints

http://127.0.0.1:3000

### get
    - http://localhost:3000/users 
        searches database and returns ALL users if authenticated and authorized as ADMIN e.g. user.isAdmin = true;

    - http://localhost:3000/users/1 
        searches database for user with the id of 1
### post
    - http://localhost:3000/habits
        creates a new habit tracker and stores it inside the user model which is found by the accesstoken header
    
### post body JSON example:              
                {
                "id": "654dw6e5d6s54d6f5s4",
                "username":"fakeUsername",
                "email":"fake@email.com",
                "password":"fakepassword" * passwords are hashed+salted on registration"
                "habits":["array","of","habits"]
                }

# mongoDB and Atlas schema

    schema yet to be updated here soon...