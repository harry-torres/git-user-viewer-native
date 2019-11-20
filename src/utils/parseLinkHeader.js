export default function parseLinkHeader(header) {
  if (header.length === 0) {
    throw new Error('input must not be of zero length');
  }

  // Split parts by comma
  const parts = header.split(',');
  const links = {};
  // Parse each part into a named link
  for (let i = 0; i < parts.length; i++) {
    const section = parts[i].split(';');
    if (section.length !== 2) {
      throw new Error("section could not be split on ';'");
    }
    const page = section[0].replace(/(.*)>/, '$1').split('page=')[1];
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = page;
  }
  return links;
}
