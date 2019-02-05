import _ from 'lodash';
import populate from './dataGenerator';
import users from './raw/users';
import articles from './raw/articles';
import notifications from './raw/notifications';
import conversations from './raw/conversations';
import cards from './raw/cards';
import axisos from 'axios';

class DataProvider {

  async getMyChildProfile(count =2){ 

    let users = await this.getRandomUser(count);    
  
    users[0].id ='0',
    users[0].name = "王涬之"
    users[0].photo = users[0].picture.large;  
    users[0].className = '五五班';
    users[0].principleTeacher = "张曼";
    users[0].principleTeacherEmail = "wangman@163.com";
    users[0].activities = this.getArticles().slice(0, 2);

    users[1].id ='1',
    users[1].name = "王淯之"
    users[1].photo = users[1].picture.large;  
    users[1].className = '一三班';
    users[1].principleTeacher = "李雯";
    users[1].principleTeacherEmail = "liwen@gmail.com"; 
    users[1].activities = this.getArticles().slice(3,10);
 
    return users;
  }

  async getOneUser(id = 1) {
    
    let url = 'https://jsonplaceholder.typicode.com/users';
    let res = await axisos.get(url);  
    return res.data;
   //  return await res.json();
   // return _.find(users, x => x.id === id);
  }

  async getHomeWork() {
    let fakeForChild1 =[
      {
        id:1, 
        url:'',
        type:'text', // text, picture, video 
        desc:'阅读《勇敢的心》， 写读后感', 
        teacher:{
          name: '张金平',
        },
        dateTime: '2019-02-01 14:36'
      } 
    ]
    let fakeForChild2 =[
       {
        id:2, 
        url:'',
        type:'text', // text, picture, video 
        desc:'第三册第五课，课后生词一遍',
        teacher:{
          name: '张老师',
        },

        dateTime: '2019-02-01 14:36'
      }
    ]

    let fakeHomeWork =[]
    fakeHomeWork.push(
      {
        childId:0,
        homeWork: fakeForChild1
      },
      // {
      //   childId:1,
      //   homeWork: fakeForChild2
      // } 
    ) 

    return fakeHomeWork;
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

  async getTeacherPrivateMessage(studentId) {
    // return this.getConversation();
    // TODO: get teacher private messages
    let chats = this.getChatList();
    console.log(chats.length,  ' chat length')
    let messages = _.clone(chats);
    messages[0].withUserId = 0;
    messages[1].withUserId = 1;
  
    return messages.slice(studentId, 2);
  }

  async postAComments(text) { 
    // TODO: post comments
    let comments = this.getComments();
    let comment = _.clone(comments[0]);  
    comment.id = comment.length;
    comment.text = text;
    comments.push(comment);
    return comments;
  }

  getClassComments(){
    //on get comments of mine, and my children 
    //fake
    let comments = this.getComments(1);
    
    return comments;
  }

  getCards() {
    return cards;
  }

  populateData() {
    populate();
  }
}

export const data = new DataProvider();
