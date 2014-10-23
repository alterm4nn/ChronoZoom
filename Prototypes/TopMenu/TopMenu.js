/*************
 * test mode *
 *************/

var isSignedIn  = false;
var isEditor    = false;    // Note: isEditor cannot be true unless isSignedIn is true
var isDisabled  = false;
var isHidden    = false;

$(document).ready(function()
{
    mnuRefresh();

    $('#btnToggleSignedIn').click(function(event)
    {
        isSignedIn  = !isSignedIn;
        isEditor    =  isSignedIn;
        mnuRefresh();
    });

    $('#btnToggleEditor').click(function(event)
    {
        if (isSignedIn)
        {
            isEditor = !isEditor;
        }
        mnuRefresh();
    });

    $('#btnToggleDisable').click(function(event)
    {
        isDisabled = !isDisabled;
        mnuRefresh();
    });

    $('#btnToggleHide').click(function(event)
    {
        isHidden = !isHidden;
        mnuRefresh();
    });
});



/*************
 * menu code *
 *************
    
    Menu is designed to get out of the way when not in focus, or when an action is clicked.
    However, when a sub-menu is present, clicking the expand/contract chevron line will not
    cause the menu to disappear, and in addition, the expanded/contracted state is remembered
    for future use when the menu is revisited. (Providing that a new page is not loaded.)
    
*/

$(document).ready(function()
{
    var slideDownSpeed  = 250;
    var slideUpSpeed    = 'fast';


    // primary menu ui

    $('#mnu').children('li')

        .mouseenter(function(event)
        {
            // show
            if ($(this).hasClass('active') && !$('#mnu').hasClass('disabled'))
            {
                $(this).children('ul').slideDown(slideDownSpeed);
            }
        })
        .mouseleave(function(event)
        {
            // hide
            $(this).children('ul').slideUp(slideUpSpeed);
        })


        // secondary menu ui

        .children('ul').children('li').click(function(event)
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

        .children('ul').children('li').click(function(event)
        {
            event.stopPropagation();

            // has no sub-menu - immediately hide drop-down
            $(this).parent().parent().parent().slideUp(slideUpSpeed);
        });
    
    
    // hook menu items to display panels

    $('#mnuViewTours').click(function(event)
    {
        event.stopPropagation();
        $('#status').text('View Tours Panel');
    });

    $('#mnuViewSeries').click(function(event)
    {
        event.stopPropagation();
        $('#status').text('View Time Series Panel');
    });

    $('#mnuCurate').click(function(event)
    {
        if (isDisabled) return;
        if (!isSignedIn)
        {
            $('#status').text('Profile Panel (Register / Log In)');
        }
        else
        {
            if (!isEditor)
            {
                alert('Sorry, you do not have edit rights to this collection.');
            }
        }
    });

    $('#mnuCreateTimeline').click(function(event)
    {
        event.stopPropagation();
        $('#status').text('Create Timeline Panel');
    });

    $('#mnuCreateExhibit').click(function(event)
    {
        event.stopPropagation();
        $('#status').text('Create Exhibit Panel');
    });

    $('#mnuCreateTour').click(function(event)
    {
        event.stopPropagation();
        $('#status').text('Create Tour Panel');
    });

    $('#mnuEditTours').click(function(event)
    {
        event.stopPropagation();
        $('#status').text('Edit Tours Panel');
    });

    $('#mnuMine').click(function(event)
    {
        if (isDisabled) return;
        if (!isSignedIn)
        {
            $('#status').text('Profile Panel (Register / Log In)');
        }
        else
        {
            $('#status').text('My Collections Overlay');
        }
    });

    $('#mnuSearch').click(function(event)
    {
        if (isDisabled) return;
        $('#status').text('Search Panel');
    });

    $('#mnuProfile').click(function(event)
    {
        if (isDisabled) return;
        if (isSignedIn)
        {
            $('#status').text('Profile Panel (My Profile / Log Out)');
        }
        else
        {
            $('#status').text('Profile Panel (Register / Log In)');
        }
    });

});


function mnuRefresh()
{
    $('#btnToggleSignedIn').attr('data-active', isSignedIn);
    $('#btnToggleEditor'  ).attr('data-active', isEditor  );
    $('#btnToggleDisable' ).attr('data-active', isDisabled);
    $('#btnToggleHide'    ).attr('data-active', isHidden  );

    if (isHidden)
    {
        $('#mnu').hide();
    }
    else
    {
        $('#mnu').show();
    }

    if (isDisabled)
    {
        $('#mnu').removeClass('disabled').addClass('disabled');
    }
    else
    {
        $('#mnu').removeClass('disabled');
    }

    if (isSignedIn)
    {
        // TODO: change from relative path once hosted
        $('#mnuProfile')
            .attr('title', 'My Profile / Sign Out')
            .find('img').attr('src', 'images/profile-icon-green.png');
    }
    else
    {
        // TODO: change from relative path once hosted
        $('#mnuProfile')
            .attr('title', 'Register / Sign In')
            .find('img').attr('src', 'images/profile-icon.png');
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