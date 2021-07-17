function sanitize(title) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&grave;',
    };
    const reg = /[&<>"'/]/ig;
    return title.replace(reg, (match)=>(map[match]));
}
