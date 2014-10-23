var CZ;
(function (CZ) {
    (function (Menus) {

        var isSignedIn  = false;
        var isEditor    = false;    // Note: isEditor should not be true unless isSignedIn is true

        function Update (isSignedIn, isEditor)
        {
            if (isSignedIn)
            {
                $('#mnuProfile')
                    .attr('title', 'My Profile / Sign Out')
                    .find('img').attr('src', '/images/profile-icon-green.png');
            }
            else
            {
                $('#mnuProfile')
                    .attr('title', 'Register / Sign In')
                    .find('img').attr('src', '/images/profile-icon.png');
            }

            if (isEditor)
            {
                $('#mnuCurate').removeClass('active').addClass('active');
            }
            else
            {
                $('#mnuCurate').removeClass('active');
            }
        }
        Menus.Update = Update;

        $(document).ready(function ()
        {
            var slideDownSpeed = 250;
            var slideUpSpeed = 'fast';


            // primary menu ui

            $('#mnu').children('li')

                .mouseenter(function (event)
                {
                    // show
                    if ($(this).hasClass('active'))
                    {
                        $(this).children('ul').slideDown(slideDownSpeed);
                    }
                })
                .mouseleave(function (event)
                {
                    // hide
                    $(this).children('ul').slideUp(slideUpSpeed);
                })


                // secondary menu ui

                .children('ul').children('li').click(function (event)
                {
                    event.stopPropagation();

                    if ($(this).children().hasClass('chevron'))
                    {
                        // has tertiary menu - sticky expand/hide
                        if ($(this).hasClass('active'))
                        {
                            // hide
                            $(this).children('.chevron').html('&#9654;'); // right chevron
                            $(this).removeClass('active').children('ul').slideUp(slideUpSpeed);
                        }
                        else
                        {
                            // show
                            $(this).children('.chevron').html('&#9698;'); // down chevron
                            $(this).addClass('active').children('ul').slideDown(slideDownSpeed);
                        }
                    }
                    else
                    {
                        // has no sub-menu - immediately hide drop-down
                        $(this).parent().slideUp(slideUpSpeed);
                    }
                })


                // tertiary menu ui

                .children('ul').children('li').click(function (event)
                {
                    event.stopPropagation();

                    // has no sub-menu - immediately hide drop-down
                    $(this).parent().parent().parent().slideUp(slideUpSpeed);
                });


            // hook menu items to display panels

            $('#mnuViewTours').click(function (event)
            {
                event.stopPropagation();
                alert('View Tours Panel');
            });

            $('#mnuViewSeries').click(function (event)
            {
                event.stopPropagation();
                alert('View Time Series Panel');
            });

            $('#mnuCurate').click(function (event)
            {
                if (!isSignedIn)
                {
                    alert('Profile Panel (Register / Log In)');
                }
            });

            $('#mnuCreateTimeline').click(function (event)
            {
                event.stopPropagation();
                alert('Create Timeline Panel');
            });

            $('#mnuCreateExhibit').click(function (event)
            {
                event.stopPropagation();
                alert('Create Exhibit Panel');
            });

            $('#mnuCreateTour').click(function (event)
            {
                event.stopPropagation();
                alert('Create Tour Panel');
            });

            $('#mnuEditTours').click(function (event)
            {
                event.stopPropagation();
                alert('Edit Tours Panel');
            });

            $('#mnuMine').click(function (event)
            {
                if (!isSignedIn)
                {
                    alert('Profile Panel (Register / Log In)');
                }
                else
                {
                    alert('My Collections Overlay');
                }
            });

            $('#mnuSearch').click(function (event)
            {
                alert('Search Panel');
            });

            $('#mnuProfile').click(function (event)
            {
                if (isSignedIn)
                {
                    alert('Profile Panel (My Profile / Log Out)');
                }
                else
                {
                    alert('Profile Panel (Register / Log In)');
                }
            });

        });

    })(CZ.Menus || (CZ.Menus = {}));
    var Menus = CZ.Menus;
})(CZ || (CZ = {}));