import _ from "lodash";
import populate from "./dataGenerator";
import users from "./raw/users";
import articles from "./raw/articles";
import notifications from "./raw/notifications";
import conversations from "./raw/conversations";
import chats from './raw/groupChats'; 

import cards from "./raw/cards";
import axisos from "axios";

class DataProvider {
  async saveProfile(profile) {
    //todo: include saving information, password, and save profile photo;
    console.log("user new profile :", profile);
    return true;
  }

  async getMyChildProfile(count = 2) {
    let users = await this.getRandomUser(count);

    (users[0].id = "0"), (users[0].name = "王涬之");
    users[0].photo = users[0].picture.large;
    users[0].className = "五五班";
    users[0].principleTeacher = "张曼";
    users[0].principleTeacherEmail = "wangman@163.com";
    users[0].activities = this.getArticles().slice(0, 2);

    (users[1].id = "1"), (users[1].name = "王淯之");
    users[1].photo = users[1].picture.large;
    users[1].className = "一三班";
    users[1].principleTeacher = "李雯";
    users[1].principleTeacherEmail = "liwen@gmail.com";
    users[1].activities = this.getArticles().slice(3, 10);

    return users;
  }

  async getOneUser(id = 1) {
    let url = "https://jsonplaceholder.typicode.com/users";
    let res = await axisos.get(url);
    return res.data;
    //  return await res.json();
    // return _.find(users, x => x.id === id);
  }

  async getHomeWork() {
    let fakeForChild1 = [
      {
        id: 1,
        url: "",
        type: "text", // text, picture, video
        desc: "阅读《勇敢的心》， 写读后感",
        teacher: {
          name: "张金平"
        },
        dateTime: "2019-02-01 14:36"
      }
    ];
    let fakeForChild2 = [
      {
        id: 2,
        url: "",
        type: "text", // text, picture, video
        desc: "第三册第五课，课后生词一遍",
        teacher: {
          name: "张老师"
        },

        dateTime: "2019-02-01 14:36"
      }
    ];

    let fakeHomeWork = [];
    fakeHomeWork.push(
      {
        childId: 0,
        homeWork: fakeForChild1
      }
      // {
      //   childId:1,
      //   homeWork: fakeForChild2
      // }
    );

    return fakeHomeWork;
  }

  async getTeachersNotices() {
    let fakeForChild1 = [
      {
        id: 1,
        url: "",
        type: "text", // text, picture, video
        content: "周五下午放学时间 3：30 ",
        teacher: {
          name: "张金平"
        },
        dateTime: "2019-02-01 14:36"
      }
    ];
    let fakeForChild2 = [
      {
        id: 2,
        url: "",
        type: "text", // text, picture, video
        content: "下周一郊游按时， 请家长准备20元车票钱， 午餐自备。",
        teacher: {
          name: "张老师"
        },

        dateTime: "2019-02-01 14:36"
      }
    ];

    let fakeNotices = [].concat(fakeForChild1).concat(fakeForChild2);

    return fakeNotices;
  }

  async getRandomUser(count = 10) {
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

  getArticles(type = "article") {
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
    console.log(chats.length, " chat length");
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

  getClassComments() {
    //on get comments of mine, and my children
    //fake
    let comments = this.getComments(1);

    return comments;
  }

  // get parent chat groups
  //
  async getMyChatGroups(parentUserId) {
    let chatGroup = [
      {
        id:1,
        groupName: "五年级五班家长群",
        lastMessage: {
          content: "这次郊游组织的真好",
          type: "text",
          uri: null,
          time: "8:13 am"
        }
      },
      {
        id:2,
        groupName: "三年级三班家长群",
        lastMessage: {
          content: "考试成绩出来没有,是知道📚怎么排名的吗，考试成绩出来没有,是知道📚怎么排名的吗，",
          type: "image",
          uri: "http://..1/image/.../",
          time: "6:16 pm"
        }
      }
    ];

    return chatGroup;
  }

  // get chat message by chat group Id
  //
   getChatsByChatGroupId = async(chatGroupId) =>{
    let thisGroupChats = _.clone(chats); 
    thisGroupChats = thisGroupChats.map(i=>{
      
      let user = this.getUser(i.fromUser.userId);  
      i.fromUser = user
      return  i;
    });

    return thisGroupChats;
  }

  // get posts from all parents
  // whose children are from this school
  // in the last half year
  // order by time descendent 
  async getParentPosts(parentUserId) {
    const posts = [
      {
        id: 1,
        url: "",
        type: "text", // text, picture, video
        content: "阅读《勇敢的心》， 写读后感",
        author: {
          id: 2,
          name: "张金平",
          avator: "http://.../"
        },
        dateTime: "2019-02-01 14:36"
      },
      {
        id: 2,
        url: "",
        type: "text", // text, picture, video
        content: "阅读《勇敢的心》， 写读后感",
        author: {
          id: 2,
          name: "张金平",
          avator: "http://.../"
        },
        dateTime: "2019-02-01 14:36"
      }
    ];

    return posts;
  }

  getCards() {
    return cards;
  }

  populateData() {
    populate();
  }
}

export const data = new DataProvider();
