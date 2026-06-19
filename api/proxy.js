export default async function handler(req, res) {

  let url = req.query.url;

  if (!url) {

    return res
    .status(400)
    .send("No URL");

  }

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {

    url = "https://" + url;

  }

  try {

    console.log(
      "Proxy Request:",
      url
    );

    const response = await fetch(url, {

      headers: {

        "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

        "Accept":
        "text/html,application/xhtml+xml",

        "Accept-Language":
        "ja,en-US;q=0.9,en;q=0.8"

      }

    });

    let text =
      await response.text();

    text = text

    .replace(
      /href="\//g,
      `href="${url}/`
    )

    .replace(
      /src="\//g,
      `src="${url}/`
    )

    .replace(
      /action="\//g,
      `action="${url}/`
    )

    .replace(
      /<title>(.*?)<\/title>/,
      "<title>ASK Browser</title>"
    )

    .replace(
      /integrity=".*?"/g,
      ""
    )

    .replace(
      /crossorigin=".*?"/g,
      ""
    );

    res.setHeader(
      "Content-Type",
      "text/html"
    );

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "X-Frame-Options",
      "ALLOWALL"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.status(200).send(text);

  } catch (err) {

    console.error(err);

    res.status(500).send(`

    <!DOCTYPE html>

    <html>

    <head>

    <title>
    Connection Failed
    </title>

    <style>

    body{

      background:#0f0f0f;

      color:white;

      font-family:sans-serif;

      text-align:center;

      padding-top:100px;
    }

    .box{

      background:#1e1e1e;

      width:400px;

      margin:auto;

      padding:30px;

      border-radius:20px;

      box-shadow:0 0 20px #000;
    }

    h1{

      color:#ff5555;
    }

    </style>

    </head>

    <body>

    <div class="box">

    <h1>
    Connection Failed
    </h1>

    <p>
    このサイトは読み込めませんでした
    </p>

    <p>
    URL:
    ${url}
    </p>

    <p>
    ${err}
    </p>

    </div>

    </body>

    </html>

    `);

  }

}
