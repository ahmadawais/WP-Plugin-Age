/**
 * Main Script.
 *
 * Version 1.0.0
 */
( function( $ ) {
    console.clear();

    // Button.
    const btn = $( '.button' );

    // App.
    const appNotice = $( '.app .notice' );

    // Input.
    const inpt = $( '.slug' );

    // Age Calculator.
    function getAge( dateAdded ) {
        var
            pluginAdded = new Date( dateAdded ),
            today = new Date(),
            ageInMilliseconds = new Date( today - pluginAdded ),
            years = ageInMilliseconds / ( 24 * 60 * 60 * 1000 * 365.25 ),
            months = 12 * ( years % 1 ),
            days = Math.floor( 30 * ( months % 1 ) );
        return Math.floor( years ) + ' years ' + Math.floor( months ) + ' months ' + days + ' days';
    }

    // On click.
    $( 'form' ).on( 'submit', function( e ) {
        // No jerks. :P
        e.preventDefault();

        // Searching again.
        inpt.removeClass( 'is-danger' );


        // Loading...
        btn.addClass( 'is-loading' );

        // Loading
        appNotice.html( '<p>⌛️ Loading...</p>' );

        // Slug.
        let slug = inpt.val();

        if ( '' !== slug ) {
            // API URL.
            // const apiURL = 'https://api.wordpress.org/plugins/info/1.0/' + slug + '.json';

            // Build a GET request.
            $.ajax( {
                type: "POST",
                url: "https://api.wordpress.org/plugins/info/1.1/",
                data: {
                    action: "plugin_information",
                    request: {
                        slug: slug
                    }
                },
                success: function( data ) {
                    // Log data.
                    console.log( 'DATA: ', data );

                    // Should not be null.
                    if ( null === data ) {
                        // Not found.
                        appNotice.empty();
                        btn.removeClass( 'is-loading' );
                        inpt.addClass( 'is-danger' );
                        appNotice.append( '<div class="notification is-danger">There was no plugin found agains the slug: <span class="tag is-warning">' + slug + '</span></div>' );

                    } else {
                        // App Notice should be empty.
                        appNotice.empty();

                        // Plugin.
                        let plugin = data.name;

                        // Date.
                        let dateAdded = data.added;

                        // Age.
                        let age = getAge( dateAdded );

                        // Downloads
                        let downloads = data.downloaded.toLocaleString();
                        console.log( downloads );

                        // Success.
                        inpt.addClass( 'is-success' );
                        btn.removeClass( 'is-loading' );
                        btn.addClass( 'is-success' );
                        appNotice.append( '<div class="notification is-success">' + plugin + ' was added to the WordPress repository on <span class="tag is-warning">' + dateAdded + '</span> and the it\'s <span class="tag is-warning">' + age + '</span>  old.</div>' );
                        appNotice.append( '<div class="notification is-warning">It has been downloaded <span class="tag is-success">' + downloads + '</span> times.</div>' );
                        appNotice.append( '<a class="button is-success" href="' + data.download_link + '"> <span class="icon"><i class="fa fa-download"></i></span> <span>Download! — ' + plugin + ' </span> </a>' );
                    }
                },
                error: function( error ) {
                    console.log( 'ERROR: ', error.statusText );
                    appNotice.empty();
                    btn.removeClass( 'is-loading' );
                    inpt.addClass( 'is-danger' );
                    appNotice.append( '<div class="notification is-danger">There was an error: <span class="tag is-danger is-large">' + error.statusText + '</span></div>' );
                }
            } );

            // Log.
            function logResults( json ) {
                console.log( json );
            }
        } else {
            console.log( 'FAILED' );
            inpt.addClass( 'is-danger' );
            appNotice.append( '<div class="notification is-danger">Kindly, enter a slug!</div>' );
        }
    } );
} )( jQuery );
