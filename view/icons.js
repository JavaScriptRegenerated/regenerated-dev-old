export function fetchGitHubIcon(repo, version, path) {
  return fetch(`https://cdn.jsdelivr.net/gh/${repo}@${version}${path}`, {
    cache: 'force-cache',
  }).then(res => res.text());
}

export function fetchSimpleIcon(name) {
  return fetchGitHubIcon(
    'simple-icons/simple-icons',
    '5.7.0',
    `/icons/${name}`,
  );
}

export function fetchHeroIcon(name) {
  return fetchGitHubIcon(
    'tailwindlabs/heroicons',
    '1.0.0',
    `/optimized/${name}`,
  );
}

export class IconElementHandler {
  static addToRewriter(rewriter) {
    rewriter.on('simple-icon, hero-icon', new IconElementHandler());
  }

  async element(element) {
    if (element.tagName === 'simple-icon') {
      const iconName = element.getAttribute('name');
      const source = await fetchSimpleIcon(iconName);
      element.replace(source, { html: true });
    } else if (element.tagName === 'hero-icon') {
      const iconName = element.getAttribute('name');
      const source = await fetchHeroIcon(iconName);
      element.replace(source, { html: true });
    } else {
      return;
    }
  }
}
