/**
 * This file is used to reconfigure parts of the loader at runtime for this application. We've put this extra
 * configuration in a separate file, instead of adding it directly to the JSP
 *
 */
require({
    // The base path for all packages and modules.
    baseUrl:'./js/',

    // A list of packages to register.
    // You can't require "noc" and get noc/NocMain.js if you do not register the "noc" package
    // register all packages all the time to make life easier

    packages:[
        // If you are registering a package that has an identical name and location, you can just pass a string
        // instead, and it will configure it using that string for both the "name" and "location" properties. Handy!
        // ALSO look into the definition of "main" in package.json
        'dojo',
        'dijit',
        'dojox',
        'dgrid',
        'xstyle',
        'put-selector',
        'dbind',
        'noc',
        { name:'login', location:'login', main:'NocLogin' }
    ]
// Require `noc`. This loads the main application module, `noc/NocMain`, since we registered the `noc` package above.
}, [ 'login' ]);
