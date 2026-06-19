text = text
.replace(/href="\//g, `href="${url}/`)
.replace(/src="\//g, `src="${url}/`);
