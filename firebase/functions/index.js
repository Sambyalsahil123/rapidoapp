const admin = require('firebase-admin')
admin.initializeApp()

const triggers = require('./triggers')
const trip = require('./trips/trip')


// user reporting
const userReporting = require('./user-reporting/user-reporting')
const { onReportWrite } = require('./user-reporting/triggers')
exports.fetchBlockedUsers = userReporting.fetchBlockedUsers
exports.markAbuse = userReporting.markAbuse
exports.unblockUser = userReporting.unblockUser
exports.onReportWrite = onReportWrite

// chat
const chat = require('./chat/chat')
exports.fetchMessagesOfFormerParticipant = chat.fetchMessagesOfFormerParticipant
exports.listMessages = chat.listMessages
exports.insertMessage = chat.insertMessage
exports.deleteMessage = chat.deleteMessage
exports.createChannel = chat.createChannel
exports.markAsRead = chat.markAsRead
exports.updateTypingUsers = chat.updateTypingUsers
exports.addMessageReaction = chat.addMessageReaction

exports.listChannels = chat.listChannels





// Production triggers
exports.propagateUserProfileUpdates = triggers.propagateUserProfileUpdates

const stripe = require('./stripe/stripe')
exports.makeStripePayment = stripe.makeStripePayment

exports.tripDispatch = trip.dispatch

const imageProcessing = require('./core/imageProcessing')
exports.generateThumbnail = imageProcessing.generateThumbnail;
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
