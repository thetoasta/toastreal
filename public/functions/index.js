const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendPostNotification = functions.firestore
    .document('posts/{postId}')
    .onCreate(async (snapshot, context) => {
        const post = snapshot.data();
        const payload = {
            notification: {
                title: 'New Post!',
                body: `${post.nickname} said: ${post.content}`
            }
        };

        try {
            const usersSnapshot = await admin.firestore().collection('users').get();
            const tokens = [];
            usersSnapshot.forEach(userDoc => {
                const userData = userDoc.data();
                if(userData.fcmToken){
                    tokens.push(userData.fcmToken);
                }
            });
            payload.tokens = tokens;
            const response = await admin.messaging().sendMulticast(payload);
            console.log('Successfully sent message:', response);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });