use chat_app_database

db.dropDatabase()

use chat_app_database

db.createCollection("messages", { autoIndexID: true })
db.createCollection("rooms", { autoIndexID: true })
db.createCollection("users", { autoIndexID: true })
