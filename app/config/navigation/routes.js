import _ from "lodash";
import { FontIcons, FontAwesome } from "../../assets/icons";
import * as Screens from "../../screens/index";

export const MainRoutes = [
  {
    id: "SocialMenu",
    title: "个人信息",
    icon: FontIcons.profile,
    screen: Screens.ProfileSettings,
    children: [
      {
        id: "PhotoViewer",
        title: "照片",
        // icon: FontIcons.article,
        screen: Screens.PhotoViewer
      }
    ]
  },
  {
    id: "ArticlesMenu",
    title: "我的学生",
    icon: FontIcons.article,
    screen: Screens.MyChildProfile,
    children: [
      {
        id: "TeacherMeChat",
        title: "Teach & Me Chat",
        screen: Screens.TeacherMeChat,
        children: []
      },
      {
        id: "TeacherMeChatList",
        title: "Teach & Me Chat List",
        screen: Screens.TeacherMeChatList,
        children: []
      }
    ]
  },
  {
    id: "TeacherAnnoucementMenu",
    title: "老师通知",
    icon: FontIcons.mail,
    screen: Screens.TeacherNotices,
    children: []
  },
  {
    id: "ParentComCenterMenu",
    title: "家长互动",
    icon: FontIcons.navigation,
    screen: Screens.ParentComCenter,
    children: [
      {
        id: "ParentGroupChat",
        title: "",
        icon: FontIcons.navigation,
        screen: Screens.GroupChat,
        children: []
      }
    ]
  },
  {
    id: "PostsArea",
    title: "交流贴吧",
    icon: FontIcons.navigation,
    screen: Screens.MessagingMenu,
    children: [
      {
        id: "Posts",
        title: "家长贴吧",
        screen: Screens.Comments,
        children: []
      }
    ]
  },
  {
    id: "DashboardsMenu",
    title: "Dashboards",
    icon: FontIcons.dashboard,
    screen: Screens.DashboardMenu,
    children: [
      {
        id: "Dashboard",
        title: "Dashboard",
        screen: Screens.Dashboard,
        children: []
      }
    ]
  }
];

const menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: "GridV2",
  title: "Start",
  screen: Screens.GridV2,
  children: []
});

export const MenuRoutes = menuRoutes;
