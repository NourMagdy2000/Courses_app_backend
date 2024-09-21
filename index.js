const http = require("node:http");
const server = http.createServer(
    (req, res) => {
        if(req.url==='/')
        {res.end("home page")}
        else if(req.url==='/about'){res.end("about page")}
        else if(req.url==='/contact'){res.end("contact page")}
    
        }
    )

    server.listen(3001,()=>{console.log("server is listening on port 3001 !")});