const request = require('request');
const Database = require('./db.js');
const config = require("./config.json");

module.exports = {

  stats: function(msg) {
    findlink(msg).then((user) => {
      if (typeof user !== undefined) {
        returnKdcurrent(msg, user.platform.toLowerCase(), user.username).then((kd) => {
          switch (true) {
            case kd < 1:
              msg.member.addRole(config.rank1).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 1:
              msg.member.addRole(config.rank2).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 2:
              msg.member.addRole(config.rank3).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 3:
              msg.member.addRole(config.rank4).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 4:
              msg.member.addRole(config.rank5).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 5:
              msg.member.addRole(config.rank6).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 6:
              msg.member.addRole(config.rank7).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 7:
              msg.member.addRole(config.rank8).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 8:
              msg.member.addRole(config.rank9).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd == 9:
              msg.member.addRole(config.rank10).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
            case kd >= 10:
              msg.member.addRole(config.rank11).then(() => {
                msg.reply(config.rankmsg);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply(config.rankerr);
                return;
              });
              break;
          }
        }).catch(function(rej) {
          console.log(rej);
          msg.reply(config.rankerr);
          return;
        });
      }
    }).catch(function(rej) {
      console.log(rej);
      msg.reply('error occurred getting your rank. Contact an admin if this continues.');
      return;
    });
  },

  link: function(msg, args) {
    const username = args.join('%20');
    if (username === undefined) {
      msg.reply(`You didn't specify a fortnite user!`);
      return null;
    } else {
      checkUser('pc', username).then((user) => {
        if (user == '404') {
          checkUser('psn', username).then((user) => {
            if (user == '404') {
              checkUser('xbl', username).then((user) => {
                if (user == '404') {
                  msg.reply(`I couldn't find you on PC, PS4, or XBLive!`);
                  return;
                } else {
                  linkUser(msg, username, "xbl").then(() => {
                    msg.member.setNickname(username)
                    .catch(console.error);
                  }).catch(function(rej) {
                    console.log(rej);
                    msg.reply('error occurred when setting your name. Contact an admin if this continues.');
                    return;
                  });
                }
              }).catch(function(rej) {
                console.log(rej);
                msg.reply('error occurred when setting your name. Contact an admin if this continues.');
                return;
              });
            } else {
              linkUser(msg, username, "psn").then(() => {
                msg.member.setNickname(username)
                .catch(console.error);
              }).catch(function(rej) {
                console.log(rej);
                msg.reply('error occurred when setting your name. Contact an admin if this continues.');
                return;
              });
            }
          }).catch(function(rej) {
            console.log(rej);
            msg.reply('error occurred when setting your name. Contact an admin if this continues.');
            return;
          });
        } else {
          linkUser(msg, username, "pc").then(() => {
            msg.member.setNickname(username)
            .catch(console.error);
          }).catch(function(rej) {
            console.log(rej);
            msg.reply('error occurred when setting your name. Contact an admin if this continues.');
            return;
          });
        }
      }).catch(function(rej) {
        console.log(rej);
        msg.reply('error occurred when setting your name. Contact an admin if this continues.');
        return;
      });
    }
  }
};

function linkUser(msg, username, platform) {
  return new Promise((resolve, reject) => {
    Database.sql.get(`SELECT * FROM nick WHERE (ServerID, UserID, Fortnite, Platform) = (?, ?, ?, ?)`, [msg.guild.id, msg.author.id, username, platform]).then((check) => {
      if (typeof check === 'undefined') {
        Database.sql.run(`INSERT INTO nick (ServerID, UserID, Fortnite, Platform) VALUES (?, ?, ?, ?)`, [msg.guild.id, msg.author.id, username, platform]);
        msg.reply(`Linked User: "${username}" on Platform: "${platform}" to User: "${msg.author.tag}"`);
        resolve();
        return;
      } else {
        msg.reply(`You already have a linked account!`);
        resolve();
        return;
      }
    }).catch(function(rej) {
      console.log(rej);
      reject();
      return;
    });
  });
}

function checkUser(platform, username) {
  return new Promise((resolve, reject) => {
    const options = {
      'uri': `https://api.fortnitetracker.com/v1/profile/${platform}/${username}`,
      'headers': {
        'TRN-Api-Key': config.fnapi,
        'Content-Type': 'application/json'
      }
    };

    request(options, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      } else if (res.statusCode === 200) {
        data = JSON.parse(body);
        if (data.error) {
          resolve('404');
          return;
        } else {
          resolve();
          return;
        }
      }
    });
  });
}

function findlink(msg) {
  return new Promise((resolve, reject) => {
    Database.sql.get(`SELECT * FROM nick WHERE (ServerID, UserID) = (?, ?)`, [msg.guild.id, msg.author.id]).then((check) => {
      if (typeof check !== 'undefined') {
        resolve({
          "username": check.Fortnite,
          "platform": check.Platform
        });
        return;
      } else {
        resolve(undefined);
      }
    }).catch(function(rej) {
      reject(rej);
    });
  });
}

function returnKdcurrent(msg, platform, username) {
  return new Promise((resolve, reject) => {
    const options = {
      'uri': `https://api.fortnitetracker.com/v1/profile/${platform}/${username}`,
      'headers': {
        'TRN-Api-Key': config.fnapi,
        'Content-Type': 'application/json'
      }
    };

    request(options, (err, res, body) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      } else if (res.statusCode === 200) {
        data = JSON.parse(body);
        let squadKd = 0;

        if (data.error) {
          reject(data.error);
          return;
        }

        // Squad Wins
        if (data.stats.curr_p9) {
          let Kd = data.stats.curr_p9.kd.valueDec;
          let f = parseFloat(Kd) * 100;
          squadKd = (f / 100).toFixed();
        }
        resolve(squadKd);
      }
    });
  });
}
