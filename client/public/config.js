window.env = {
    // Will be populated at runtime
    ...Object.fromEntries(
    Object.keys(import.meta.env)
        .filter(key => key.startsWith('VITE_APP_'))
        .map(key => [key, import.meta.env[key]])
    )
};
