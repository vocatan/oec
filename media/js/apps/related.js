// $("#toggle").toggle(
//   function(){
//     $("#toggle").css("bottom", 120);
//     $("#related").css("bottom", -1);
//     $("#related").css("visibility", "visible");
//     return false;
//   },
//   function(){
//     $("#toggle").css("bottom", -1);
//     $("#related").css("bottom", -121);
//     return false;
//   }
// )

// function placeFooter() {    
//     var windHeight = $(window).height();
//     var footerHeight = $('#related').height();
//     var offset = parseInt(windHeight) - parseInt(footerHeight);
//     $('#related').css('top',offset);
// }
// 
// $(function(){
//     $(window).resize(function(e){
//         placeFooter();
//     });
//     $(window).scroll(function(e){
//         placeFooter();
//     });
//     placeFooter();
//     // hide it before it's positioned
//     $('#related').css('display','inline');
// });

var rel_cat = $("#related div select").val();
show_related(rel_cat);

$("#related #toggle").toggle(function(e){
  $("#related").css("bottom", 0);
},function(){
  $("#related").css("bottom", -260);
});

$("#related select").change(function(e){
  var wdi_id = $(e.target).val();
  show_related(wdi_id);
})

function show_related(rel_cat){
  var country = $("#related select").data().country
  var year = $("#related select").data().year
  var url = "/similar_wdi/"+country+"/"+rel_cat+"/"+year+"/"

  var cur_index = 0;
  d3.json(url, function(json){
    cur_index = json.index
    make_related_boxes(json.values, cur_index, json.wdi, year)

    
    // Events
    $('#prev').unbind('click');
    $('#prev').click(function(){
      if(cur_index > 2){
        cur_index -= 5;
        make_related_boxes(json.values, cur_index, json.wdi, year)
      }
      return false;
    })
    $('#next').unbind('click');
    $('#next').click(function(){
      if(cur_index < json.values.length-3){
        cur_index += 5;
        make_related_boxes(json.values, cur_index, json.wdi, year)
      }
      return false;
    })
  })
}

function make_related_boxes(ordered_data, index, title, year){
  var request_type = get_request_type(window.location.pathname)
  var color = d3.scale.linear()
    .domain([1, ordered_data.length])
    .interpolate(d3.interpolateRgb)
    .range(["#7cbde2", "#fb9496"])
  related_boxes = $("div.related_item")
  related_boxes.each(function(i, box){
    var current_index = i-2;
    var rank = index+1+current_index;
    if(rank <= 0){
      $(box).css("visibility", "hidden");
      return;
    }
    if(rank > ordered_data.length){
      $(box).css("visibility", "hidden");
      return;
    }
    var name = ordered_data[index+current_index][0]
    var flag_name_3char = ordered_data[index+current_index][1].toLowerCase()
    // test for belgium
    var c_name_3char = flag_name_3char == "bel" ? "blx" : flag_name_3char;
    c_name_3char = flag_name_3char == "lux" ? "blx" : c_name_3char;
    var value = ordered_data[index+current_index][2]
    value = value >= 1 ? d3.format(",f")(value) : d3.format(".4f")(value);
    $(box).find("h4").html('<img src="/media/img/icons/flag_'+flag_name_3char+'.png"> '+name)
    $(box).find("iframe").attr("src", "http://atlas.media.mit.edu/embed/tree_map/" +
    request_type.trade_flow +
    "/" + c_name_3char + 
    "/" + request_type.country2 + 
    "/" + request_type.product + 
    "/" + year + "/?mouseover=false")
    $(box).find("p.value").text(title + ": " + value)
    $(box).find("p.rank").text(rank)
    $(box).css("border-color", color(rank));
    $(box).find("p.rank").css("background", color(rank));
    $(box).css("visibility", "visible");
  })
}



// 
// function make_related_boxes(title, data, cur_index){
//   var color = d3.scale.linear()
//     .interpolate(d3.interpolateRgb)
//     .range(["#7cbde2", "#fb9496"])
//     .domain([1, data.length]);
//     
//   related_boxes = $("div.related_item")
//   related_boxes.each(function(i, box){
//     var box_i = i-2;
//     var wdi_name = title;
//     // var rank = json.index+1+cur_index;
//     var rank = 1;
//     var name = data[json.index+cur_index][0]
//     var name_3char = data[json.index+cur_index][1].toLowerCase()
//     var value = data[json.index+cur_index][2]
//     $(box).find("h4").html('<img src="/media/img/icons/flag_'+name_3char+'.png"> '+name)
//     $(box).find("iframe").attr("src", "http://atlas.media.mit.edu/embed/tree_map/export/"+name_3char+"/all/show/"+year+"/")
//     $(box).find("p.value").text(wdi_name + ": " + d3.format(",f")(value))
//     $(box).find("p.rank").text(rank)
//     $(box).css("border-color", color(rank));
//     $(box).find("p.rank").css("background", color(rank));
//   })
// 
// }
