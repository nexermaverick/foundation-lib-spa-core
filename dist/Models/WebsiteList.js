export const hostnameFilter = (website, host, language, matchWildcard = true) => {
    const matchHost = (website.hosts ? website.hosts.filter(h => {
        if (matchWildcard && h.name === '*')
            return true;
        if (h.name !== host)
            return false;
        const hostLang = h.language ? (typeof h.language === 'string' ? h.language : typeof h.language === 'object' ? h.language.name : null) : null;
        return language && hostLang ? language === hostLang : true;
    }) : []).length > 0;
    return matchHost;
};
export const languageFilter = (website, language) => {
    if (!language)
        return true;
    const matchLang = !language || (website.languages ? website.languages.filter(l => {
        return l.name === language;
    }) : []).length > 0;
    return matchLang;
};
//# sourceMappingURL=WebsiteList.js.map