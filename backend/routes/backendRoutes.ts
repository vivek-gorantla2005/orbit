import { Router } from 'express'
import UserManagement from '../controllers/userManagement';
import FriendManagement from '../controllers/FriendsManagement'
import NotificationsProducer from '../controllers/NotificationsManagement'
import ConversationManagement from '../controllers/conversationManagement'
import FileManager from '../controllers/FileManager'
import { upload } from '../middleware/multer.middleware'
import { connectDB } from '../lib/mongoDB_setup';

const router = Router()

//user management
router.post('/signUp',UserManagement.signUp)
router.post('/login',UserManagement.login)
router.get('/getUser',UserManagement.getUsers)
router.get('/autocomplete',UserManagement.autocomplete)

//friendship management
router.post('/sendFriendReq',FriendManagement.addFriend)
router.post('/acceptReq',FriendManagement.acceptFriendRequest)
router.post('/deleteReq',FriendManagement.rejectFriendRequest)
router.post('/deleteFriend',FriendManagement.deleteFriend)
router.get('/getFriends',FriendManagement.getFriends)

//notifications
router.post('/friendReqNotifications',NotificationsProducer.sendFriendNotifications)


//conversations 
router.post('/sendMessage',ConversationManagement.sendMessage)
router.get('/getMessages',ConversationManagement.getMessages)
router.get('/todayConversations',ConversationManagement.TodayUserConversations)

//filemanager
router.post('/upload', upload.array('files'), FileManager.uploadFileCloudinary);

router.get('/test-db', async (req, res) => {
    const isConnected = await connectDB();
    if (isConnected) {
      res.status(200).json({ message: 'Database connected successfully' });
    } else {
      res.status(500).json({ message: 'Failed to connect to the database' });
    }
  });


export default router