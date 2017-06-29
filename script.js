/*
Have fun!
This is really messy! :)
*/

function daysInMonth(anyDateInMonth) {
    return new Date(anyDateInMonth.getYear(),
                    anyDateInMonth.getMonth()+1,
                    0).getDate();}


(function( $ ) {

    $.fn.scalendar = function( id,name ) {
      $(this).append("<h3>"+name+"</h3><span style='display: none' class='deleteuser'>X</span>")
      $(this).append("<div class='placeholder'><table><tr class='title'><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th></table><div class='selectfield'></div></div>");
      $(this).append("<span class='edit'>Edit</span><span style='display: none' class='delete'>Delete</span><span style='display: none' class='add'>Add</span><span style='display: none' class='close'>Close</span><span style='display: none' class='yes'>Yes</span><span style='display: none' class='no'>No</span>");
      let table = $(this).find("table");
      let days = 0;
      let date = new Date();
      //date = date.addDays(59);
      if(date.getDay() == 6) {date = date.addDays(2);}
      if(date.getDay() == 0) {date = date.addDays(1);}
      console.log(date.addDays(2),date.getDay(),new Date(date.getTime()+(1*24*60*60*1000)));
      let brake = false;
      var activeday;
      // DRAW CALENDAR
      var offdays;
      $.ajax({
        type: 'POST',
        url: "get.php",
        data: {uid:id},
        success: function(data) {

          offdays = JSON.parse(data);
          console.log(offdays)

        },
        async: false
      });
      console.log(date.getDate())
      var levercd = 0;
      var leverdone = true;
      var leverblock = false;
      for(let i=0;i<100;i++) {
          let j = 1;
          var dset = false;
          if(levercd > 0 && leverdone == false) {
            table.append("<tr class='title'><td colspan='5'>"+date.monthName()+"</td></tr>");
            leverdone = true;
            //break;

            i -= 2;
          } else {
            table.append("<tr class='days' id='"+i+"'></tr>");
            let row = table.find("tr.days#"+i).last();

          while(true) {
            if(days > 90+7*3) {
              brake = true;
              break;
            }
            //console.log(date.getDay());
            if(j<date.getDay() || dset > 0) {
              if(dset == false) {
                console.log(date.getDay())
                dset = date.getDay()-1;
                date = date.addDays(-date.getDay()+1)
              }
              var off = ""
              var comment = ""
              var from;
              var to;
              var btop = 0;
              for(let k=0;k<offdays.length;k++) {
                if(getJustDay(offdays[k][2])<= getJustDay(Date.parse(date)) && getJustDay(offdays[k][3])>=getJustDay(Date.parse(date))) {
                    off += (offdays[k][0] + " ");
                    comment += offdays[k][1];
                    from = offdays[k][2];
                    to = offdays[k][3];
                  }
              }
              row.append("<td class='day off' id='"+Date.parse(date)+"' data-day='"+date.getDay()+"'><span class='month'>"+(date.getMonth()+1)+"/</span>"+date.getDate()+"<div data-id='"+oid+"' title='"+comment+"' data-from='"+from+"' data-to='"+to+"' data-comment='"+comment+"' class='type "+off+"'></div></td>");
              date = date.addDays(1);
              dset -= 1;
            } else {
              var lever = "on ";
              levercd -= 1;
              if(((date.getDay() == 5 && daysInMonth(date) - date.getDate() < 2) || date.getDate() == daysInMonth(date)) && leverblock == false) {
                levercd = 6;
                leverdone = false;
              }
              if(levercd < 6 && levercd > 0) {
                lever = "off ";
              }
              if(date.getDay() == 1 && leverblock == false && lever == "off " && levercd >= 0) {
                date = date.addDays(-7);
                leverblock = true;
              }
              if(levercd == 0) {
                leverblock = false;
              }
              console.log(levercd,leverblock,leverdone)
                            var off = ""
              var comment = ""
              var oid;
              btop -= 1;
              if(date.getDate() < 5 && btop < 0) {
                btop = 5;
              }
              for(let k=0;k<offdays.length;k++) {
                  if(getJustDay(offdays[k][2])<= getJustDay(Date.parse(date)) && getJustDay(offdays[k][3])>=getJustDay(Date.parse(date))) {
                    off += (offdays[k][0] + " ");
                    comment += offdays[k][1];
                    from = offdays[k][2];
                    to = offdays[k][3];
                    oid = offdays[k][4]
                  }
              }
              //console.log(getJustDay(Date.parse(date)))
              //console.log(daysInMonth(date));

              console.log(levercd);
              var thatcell = row.append("<td class='day "+lever+"' id='"+Date.parse(date)+"' data-day='"+date.getDay()+"'><span class='month'>"+(date.getMonth()+1)+"/</span>"+date.getDate()+"<div data-id='"+oid+"' title='"+comment+"' data-from='"+from+"' data-to='"+to+"' data-comment='"+comment+"' class='type "+off+"'></div></td>");
              activeday = row.find("td#"+Date.parse(date));
              if(((date.getDate() == 1 && date.getDay() != 1))) {
                btop = 5;
              }
              date = date.addDays(1);
              /*if(date.getDay()== 4) {
                row.append("<h5 style='display:block;width: 100%'>Hallo</h5>")
              }*/
              if(date.getDate() == 1) {
              }
            }
            days++
            j++
            if(j == 6) {
              days += 2
              date = date.addDays(2)
              break;
            }
            }
          }
          if(brake == true) {break;}
      }

      // REMOVE ROWS WITH JUST GREY DATES
      $("table tr").each(function() {
        var matches = 0;
        $(this).find("td").each(function() {
          if($(this).hasClass("off")) {
            matches += 1;
          }
        });
        if(matches == 5) {
          $(this).remove();
        }
      })

      // SELECTION
      var selection = [];

      $("div#"+id+".calendar span.edit").click(function() {
        $(this).css("display","none");
        $("div#"+id+".calendar span.add").css("display","inline-block");
        $("div#"+id+".calendar span.close").css("display","inline-block");
        $("div#"+id+".calendar span.delete").css("display","inline-block");
        $("div#"+id+".calendar span.deleteuser").css("display","block");
        var isDragging = false;
        var start;
        $("div#"+id+".calendar table").mousedown(function(e) {
            isDragging = false;
            start = "";
            $(selection).each(function() {
              $(this).removeClass("selected");
            })
            elems = allElementsFromPoint(e.pageX,e.pageY)
            if(elems.last().className == "month") {
              elems = elems.slice(0, -1);
            }
            stop = false;
            for(q=0;q<elems.length;q++) {
              if($(elems[q]).hasClass("off") || $(elems[q]).hasClass("title")) {
                stop = true;
                break;
              }
            }
            if(stop == false) {


            $(elems[elems.length-1]).addClass("selected");
            selection.push(elems.last());

            $(this).mousemove(function(e) {
                console.warn("MOUSEMOVE")
                isDragging = true;
                let oldselection = selection;
                selection = [];
                if(start == "") {
                  start = allElementsFromPoint(e.pageX,e.pageY)
                  if(start.last().className == "month") {
                    start = start.slice(0, -1);
                  }
                }
                //console.log(start)
                var last = allElementsFromPoint(e.pageX,e.pageY)
                console.warn("FIRST OBJ GET");
                if(last.last().className == "month") { last = last.slice(0, -1); }
                console.log(last);
                console.log($(start[start.length-1]).parent().attr("id"));
                console.log(parseInt(start[start.length-2].id))
                var from = [parseInt($(start[start.length-1]).parent().attr("id")),$(start[start.length-1]).data("day")];
                var to = [parseInt($(last[last.length-1]).parent().attr("id")),$(last[last.length-1]).data("day")];
                console.log(from);
                if(to[0]-from[0] <= 0 && (to[1] < from[1] || to[0] - from[0] < 0)) {
                  var froms = $.extend( true, [], from );
                  from = $.extend( true, [], to );
                  to = $.extend( true, [], froms );
                }
                console.log(to,from)
                //console.log(from,to);
                for(let i=0;i<=to[0]-from[0];i++) {
                  for(let j=0;ifSelectThing(to,from,i,j);j++) {
                    if(i == 0) {
                      selection.push($("div#"+id+".calendar table tr#"+(from[0]+i)+" td[data-day="+(from[1]+j)+"]"));
                    } else {
                      selection.push($("div#"+id+".calendar table tr#"+(from[0]+i)+" td[data-day="+(j+1)+"]"));
                    }
                  }
                }
                //console.log(selection);
                if(oldselection != selection) {
                  $(oldselection).each(function() {
                    $(this).removeClass("selected");
                  })
                  $(selection).each(function() {
                    $(this).addClass("selected");
                  })
                }
             });
           }
        })
        $(document).bind("mouseup.ev"+id, function() {
            var wasDragging = isDragging;
            isDragging = false;
            $("div#"+id+".calendar table").unbind('mousemove');
        });
      });
      $("div#"+id+".calendar span.close").click(function() {
        $(document).unbind("mouseup.ev"+id);
        $("div#"+id+".calendar table").unbind("mousedown");
        $(selection).each(function() {
          $(this).removeClass("selected");
          selection = [];
        })
        $("div#"+id+".calendar span.add,div#"+id+".calendar span.delete,div#"+id+".calendar span.close").each(function() {
          $(this).css("display","none");
        })
        $("div#"+id+".calendar span.deleteuser").css("display","none");

        $("div#"+id+".calendar span.edit").css("display","inline-block");
      })

      $("div#"+id+".calendar span.add").click(function() {
        let go = true;
        $(selection).each(function() {
          if($(this).find("div.type")[0].className.replace(/\s+/g, '') != "type") {
            go = false;
            notify("Days selected are already marked")
          }
        });
        if(selection.length !== 0 && go == true) {
          $("div#"+id+".calendar span.add, div#"+id+".calendar span.delete, div#"+id+".calendar span.close").each(function() {
            $(this).css("display","none");
          })
          $("div#"+id+".calendar span.yes").css("display","inline-block");
          $("div#"+id+".calendar span.no").css("display","inline-block");

          $("div#"+id+".calendar span.no").bind("click.add",function() {
            backdo();
          })

          $("div#"+id+".calendar span.yes").bind("click.add",function() {
            if($("input[type='radio'][name='type"+id+"']:checked").length>0) {
              var oid;
              $.ajax({url:"add.php",data:{start:$(selection[0]).attr("id"),end:$(selection[selection.length-1]).attr("id"),type:$("input[type='radio'][name='type"+id+"']:checked").val(),comment:$("div#"+id+".calendar textarea").val(),uid:id,uname:name},async:false,method:'post',success:function(data) {oid=data;}});
              $(selection).each(function() {
                $(this).find("div.type").addClass($("div#"+id+".calendar input[type='radio'][name='type"+id+"']:checked").val());
                $(this).find("div.type").data("comment",$("div#"+id+".calendar textarea").val());
                $(this).find("div.type").data("from",$(selection[0]).attr("id"));
                $(this).find("div.type").data("to",$(selection[selection.length-1]).attr("id"));
                $(this).find("div.type").data("id",oid);

                //CHECK
                console.log("data id",$(this).find("div.type").data("id"),"to",$(this).find("div.type").data("to"),"from",$(this).find("div.type").data("from"),"comment",$(this).find("div.type").data("comment"))
              })
              backdo();
            }
          })
          function backdo() {
            $("div#"+id+".calendar span.no").unbind("click.add");
            $("div#"+id+".calendar span.yes").unbind("click.add");
            $("div#"+id+".calendar div.selectfield").empty();
            $("div#"+id+".calendar span.yes").css("display","none");
            $("div#"+id+".calendar span.no").css("display","none");
            $("div#"+id+".calendar span.add, div#"+id+".calendar span.delete, div#"+id+".calendar span.close").each(function() {
              $(this).css("display","inline-block");
            })
            $("div#"+id+".calendar div.selectfield").css("opacity",0).css("display","none");
          }

          // INSERT SELECTION STUFF
          $("div#"+id+".calendar div.selectfield").append("<div class='heightgetter'></div>");
          $("div#"+id+".calendar div.selectfield div.heightgetter").append("<div class='fancytitle'><span>Type</span></div>");
          $("div#"+id+".calendar div.selectfield div.heightgetter").append("<input type='radio' value='vacation' id='box"+id+"1' class='blue' name='type"+id+"'><label for='box"+id+"1'><span></span>Vacation</label>")
          $("div#"+id+".calendar div.selectfield div.heightgetter").append("<input type='radio' value='business' id='box"+id+"2' class='green' name='type"+id+"'><label for='box"+id+"2'><span></span>Business</label>")
          $("div#"+id+".calendar div.selectfield div.heightgetter").append("<input type='radio' value='sick' id='box"+id+"3' class='red' name='type"+id+"'><label for='box"+id+"3'><span></span>Undefined</label>")
          $("div#"+id+".calendar div.selectfield div.heightgetter").append("<input type='radio' value='homeoffice' id='box"+id+"4' class='cyan' name='type"+id+"'><label for='box"+id+"4'><span></span>Home Office</label>")
          $("div#"+id+".calendar div.selectfield div.heightgetter").append("<div class='fancytitle'><span>Comment</span></div>");
          $("div#"+id+".calendar div.selectfield").append("<textarea class='reason'></textarea>");
          setTimeout(function() {
            $("div#"+id+".calendar div.selectfield textarea").css("max-height",($("div#"+id+".calendar div.selectfield").height()-$("div#"+id+".calendar div.selectfield div.heightgetter").height()-16)+"px");
            $("div#"+id+".calendar div.selectfield textarea").css("min-height",($("div#"+id+".calendar div.selectfield").height()-$("div#"+id+".calendar div.selectfield div.heightgetter").height()-16)+"px");
          },1)
          $("div#"+id+".calendar div.selectfield").css("display","block").animate({opacity:1},200);
        } else {
          notify("Please select something");
        }
      })
      $("div#"+id+".calendar span.delete").click(function() {
        if(selection.length>0) {
          var offdelete = [];
          for(let p=0;p<selection.length;p++) {
            if(offdelete.length==0 || offdelete[offdelete.length-1][4] != $(selection[p]).find("div.type").data("id")) {
              if($(selection[p]).find("div.type")[0].className != "type ") {
                console.info("'"+$(selection[p]).find("div.type")[0].className+"'");
                var type;
                if($(selection[p]).find("div.type").hasClass("vacation")) {type='Vacation'}
                if($(selection[p]).find("div.type").hasClass("sick")) {type='Undefined'}
                if($(selection[p]).find("div.type").hasClass("business")) {type='Business'}
                if($(selection[p]).find("div.type").hasClass("homeoffice")) {type='Home Office'}
                console.log($(selection[p]).find("div.type").data("from"),$(selection[p]).find("div.type"))
                offdelete.push([parseInt($(selection[p]).find("div.type").data("from")),parseInt($(selection[p]).find("div.type").data("to")),$(selection[p]).find("div.type").data("comment"),type,$(selection[p]).find("div.type").data("id")]);
              }
            }
          }
          /*                if($(selection[p]).find("div.type").hasClass("vacation")) {type='vacation'}
                          if($(selection[p]).find("div.type").hasClass("sick")) {type='sick'}
                          if($(selection[p]).find("div.type").hasClass("business")) {type='business'}*/
          //                offdelete.push([$(selection[p]).find("div.type").data("from"),$(selection[p]).find("div.type").data("to"),$(selection[p]).find("div.type").data("comment"),type,$(selection[p]).find("div.type").data("id")]);

          $("div#"+id+".calendar div.selectfield").css("display","block").animate({opacity:1},200);
          $("div#"+id+".calendar div.selectfield").append("<div class='scrollbox'></div>");
          $("div#"+id+".calendar div.selectfield div.scrollbox").append("<div class='fancytitle'><span>Deleting</span></div>");
          $("div#"+id+".calendar div.selectfield div.scrollbox").niceScroll({cursorcolor: "#aaa",cursorborderradius:"0px",cursoropacitymax: 0.5});
          for(let q=0;q<offdelete.length;q++) {
            console.log(offdelete[q][0]);
            $("div#"+id+".calendar div.selectfield div.scrollbox").append("<div class='deleteitem'><span class='dti'>"+offdelete[q][3]+"</span><span class='df'>"+toShortDate(new Date(offdelete[q][0]))+"</span> - <span class='dt'>"+toShortDate(new Date(offdelete[q][1]))+"</span><span class='dc'>"+offdelete[q][2]+"</span></div>");
          }
          $("div#"+id+".calendar span.add, div#"+id+".calendar span.delete, div#"+id+".calendar span.close").each(function() {
            $(this).css("display","none");
          })
          $("div#"+id+".calendar span.yes").css("display","inline-block");
          $("div#"+id+".calendar span.no").css("display","inline-block");
          $("div#"+id+".calendar span.no").bind("click.delete",function() {
            backdo();
          })

          $("div#"+id+".calendar span.yes").bind("click.delete",function() {
            $("div#"+id+".calendar td").each(function() {
              for(let y=0;y<offdelete.length;y++) {
                if($(this).find("div.type").data("id") == offdelete[y][4]) {
                  $(this).find("div.type").data("id","");
                  $(this).find("div.type").data("from","");
                  $(this).find("div.type").data("to","");
                  $(this).find("div.type").data("comment","");
                  $(this).find("div.type").removeClass("vacation").removeClass("sick").removeClass("business").removeClass("homeoffice");
                }
              }
            })
            for(let w=0;w<offdelete.length;w++) {
              // added timeout b.c. just one event got deleted. With slower interval of request, all get.
              setTimeout(function() {
                $.post("delete.php",{id:offdelete[w][4]});
              },w*100)
            }
            backdo();
          })

          function backdo() {
            $("div#"+id+".calendar span.no").unbind("click.delete");
            $("div#"+id+".calendar span.yes").unbind("click.delete");
            $("div#"+id+".calendar div.selectfield").empty();
            $("div#"+id+".calendar span.yes").css("display","none");
            $("div#"+id+".calendar span.no").css("display","none");
            $("div#"+id+".calendar span.add, div#"+id+".calendar span.delete, div#"+id+".calendar span.close").each(function() {
              $(this).css("display","inline-block");
            })
            $("div#"+id+".calendar div.selectfield").css("opacity",0).css("display","none");
          }

        } else {
          notify("Select something first");
        }
      })
      $("div#"+id+".calendar span.deleteuser").click(function() {
        if(confirm("Do you want to delete this user?")) {
          $.post("deleteuser.php",{id:id},function() {$("div#"+id+".calendar").remove();});
        }
      })

      return this;
    };

}( jQuery ));

function getJustDay(date) {
  return Math.floor(date/86400000)
}

function notify(text) {
  console.log(text)
}

function ifSelectThing(to,from,i,j) {
  if(to[0]-from[0] == 0) {
    return (j+from[1])<=to[1];
  }
  else if(i == 0) {
    return (j+from[1])<6
  }
  else if(i == to[0]-from[0]) {
    return (j)<to[1]
  } else {
    return j<5;
  }
  return false
}
function toShortDate(date) {
  console.log(date,date.getMonth());
  return date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear();
}
function allElementsFromPoint(x, y) {
    y -= $(document).scrollTop()
    var element, elements = [];
    var old_visibility = [];
    while (true) {
        element = document.elementFromPoint(x, y);
        if (!element || element === document.documentElement) {
            break;
        }
        elements.push(element);
        old_visibility.push(element.style.visibility);
        element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
    }
    for (var k = 0; k < elements.length; k++) {
        elements[k].style.visibility = old_visibility[k];
    }
    elements.reverse();
    if($(elements.last()).hasClass("type")) {
      elements = elements.slice(0, -1);
    }
    return elements;
}
Date.prototype.monthName = function() {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[this.getMonth()];
}
Array.prototype.last = function() {return this[this.length-1];}

Date.prototype.addDays = function(days) {
  /*var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);*/
  ///return dat;
  let date = new Date(this.getTime()+(days*24*60*60*1000))
  return date
}
String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(function() {
  //$("div#1.calendar").scalendar(1,"Sebastian");
  //$("div#2.calendar").scalendar(2,"Sebastian");
  console.log("S");
  $.post("getusers.php",function(data) {
    // TO ARRAY AND SORT ALPHABETICALLY
    var users = JSON.parse(data).sort(function(a, b){
        if(a[1] < b[1]) return -1;
        if(a[1] > b[1]) return 1;
        return 0;
    });
    console.log(users);
    var user;
    for(var a=0;a<users.length;a++) {
      user = users[a];
      console.log(user[1]);
      $("body div.calendarbox").append("<div class='calendar' id='"+user[0]+"'></div>");
      $("div#"+user[0]+".calendar").scalendar(user[0],user[1].ucfirst());
    }
  })
  $("div.adduser span").click(function() {
    if($("div.adduser input").val() != "") {
      $.post("adduser.php",{name:$("div.adduser input").val()},function(data) { $("body div.calendarbox").append("<div class='calendar' id='"+data+"'></div>"); $("div#"+data+".calendar").scalendar(data,$("div.adduser input").val().ucfirst());});
    }
  });
})
