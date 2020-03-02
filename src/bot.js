const TelegramBot = require('node-telegram-bot-api')
const TOKEN = process.env.TOKEN

const bot = new TelegramBot(TOKEN, {
    polling: true
})

const adminUsernames = ['medved2001', 'irina_kolbun', 'Sun_Cream']
let queue;

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// bot.onText(/\/echo (.+)/, (msg, match) => {
//     let fromID = msg.from.id;
//     let resp = match[1]
//     bot.sendMessage(fromID, resp)
// })

const isAdmin = (username) => adminUsernames.findIndex(name => username === name) !== -1

bot.onText(/\/startQueue/, (msg) => {
    if (!isAdmin(msg.from.username)) 
       return bot.sendMessage(msg.chat.id, "Don\'t touch this shit, you\'re not adminka!")
    
    queue = []
    bot.sendMessage(msg.chat.id, "Queue started")
    
})

bot.onText(/\/addme/, (msg) => {
    if(queue === undefined)
      return bot.sendMessage(msg.chat.id, "Please start the queue")
    const userName = msg.from.first_name + " " + msg.from.last_name
    const userId = msg.from.id

    const user = {
        userName,
        userId
    }


    const index = queue.findIndex(element => element.userId === user.userId)
    if (index !== -1)
        return bot.sendMessage(msg.chat.id, "Noup")

    queue.push({
        userName,
        userId
    })
    bot.sendMessage(msg.chat.id, "Added")
})

bot.onText(/\/getlist/, (msg) => {

    if(queue === undefined)
      return bot.sendMessage(msg.chat.id, "Please start the queue")

    if(!isAdmin(msg.from.username))
       return bot.sendMessage(msg.chat.id, "Don\'t touch this shit, you\'re not adminka!")
    
    let listString = ''

    queue = shuffle(queue)
    queue.forEach((pidr, index) => {
        listString += (index + 1) + '. ' + pidr.userName + ';\n'
    })

    queue = undefined;

    if (listString === '')
        return bot.sendMessage(msg.chat.id, "No people in the list")
    
    bot.sendMessage(msg.chat.id, listString)
})