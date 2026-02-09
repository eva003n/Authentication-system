const userName = "admin"
const password = "1234"

async function basicAuth(req, res, next) {
  // basic authentication schema

  // client sends the credetials in http authorization header
  const credentials = req.headers.authorization;

  // no credetials prompt for credetials
  if (!credentials) {
    res.setHeader("WWW-Authenticate", "Basic realm='/basic'")
    return res.status(401).end();
  }

  // extract base 64 string and decode it
  const base64String = credentials.split(" ")[1];
  const buffer = Buffer.from(base64String, "base64");
  const [_username, _password] = buffer.toString("utf-8").split(":");

  // invalid credentials make client re-prompt
  if(userName !== _username && password !== _password) {
     res.setHeader("WWW-Authenticate", "Basic realm='/basic'")
    return res.status(401).end()

  }

  // valid credentials access resource
  next(); 

}
