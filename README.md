# PeerPair

**Group Members :**

1. Mousa Sabah
2. Farah Al-wahaibi
3. Furat Malkawi
4. Yasmeen Al-khateeb

## Description: 
PeerPair is website that enables users to find their a partner, wether it was for a project they are working on or need a study partner, or even a gaming partner.

## What problem does it solve?
A lot of things need a partner to be done, or might be better if you have a partner, but it is not easy to always find that partner in your actual community. Our website gives you the opportunity to find a partner with the same interest or need. For example, if you have an exam for a certain subject and another person also has an exam for that subject, you both can join and study with each other. Or if a group of gamers are missing a player they can find someone who is interested in that game.  

## User Stories
#### **Feature One** : 
As a user I want to be able to create an account. and sign in into that account, as well as having the ability to edit my information in the account. 
    **Feature Tasks:** 
        1. Create a form to allow users to sign up and sign in. 
        2. Save the user's information in the Database.
        2. Authenticate the user signing
        3. Authorize the user to edits his own profile and requests.
#### **Feature Two** : 
As a user I want to be able to send a request for a partner. 
    **Feature Tasks:** 
        1. Create a form to be filled by the user if he wants to send for a partner.
        2. Enable The user to specify in what field by implementing a dynamic list.
        3. The request is then saved into the database.
#### **Feature Three** : 
As a user I want to be able to check and search partners request shared by other users and to be able to join them.
    **Feature Tasks:** 
        1. Requests for partners will be displayed.
        2. Search bar to search through the request based on a specific criteria. 
        3. Button next to each request to allow users to pick that request.
#### **Feature Four** : 
As a user I want to receive a notification when ever the another user chooses to be my partner.
    **Feature Tasks:** 
        1. An event listener will be connect to the select button.
        2. A notification will be sent to the owner of request whenever some clicks on that button
#### **Feature Five** : 
As a user I want to be able to connect my partner in a suitable and easy way.
    **Feature Tasks:** 
        1. Implement rooms to allow partners to connect to each by chatting or video chat.
        2. Allow messages to stay in queue until seen by the other user. 
#### **Feature Six**:
As a user I want to have the ability to approve or reject other user's request to my partner request
    **Feature Tasks:** 
        1. An event listener will be connect to the approve or reject button.
        2. approved user will have the ability to connect and join the other user
        3. rejected users request will be removed from the database.



<br>

## Software Requirements

MarkDown File : [Software Requirements](markdown/requirements.md)

## Domain Modeling
Miro Link : [Domain Modeling](https://miro.com/welcomeonboard/TGFJRnBudXBHS0dCUEFYanZFTFo1Wm12TFF0Tmlad0xmR3hmSUtUVkUzWVdpNkhSSThITU04SXExcHFhTVcyNXwzMDc0NDU3MzU1MzkxNjAyMTM2)

![db-schema](assets/images/PeerPair.jpg)









## Database Schema Diagram 

<br>

 Data models and their responsibility in the application :

 * **User** : has properties such as login credentials (username,password), user_ID , interests and the identifiers of both user's sent and received requests . It has relationships with almost all other app data models . 

* **Pair-request** : has properties such as request_ID, user_ID (either it was a request sender/recipient) , category, description and any other needed  information about a request .

* **Profile** : It's were the app gathers all the information the user added to introduce himself to other users . It has properties like user_ID , age, user_bio , location
profile_image .

* **Conversation** 

* **Messege** 


<br>



![db-schema](assets/images/schema.jpg)


