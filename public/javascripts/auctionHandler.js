$(document).ready(function() {

  // User clicked on an edit button
  $(".editButton").click(function () {
    window.location.href = "/auction/" + $(this)[0].id;
  });

  // User clicked on a delete button
  $(".deleteButton").click(function () {
    var auctionItemId = $(this)[0].id;

    $.ajax({
      url: "/auction",
      method: "DELETE",
      data: {
        auction_id: auctionItemId
      },
      success: function (response) {
        $("#auction_"+auctionItemId).remove();  // Remove the DOM element on success
      }
    });
  });



});
