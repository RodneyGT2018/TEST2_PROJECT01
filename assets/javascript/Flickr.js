
        $(document).ready(function () {
            $("#reset").click(function (e) {
                location.reload();
            });

            $("#submit").click(function (e) {
                $("#outputDiv").html("");

    
        var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + $("#search").val();
                $.ajax({
                    url: flickerAPI,
                    dataType: "jsonp", // jsonp
                    jsonpCallback: 'jsonFlickrFeed', // add this property
                    success: function (result, status, xhr) {
                        $.each(result.items, function (i, item) {
                            $("<img>").attr("src", item.media.m).appendTo("#outputDiv");
                            if (i === 10) {
                                return false;
                            }
                        });
                    },
                    error: function (xhr, status, error) {
                        console.log(xhr)
                        $("#outputDiv").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                    }
                });
        /*End*/
    
            });
        });
   