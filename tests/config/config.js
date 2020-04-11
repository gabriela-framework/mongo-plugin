module.exports = {
    mongoDb: {
        localhost: true,
        dbName: process.env.MONGO_DB_NAME,
        collections: [
            'pages',
            'codeProjects',
            'directoryStructure',
            'fileStructure',
            'blog',
            'accounts',
            'uploadedFiles',
            'hashtags',
            'countries',
            'subscription',
        ],
        scope: 'public',
    }
}