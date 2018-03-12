export default function setupRoutes(routes) {
    const result = [];
    for (const [path, handler] of Object.entries(routes)) {
        // collect named route params and turn string into regex
        const namedParams = []
        let regexPath = path.replace(/:([a-zA_Z]+)/g, match => {
            const param = match.slice(1);
            namedParams.push(param);
            return `([A-Za-z\-]+)`;
        });

        // escape slashes in route
        regexPath = regexPath.replace(/\//g, '\/');

        result.push({
            pattern: new RegExp(`^${regexPath}$`),
            namedParams: namedParams,
            handler: handler,
        });
    }

    return result;
}
