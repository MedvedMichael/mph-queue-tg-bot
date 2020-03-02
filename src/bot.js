const TelegramBot = require('node-telegram-bot-api')
const TOKEN = process.env.TOKEN
let firstPrihod = true;

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

bot.onText(/\/hat/,async(msg)=>{
    await bot.sendAnimation(msg.chat.id,'./ezgif-3-8778d6cac75c.gif')
    await bot.sendMessage(msg.chat.id, "Bezmenov style 😎😎😎")
})

const isAdmin = (username) => adminUsernames.findIndex(name => username === name) !== -1

bot.onText(/\/help/,(msg)=>{
    bot.sendMessage(msg.chat.id, '/startqueue@mph_test1_bot - starts (and restarts) the queue (only for adminkas)\n' +
     '/addme@mph_test1_bot - pushs your butt into the queue :)' + 
     '/getlist@mph_test1_bot - returns the shuffled list first, then without shuffling (only for adminkas)')
})

bot.onText(/\/startqueue/, (msg) => {
    if (!isAdmin(msg.from.username)) 
       return bot.sendMessage(msg.chat.id, "Don\'t touch this shit, you\'re not adminka!")
    
    queue = []
    bot.sendMessage(msg.chat.id, "The queue was started))))")
    
})

bot.onText(/\/addme/, (msg) => {
    if(queue === undefined)
      return bot.sendMessage(msg.chat.id, "Please start the queue)")
    const userName = msg.from.first_name + " " + msg.from.last_name
    const userId = msg.from.id

    const user = {
        userName,
        userId
    }

    const index = queue.findIndex(element => element.userId === user.userId)
    if (index !== -1)
        return bot.sendMessage(msg.chat.id, "Galayko, perelogyns\'ya, you\'re already in the queue!!!")

    queue.push({
        userName,
        userId
    })
    bot.sendMessage(msg.chat.id, "You\'ve been succesfully to the queue :)")
})

bot.onText(/\/getlist/, (msg) => {

    if(queue === undefined)
      return bot.sendMessage(msg.chat.id, "Please start the queue)")

    if(!isAdmin(msg.from.username))
       return bot.sendMessage(msg.chat.id, "Don\'t touch this shit, you\'re not adminka!!!")

    if(queue.length === 0)
      return bot.sendMessage(msg.chat.id, "There\'s no people in the list, add someone first)")
    
    if(firstPrihod){
       queue = shuffle(queue)
       firstPrihod = false
       bot.sendMessage(msg.chat.id, "I shuffled the list))), here it is:")
    }

    const stringList = getListForMessage()
    bot.sendMessage(msg.chat.id, stringList)
})

const getListForMessage = ()=>{
    let listString = 'THE LIST:\n'
    queue.forEach((pidr, index) => {
        listString += (index + 1) + '. ' + ((index === 0) ? '⭐️' : '') + pidr.userName + ((index === 0) ? '⭐️' : '') + ';\n'
    })
    return listString;
}