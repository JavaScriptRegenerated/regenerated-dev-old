export function fetchGitHubIcon(repo, version, path) {
  return fetch(`https://cdn.jsdelivr.net/gh/${repo}@${version}${path}`, {
    // cache: 'force-cache',
    cf: {
      cacheTtlByStatus: { "200-299": 86400, 404: 1, "500-599": 0 },
      cacheEverything: true,
    }
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
    const iconName = element.getAttribute('name');
    let iconSource;

    if (element.tagName === 'simple-icon') {
      iconSource = await fetchSimpleIcon(iconName);
    } else if (element.tagName === 'hero-icon') {
      iconSource = await fetchHeroIcon(iconName);
    }

    if (iconSource === undefined) {
      return;
    }

    let wrapperSVGAttributes = [];
    if (element.hasAttribute('width')) {
      wrapperSVGAttributes.push(`width="${element.getAttribute('width')}"`)
    }
    if (element.hasAttribute('height')) {
      wrapperSVGAttributes.push(`height="${element.getAttribute('height')}"`)
    }
    if (element.hasAttribute('x')) {
      wrapperSVGAttributes.push(`x="${element.getAttribute('x')}"`)
    }
    if (element.hasAttribute('y')) {
      wrapperSVGAttributes.push(`y="${element.getAttribute('y')}"`)
    }

    const wrapperSVG = `<svg ${wrapperSVGAttributes.join(' ')}>${iconSource}</svg>`
    element.replace(wrapperSVG, { html: true });
  }
}
