export default async function handler(req, res) {

  const url = req.query.url;

  if (!url) {
    return res.status(400).send("No URL");
  }

  try {

    const response = await fetch(url);

    let text = await response.text();

    res.setHeader(
      "Content-Type",
      "text/html"
    );

    res.status(200).send(text);

  } catch (err) {

    res.status(500).send("Proxy Error");

  }
}
