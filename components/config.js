
module.exports = metas => Object.keys(metas).reduce((config, key) => {
    const meta = metas[key];
    if (process.env[key]) {
        const value = process.env[key];
        if (!value.length) {
            throw new Error(`Property '${key}' is empty'`);
        }
        if (meta.type === 'integer') {
            config[key] = parseInt(value);
        } else {
            config[key] = value;
        }
    } else if (meta.default !== undefined) {
        config[key] = meta.default;
    } else {
        const meta = metas[key];
        if (meta.required !== false) {
            throw new Error(
                `Missing required config '${key}' for the ${meta.description} e.g. '${meta.example}'`
            );
        }
    }
    return config;
}, {});
