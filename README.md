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

### Minimum Viable Product:
1. A full functioning backend with minimum Css
2. A signup/ signin for users accounts
3. Rooms and chat to allow partners to interact with each other.



<br>

### Database Schema Diagram 

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


