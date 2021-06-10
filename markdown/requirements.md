# **Software Requirements**

## **Vision :**

* **What is the vision of this product?**
   * The main vision of our web app is to give you the opportunity to find a partner with the same interest or need in fastest time.

* **What pain point does this project solve?**
   * Due to Covid-19, many gathering places are closed, So our web app will allow users to join and meet each other to break the distances between them.


* **Why should we care about your product?**
   * Our web application will provide you partners in many different activities, you can search for any partner you are looking for and when you find your partner you can go ahead and start working with him in a private room .


## **Scope :**

* **IN :**
   * User will be able to signUp and signIn 
   * User will be able to login from google account
   * User will be able to save his activities 
   * User will be able to search for specific partner
   * User will be able to see other requests from other users 
   * User will be able to start video chat with his partner 
   * User will be able to update or delete info and activities about him .

* **OUT :**
   * My website will never turn into an IOS or Android app.
  

## **Minimum Viable Product and Stretch Goals :**

* **MVP :**
  * As a user I can signUp and signIn 
  * As a user I can login from google account 
  * As a user I can save my interests and activities
  * As a user I can search for specific partner 
  * As a user I can see other requests from other users 
  * As a user I can join private room and start chat 
  * As a user I can update or delete my activities 
  * As a user I can receive and send messages

* **Stretch Goal :**
   * Making some frontend using ejs .

## **Functional Requirements :**
   * Each user can create an account 
   * Each user will save his own activities inside database
   * Each user can search for specific partner and send messages for others
   * Each user can receive messages from others
   * Each user can join a room and start video chat with other
   * Each user will render for him other related activities 
   * Every approved request will be deleted  

## **Data Flow :**
   * For the first time when the user enters the website we will render for him on the home page ('/') a description of our web application, then he will go to create his account by clicking on signUp ('/signup') then he will fill the form with username, password and his main activities , after that when the user  log in ('/login') and enter his username and password, he will go to their main profile, from which he can navigate and search for a specific partner ('/search/key'),then it will render for him specific  partners With his  input key search, he can send a message to the partner he chose and when he press accept, both of them will join private room and start chatting . Another thing from his own profile page he can press on explore ('/Explore') to find other requests based on his main activities and as mentioned above he can also send messages to the user who is looking for a partner and waiting if he accepts him to Join private room and start chatting.


## **Non-Functional Requirements**
   * **Usability :** 
     * It's easy for any one to create his account , start using the app ,   looking for other requests which it's related to his activities and finally it's too easy to search for your partner and start chat .

   * **Availability :**
     * Availability describes how likely the user will find his partner in short time .

   * **Security :**
     * To protect the user from unauthorized access, we would define the login flow with user roles defined .