export async function fetchWebsiteInfo(url: string) {
    try {
        const proxifiedUrl = `https://thingproxy.freeboard.io/fetch/${url}`;
        const response = await fetch(proxifiedUrl);
        const html = await response.text();

        // Create a virtual DOM element to parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract title
        const title = doc.querySelector('title')?.textContent?.trim() || '';

        // Extract description meta tag
        let description = '';
        const descriptionMeta = doc.querySelector('meta[name="description"]');
        if (descriptionMeta) {
            description = descriptionMeta.getAttribute('content')?.trim() || '';
        } else {
            const ogDescriptionMeta = doc.querySelector('meta[property="og:description"]');
            if (ogDescriptionMeta) {
                description = ogDescriptionMeta.getAttribute('content')?.trim() || '';
            }
        }

        // Extract favicon (icon) URL
        let iconUrl = '';
        const iconLink = doc.querySelector('link[rel="icon"]');
        if (iconLink) {
            iconUrl = iconLink.getAttribute('href') || '';
        } else {
            const shortcutIconLink = doc.querySelector('link[rel="shortcut icon"]');
            if (shortcutIconLink) {
                iconUrl = shortcutIconLink.getAttribute('href') || '';
            }
        }

        if(!iconUrl.startsWith('http')) {

            iconUrl = `${url}/${iconUrl}`;
        }

        return {
            title,
            description,
            iconUrl
        };
    } catch (error) {
        console.error('Error fetching website information:', error);
        return null;
    }
}
