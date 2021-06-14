// https://stackoverflow.com/questions/54387939/how-to-actually-use-the-data-requested-using-discord-oauth2
export default function DiscordChallenge(req, res) {
    const challengeCode = req.query.code;

    console.log(req.query.code);
    console.log(challengeCode);

    res.send('Hello Discord!')
}
  
  