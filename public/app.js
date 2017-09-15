$( document ).ready(function()
{
  $("#main").show();
  $('.modal').modal();
  $('#savedArticles').hide();
function scrape()
{
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function()
  {
    $.get("/articles", function(data)
    {
      $(".articles").empty();
      $("#commentArea").empty();
      for (var i = 0; i < data.length; i++)
      {
        // Display the apropos information on the page
        $(".articles").append(
          "<div class='collection'>"
            +"<h6 class='collection-item center-align'><a class='collection-item center-align' href='"+data[i].link+"'"+"><strong>"+ data[i].title +"</strong></a></h6>"
            +"<p class='collection-item'>"+ data[i].summary+"</p>"
            +"<button class='waves-effect waves-light btn save' data-id='"+data[i]._id+"'>SAVE</button>"
            +"<button class='waves-effect waves-light btn add' data-id='"+data[i]._id+"'>ADD COMMENT</button>"
            +"<button class='waves-effect waves-light btn view' data-id='"+data[i]._id+"'>VIEW COMMENTS</button></div>");
        }
      });
    });
}

$(".home").click(function()
{
  $("#main").show();
  $('#savedArticles').hide();
  scrape();
});

$(".saved").click(function()
{
  $("#main").hide();
  $.get("/getSavedArticles", function(data)
  {
    $("#savedStuff").empty();
    $("#commentArea").empty();
    for (var i = 0; i < data.length; i++)
    {
      // Display the apropos information on the page
      $("#savedStuff").append(
        "<div class='collection'>"
          +"<h6 class='collection-item center-align'><a class='collection-item center-align' href='"+data[i].link+"'"+"><strong>"+ data[i].title +"</strong></a></h6>"
          +"<p class='collection-item'>"+ data[i].summary+"</p>"
          +"<button class='waves-effect waves-light btn delete' data-id='"+data[i]._id+"'>Delete</button>"
          +"<button class='waves-effect waves-light btn add' data-id='"+data[i]._id+"'>ADD COMMENT</button>"
          +"<button class='waves-effect waves-light btn view' data-id='"+data[i]._id+"'>VIEW COMMENTS</button></div>");
      }
      $("#savedArticles").show();
    });

});

  //saves articles.
  $(document).on("click", ".save", function()
  {
    var thisId = $(this).attr("data-id");
    console.log("/saveArticle/"+ thisId);
    $.post("/saveArticle/"+thisId, function(data)
    {
      $("#main").hide();
      $("#savedArticles").show();
    });
  });

  //removes articles from saved
  $(document).on("click", ".delete", function()
  {
    var thisId = $(this).attr("data-id");
    console.log("/deleteArticle/"+ thisId);
    $.post("/deleteArticle/"+thisId, function(data)
    {
      console.log(data);
    });
  });

  //opens modal to save comment
  $(document).on("click", ".add", function()
  {
    $("#addbtn").empty();
    //adds button with id
    $("#addbtn").append("<button id='addSubmit' class='modal-action modal-close waves-effect waves-green btn-flat' data-id='"+$(this).attr("data-id")+"'>Submit</button>");
    //clears text
    $("#title").val("");
    $("#body").val("");
    $('#addComment').modal('open');
  });

  //saves comment to db
  $(document).on("click", "#addSubmit", function()
  {
    var thisId = $(this).attr("data-id");
    $.ajax({
    method: "POST",
    url: "/createNote/" + thisId,
    data: {
      // Value taken from title input
      title: $("#title").val(),
      // Value taken from note textarea
      body: $("#body").val()
    }
  }).done(function(data)
    {
      console.log(data);
    });
  });

  //used to look at comments
  $(document).on("click", ".view", function()
  {
    var thisId = $(this).attr("data-id");
    //console.log(thisId);
    //$("#commentArea").empty();
    $.get("/articles/"+thisId, function(data)
    {
      console.log(data);
      if(data.comment)
      {
        console.log(data);
        $("#commentArea").append(
          "<div class='collection'>"
          +"<h3 class='collection-item'>"+data.comment.title+"</h3>"
          +"<p class='collection-item'>"+data.comment.body+"</p>"
          +"</div>");
      }
      $('#viewComment').modal('open');
    });
  });

  scrape();
});
