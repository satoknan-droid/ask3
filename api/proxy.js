import cheerio from "cheerio";

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

    let html =
      await response.text();

    const $ =
      cheerio.load(html);

    $("script").each((i, el) => {

      let src =
        $(el).attr("src");

      if(
        src &&
        src.startsWith("/")
      ){

        $(el).attr(
          "src",
          new URL(src, url).href
        );

      }

    });

    $("link").each((i, el) => {

      let href =
        $(el).attr("href");

      if(
        href &&
        href.startsWith("/")
      ){

        $(el).attr(
          "href",
          new URL(href, url).href
        );

      }

    });

    $("img").each((i, el) => {

      let src =
        $(el).attr("src");

      if(
        src &&
        src.startsWith("/")
      ){

        $(el).attr(
          "src",
          new URL(src, url).href
        );

      }

    });

    $("form").each((i, el) => {

      let action =
        $(el).attr("action");

      if(
        action &&
        action.startsWith("/")
      ){

        $(el).attr(
          "action",
          new URL(action, url).href
        );

      }

    });

    $("title").text(
      "ASK Browser"
    );

    $("meta").each((i, el) => {

      const httpEquiv =
        $(el).attr("http-equiv");

      if(
        httpEquiv &&
        httpEquiv.toLowerCase()
        === "content-security-policy"
      ){

        $(el).remove();

      }

    });

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

    res.status(200).send(
      $.html()
    );

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
