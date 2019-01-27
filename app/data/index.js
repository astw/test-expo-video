import _ from 'lodash';
import populate from './dataGenerator';
import users from './raw/users';
import articles from './raw/articles';
import notifications from './raw/notifications';
import conversations from './raw/conversations';
import cards from './raw/cards';
import axisos from 'axios';

class DataProvider {

  async getMyChildProfile(id =1){ 
    let users = await this.getRandomUser(2);    
    let user = users[0];  
    user.name = "王涬之"
    user.photo = user.picture.large;  
    user.className = '五五班';
    user.principleTeacher = "张曼";
    user.principleTeacherEmail = "wangman@163.com";

    return user;
  }

  async getOneUser(id = 1) {
    
    let url = 'https://jsonplaceholder.typicode.com/users';
    let res = await axisos.get(url);  
    return res.data;
   //  return await res.json();
   // return _.find(users, x => x.id === id);
  }
  
  async getRandomUser(count = 10){
    let testUsers = `https://randomuser.me/api/?results=${count}`;
    let res = await axisos.get(testUsers);   
    return res.data.results;
  }

  getUser(id = 1) {
    return _.find(users, x => x.id === id);
  }

  getUsers() {
    return users;
  }

  getNotifications() {
    return notifications;
  }

  getArticles(type = 'article') {
    return _.filter(articles, x => x.type === type);
  }

  getArticle(id) {
    return _.find(articles, x => x.id === id);
  }


  getConversation(userId = 1) {
    return _.find(conversations, x => x.withUser.id === userId);
  }

  getChatList() {
    return conversations;
  }

  getComments(postId = 1) {
    return this.getArticle(postId).comments;
  }

  getCards() {
    return cards;
  }

  populateData() {
    populate();
  }
}

export const data = new DataProvider();
